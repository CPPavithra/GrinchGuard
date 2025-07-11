from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Any
from datetime import datetime
import asyncio, json, os, hashlib, random, httpx

router = APIRouter()
attack_logs_path = "attack_logs.json"
attack_clients = []

# WebSocket for live updates
@router.websocket("/ws")
async def attack_ws(websocket: WebSocket):
    await websocket.accept()
    attack_clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep alive
    except WebSocketDisconnect:
        attack_clients.remove(websocket)

async def broadcast_attack(log_entry: Dict[str, Any]):
    message = json.dumps(log_entry)
    for client in attack_clients:
        await client.send_text(message)

# REST Endpoint for fetching logs
@router.get("/logs")
async def get_all_attacks():
    try:
        with open(attack_logs_path, "r") as f:
            return json.load(f)
    except:
        return []

def save_attack_log(entry: Dict[str, Any]):
    try:
        with open(attack_logs_path, "r") as f:
            logs = json.load(f)
    except:
        logs = []

    logs.append(entry)
    with open(attack_logs_path, "w") as f:
        json.dump(logs, f, indent=2)

# Fetch IP metadata using ip-api.com
async def enrich_ip_metadata(ip: str) -> Dict[str, Any]:
    try:
        async with httpx.AsyncClient() as client:
            url = f"http://ip-api.com/json/{ip}?fields=status,country,city,isp,org,mobile,proxy,hosting,countryCode"
            response = await client.get(url)
            data = response.json()
            if data.get("status") == "success":
                return {
                    "country": data.get("country"),
                    "city": data.get("city"),
                    "isp": data.get("isp"),
                    "org": data.get("org"),
                    "mobile": data.get("mobile", False),
                    "proxy": data.get("proxy", False),
                    "hosting": data.get("hosting", False),
                    "country_code": data.get("countryCode"),
                }
    except Exception as e:
        print(f"IP enrichment failed: {e}")
    return {}

# Real-time attack simulation with IP enrichment
async def simulate_attack(kind: str):
    spoofed_ip = f"45.13.{random.randint(0, 255)}.{random.randint(0, 255)}"  # more believable than 192.168.*

    headers = {
        "User-Agent": "Mozilla/5.0 (GrinchBot)" if "header" in kind else "ClickBot/999",
        "X-Forwarded-For": spoofed_ip,
        "Referer": "/checkout_fake" if kind == "fake_checkout" else "/home"
    }

    path_map = {
        "honeypot": "/deals/special-offer",
        "header_spoofing": "/product/42",
        "click_flooding": f"/product/{random.randint(1, 50)}",
        "fake_checkout": "/checkout_fake"
    }

    ip_metadata = await enrich_ip_metadata(spoofed_ip)

    entry = {
        "timestamp": datetime.now().isoformat(),
        "attack_type": kind.replace("_", " ").title(),
        "fingerprint": hashlib.sha256(f"{headers['User-Agent']}_{spoofed_ip}".encode()).hexdigest(),
        "request_path": path_map[kind],
        "headers": headers,
        "severity": random.choice(["Low", "Medium", "High"]),
        **ip_metadata
    }

    save_attack_log(entry)
    await broadcast_attack(entry)

# Trigger attack simulation
@router.post("/simulate/{attack_type}")
async def simulate(attack_type: str):
    valid_attacks = ["honeypot", "header_spoofing", "click_flooding", "fake_checkout"]
    if attack_type not in valid_attacks:
        return {"error": "Invalid attack type"}
    await simulate_attack(attack_type)
    return {"status": "Simulated", "attack": attack_type}

