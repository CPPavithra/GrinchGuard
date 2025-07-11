import json
import time
import random
import hashlib
from datetime import datetime

MERKEL_LOG_FILE = "merkel_logs.json"

def generate_fingerprint(headers, user_id="bot-sim"):
    raw = f"{headers['User-Agent']}_{headers.get('X-Forwarded-For', '127.0.0.1')}_{user_id}"
    return hashlib.sha256(raw.encode()).hexdigest()

def append_to_log(log_entry):
    try:
        with open(MERKEL_LOG_FILE, "r") as f:
            logs = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        logs = []

    logs.append(log_entry)

    with open(MERKEL_LOG_FILE, "w") as f:
        json.dump(logs, f, indent=2)

### 🔥 Simulated Attacks Below ###

def simulate_honeypot_hit():
    headers = {
        "User-Agent": "GrinchBot/1.0",
        "Referer": "http://walmart.com/deals/special-offer"
    }
    entry = {
        "timestamp": datetime.now().isoformat(),
        "fingerprint": generate_fingerprint(headers),
        "prediction": "bot",
        "request_path": "/deals/special-offer",
        "headers": headers,
        "current_hash": hashlib.sha256(b"HONEYPOT").hexdigest()
    }
    append_to_log(entry)
    print("[+] Honeypot hit simulated.")

def simulate_header_spoofing():
    headers = {
        "User-Agent": "Mozilla/5.0 (FakeBot)",  # weird UA
        "X-Forwarded-For": f"123.45.{random.randint(1, 255)}.{random.randint(1, 255)}"
    }
    entry = {
        "timestamp": datetime.now().isoformat(),
        "fingerprint": generate_fingerprint(headers),
        "prediction": "bot",
        "request_path": "/product/2",
        "headers": headers,
        "current_hash": hashlib.sha256(b"HEADER_SPOOF").hexdigest()
    }
    append_to_log(entry)
    print("[+] Header spoofing simulated.")

def simulate_click_flood():
    headers = {
        "User-Agent": "ClickBot/999.0"
    }
    for i in range(10):  # Simulate rapid clicks
        entry = {
            "timestamp": datetime.now().isoformat(),
            "fingerprint": generate_fingerprint(headers, user_id=f"clickbot{i}"),
            "prediction": "bot",
            "request_path": f"/product/{random.randint(1, 10)}",
            "headers": headers,
            "current_hash": hashlib.sha256(f"CLICK{i}".encode()).hexdigest()
        }
        append_to_log(entry)
        time.sleep(0.1)
    print("[+] Click flooding simulated.")

def simulate_fake_checkout():
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": "/checkout_fake"
    }
    entry = {
        "timestamp": datetime.now().isoformat(),
        "fingerprint": generate_fingerprint(headers),
        "prediction": "bot",
        "request_path": "/checkout_fake",
        "headers": headers,
        "current_hash": hashlib.sha256(b"FAKE_CHECKOUT").hexdigest()
    }
    append_to_log(entry)
    print("[+] Fake checkout simulated.")

### CLI Menu ###
def main():
    print("Choose an attack to simulate:")
    print("1. Honeypot Hit")
    print("2. Header Spoofing")
    print("3. Click Flooding")
    print("4. Fake Checkout")
    print("5. Exit")

    choice = input("Enter choice: ")
    if choice == "1":
        simulate_honeypot_hit()
    elif choice == "2":
        simulate_header_spoofing()
    elif choice == "3":
        simulate_click_flood()
    elif choice == "4":
        simulate_fake_checkout()
    elif choice == "5":
        return
    else:
        print("Invalid choice.")
    print()
    main()

if __name__ == "__main__":
    main()
