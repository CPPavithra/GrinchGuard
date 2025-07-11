# ✅ auth.py - Full version with real-time stolen info + breach detection

from fastapi import APIRouter, Request, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any
import json, os, requests
from dotenv import load_dotenv
from blocklist import (
    is_ip_blocked,
    is_fingerprint_blocked,
    block_ip,
    block_fingerprint
)

router = APIRouter()

USER_DB_FILE = "users.json"
FINGERPRINT_MAP_FILE = "fingerprint_map.json"
STOLEN_LOG_FILE = "stolen_attempts.json"
stolen_clients: List[WebSocket] = []

# Load .env for RapidAPI Key
load_dotenv()
API_KEY = os.getenv("RAPIDAPI_KEY")

class LoginData(BaseModel):
    email: str
    password: str
    fingerprint: str

def load_user_db():
    if not os.path.exists(USER_DB_FILE): return []
    with open(USER_DB_FILE, "r") as f:
        return json.load(f)

def save_fingerprint(email: str, fingerprint: str):
    if not os.path.exists(FINGERPRINT_MAP_FILE):
        with open(FINGERPRINT_MAP_FILE, "w") as f:
            json.dump([], f)

    with open(FINGERPRINT_MAP_FILE, "r") as f:
        data = json.load(f)

    if any(entry["email"] == email and entry["fingerprint"] == fingerprint for entry in data):
        return

    data.append({
        "email": email,
        "fingerprint": fingerprint,
        "timestamp": datetime.utcnow().isoformat()
    })
    with open(FINGERPRINT_MAP_FILE, "w") as f:
        json.dump(data, f, indent=2)

def detect_abuse(fingerprint: str) -> List[str]:
    if not os.path.exists(FINGERPRINT_MAP_FILE): return []
    with open(FINGERPRINT_MAP_FILE, "r") as f:
        data = json.load(f)
    emails = [entry["email"] for entry in data if entry["fingerprint"] == fingerprint]
    return list(set(emails))

def check_email_breach(email: str) -> bool:
    url = "https://breachdirectory.p.rapidapi.com/"
    querystring = {"func": "auto", "term": email}
    headers = {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "breachdirectory.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params=querystring)
        if response.status_code != 200:
            print(f"[Breach Check] API Error {response.status_code}: {response.text}")
            return False
        data = response.json()
        return data.get("success") is not False
    except Exception as e:
        print(f"[Breach Check] Exception: {e}")
        return False

async def broadcast_stolen_event(log: Dict[str, Any]):
    for client in stolen_clients:
        await client.send_text(json.dumps(log))

@router.websocket("/ws/stolen-attempts")
async def stolen_ws(websocket: WebSocket):
    await websocket.accept()
    stolen_clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        stolen_clients.remove(websocket)

@router.get("/stolen-logs")
async def get_stolen_logs():
    if not os.path.exists(STOLEN_LOG_FILE):
        return []
    with open(STOLEN_LOG_FILE, "r") as f:
        return [json.loads(line) for line in f.readlines()]

@router.get("/device-abuse")
def get_abused_devices():
    if not os.path.exists(FINGERPRINT_MAP_FILE):
        return []

    with open(FINGERPRINT_MAP_FILE, "r") as f:
        data = json.load(f)

    # Map fingerprints to associated emails
    fingerprint_map = {}
    for entry in data:
        fp = entry["fingerprint"]
        fingerprint_map.setdefault(fp, []).append(entry["email"])

    # Return fingerprints used by ≥3 unique accounts
    abused = []
    for fp, emails in fingerprint_map.items():
        unique_emails = list(set(emails))
        if len(unique_emails) >= 3:
            abused.append({
                "fingerprint": fp,
                "emails": unique_emails,  # ✅ renamed for frontend match
                "count": len(unique_emails)
            })

    return abused

@router.get("/remediation-log")
def remediation_log():
    path = "data/remediation_log.json"
    if not os.path.exists(path):
        return []
    with open(path, "r") as f:
        return json.load(f)

@router.post("/login")
async def login(data: LoginData, request: Request):
    ip = request.client.host
    fingerprint = data.fingerprint

    # 🔐 Step 1: Blocked IP or Fingerprint
    if is_ip_blocked(ip):
        return {
            "status": "fail",
            "alert": "Blocked IP",
            "reason": "Access denied due to threat detection"
        }

    if is_fingerprint_blocked(fingerprint):
        return {
            "status": "fail",
            "alert": "Blocked Device",
            "reason": "Device fingerprint flagged as abusive"
        }

    # 🕵️ Step 2: Check Proxy Headers (basic)
    if request.headers.get("x-forwarded-for") or request.headers.get("via"):
        block_ip(ip)
        return {
            "status": "fail",
            "alert": "Proxy Blocked",
            "reason": "Suspicious proxy usage detected"
        }

    # 🧠 Step 3: Normal login flow
    user_db = load_user_db()
    user = next((u for u in user_db if u["email"] == data.email), None)

    if user is None:
        return {"status": "fail", "reason": "User not found"}

    if user["password"] != data.password:
        # ✍️ Log stolen attempt
        log = {
            "timestamp": datetime.utcnow().isoformat(),
            "email": data.email,
            "ip": ip,
            "fingerprint": fingerprint,
            "event": "Stolen Credential Attempt"
        }
        with open(STOLEN_LOG_FILE, "a") as f:
            f.write(json.dumps(log) + "\n")
        await broadcast_stolen_event(log)

        # 🚨 Auto-remediate for stolen attempts
        block_ip(ip)

        return {
            "status": "fail",
            "reason": "Incorrect password",
            "alert": "Possible stolen credentials"
        }

    # 💾 Save fingerprint and check for device abuse
    save_fingerprint(data.email, fingerprint)
    linked_accounts = detect_abuse(fingerprint)
    breach_flag = check_email_breach(data.email)

    if len(linked_accounts) >= 3:
        # 🚨 Auto-ban fingerprint
        block_fingerprint(fingerprint)

        return {
            "status": "fail",
            "reason": "Too many accounts on same device",
            "alert": "Suspicious Device Detected",
            "linked_accounts": linked_accounts,
            "breached": breach_flag
        }

    # ✅ Success
    return {
        "status": "success",
        "email": data.email,
        "linked_accounts": linked_accounts,
        "breached": breach_flag
    }

