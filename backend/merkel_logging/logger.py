import hashlib
import json
import os
from datetime import datetime
from typing import List, Dict

LOG_FILE = "merkel_logs.json"

def get_last_hash() -> str:
    logs = load_logs()
    return logs[-1]["current_hash"] if logs else "0" * 64

def create_log_entry(
    fingerprint: str,
    prediction: str,
    prev_hash: str,
    request_path: str
) -> Dict:
    log = {
        "timestamp": datetime.utcnow().isoformat(),
        "fingerprint": fingerprint,
        "prediction": prediction,
        "request_path": request_path,
        "prev_hash": prev_hash
    }
    log_str = json.dumps(log, sort_keys=True)
    log["current_hash"] = hashlib.sha256(
        (log_str + prev_hash).encode()
    ).hexdigest()
    return log

def append_to_log(entry: Dict) -> None:
    logs = load_logs()
    logs.append(entry)
    with open(LOG_FILE, "w") as f:
        json.dump(logs, f, indent=2)

def load_logs() -> List[Dict]:
    try:
        if os.path.exists(LOG_FILE):
            with open(LOG_FILE) as f:
                return json.load(f)
    except (json.JSONDecodeError, IOError):
        pass
    return []
