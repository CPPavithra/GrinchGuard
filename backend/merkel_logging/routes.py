from fastapi import APIRouter, WebSocket, Request
from pydantic import BaseModel
import asyncio
from .fingerprint import generate_fingerprint
from .logger import create_log_entry, append_to_log, get_last_hash, load_logs
from .clustering import get_clusters

router = APIRouter()

connected_clients = []

class RequestData(BaseModel):
    ip: str
    headers: dict
    clicks: int
    user_agent: str
    request_path: str

@router.post("/fingerprint")
async def create_fingerprint(data: RequestData):
    fp = generate_fingerprint(
        ip=data.ip,
        headers=data.headers,
        clicks=data.clicks,
        user_agent=data.user_agent
    )
    prediction = "bot" if data.clicks > 50 else "human"
    log = create_log_entry(
        fingerprint=fp,
        prediction=prediction,
        prev_hash=get_last_hash(),
        request_path=data.request_path
    )
    append_to_log(log)
    await broadcast_json(log)
    return {
        "fingerprint": fp,
        "prediction": prediction,
        "log": log,
        "cluster_id": get_clusters().get(fp, None)
    }

@router.get("/logs")
async def get_logs(limit: int = 100):
    return load_logs()[:limit]

@router.get("/clusters")
async def get_bot_clusters(min_size: int = 2):
    return get_clusters(min_size=min_size)

@router.websocket("/ws-merkel")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            await asyncio.sleep(10)
    except WebSocketDisconnect:
        connected_clients.remove(websocket)

async def broadcast_json(message: dict):
    for client in connected_clients:
        try:
            await client.send_json(message)
        except:
            connected_clients.remove(client)
