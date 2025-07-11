import requests
from datetime import datetime

# ---------- CONFIG ----------
LOGIN_URL = "http://localhost:8000/auth/login"
EMAIL = "victim@example.com"
WRONG_PASSWORD = "wrong-password"
FINGERPRINT = "device-test-1"
IP_ADDRESS = "127.0.0.1"  # Usually local during dev
# ---------------------------

def simulate_bot_login():
    payload = {
        "email": EMAIL,
        "password": WRONG_PASSWORD,
        "fingerprint": FINGERPRINT
    }

    print(f"[{datetime.now().isoformat()}] 🔐 Simulating stolen login attempt...")
    print(f"Email: {EMAIL} | Password: {WRONG_PASSWORD} | Fingerprint: {FINGERPRINT}\n")

    try:
        res = requests.post(LOGIN_URL, json=payload, timeout=5)
        if res.status_code == 200:
            result = res.json()
            print("✅ Server Response:")
            for k, v in result.items():
                print(f" - {k}: {v}")
        else:
            print(f"❌ HTTP {res.status_code}: {res.text}")

    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    simulate_bot_login()
