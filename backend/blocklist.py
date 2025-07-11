#blocklist.py
import json
import os
from datetime import datetime

REMEDIATION_LOG_FILE = "data/remediation_log.json"
IP_BLOCKLIST = "data/blocked_ips.json"
FP_BLOCKLIST = "data/blocked_fingerprints.json"

def load_list(path):
    if not os.path.exists(path):
        return []
    with open(path, "r") as f:
        return json.load(f)

def save_list(path, items):
    with open(path, "w") as f:
        json.dump(items, f, indent=2)

def block_ip(ip: str):
    ips = load_list(IP_BLOCKLIST)
    if ip not in ips:
        ips.append(ip)
        save_list(IP_BLOCKLIST, ips)
        log_remediation("IP Block", ip, "Auto-blocked due to suspicious login attempts")

def block_fingerprint(fp: str):
    fps = load_list(FP_BLOCKLIST)
    if fp not in fps:
        fps.append(fp)
        save_list(FP_BLOCKLIST, fps)
        log_remediation("Fingerprint Block", fp, "Used across multiple accounts")

def is_ip_blocked(ip: str):
    return ip in load_list(IP_BLOCKLIST)

def is_fingerprint_blocked(fp: str):
    return fp in load_list(FP_BLOCKLIST)

def log_remediation(action_type: str, target: str, reason: str):
    entry = {
        "id": f"{datetime.utcnow().timestamp()}-{action_type}",
        "timestamp": datetime.utcnow().isoformat(),
        "type": action_type,
        "target": target,
        "reason": reason
    }
    if not os.path.exists(REMEDIATION_LOG_FILE):
        with open(REMEDIATION_LOG_FILE, "w") as f:
            json.dump([], f)

    with open(REMEDIATION_LOG_FILE, "r") as f:
        logs = json.load(f)

    logs.append(entry)
    with open(REMEDIATION_LOG_FILE, "w") as f:
        json.dump(logs, f, indent=2)
