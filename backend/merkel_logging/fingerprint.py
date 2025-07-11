import hashlib
from datetime import datetime
import numpy as np
import json

def calculate_ip_entropy(ip: str) -> float:
    octets = [int(x) for x in ip.split('.') if x.isdigit()]
    if not octets:
        return 0.0
    counts = np.bincount(octets)
    probabilities = counts / counts.sum()
    return -np.sum(probabilities * np.log2(probabilities + 1e-10))

def get_behavior_vector(clicks: int) -> str:
    hour = datetime.now().hour
    minute = datetime.now().minute
    return f"{clicks}_{hour}_{minute}"

def generate_fingerprint(ip: str, headers: dict, clicks: int, user_agent: str) -> str:
    # Create trait components
    traits = {
        "ip_entropy": round(calculate_ip_entropy(ip), 2),
        "headers_hash": hashlib.sha256(
            json.dumps(headers, sort_keys=True).encode()
        ).hexdigest(),
        "behavior": get_behavior_vector(clicks),
        "user_agent_hash": hashlib.sha256(user_agent.encode()).hexdigest()
    }
    
    # Create final fingerprint
    fingerprint_str = json.dumps(traits, sort_keys=True)
    return hashlib.sha256(fingerprint_str.encode()).hexdigest()
