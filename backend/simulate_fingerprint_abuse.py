import requests

LOGIN_URL = "http://localhost:8000/auth/login"
FINGERPRINT = "device-abc-999"

USERS = [
    {
        "email": "victim@example.com",
        "password": "correct-password"
    },
    {
        "email": "grinchbot@example.com",
        "password": "hunter2"
    },
    {
        "email": "normal.user@example.com",
        "password": "safe1234"
    }
]

def simulate_device_abuse():
    print("🚨 Simulating Device Abuse with Fingerprint:", FINGERPRINT)
    for user in USERS:
        payload = {
            "email": user["email"],
            "password": user["password"],
            "fingerprint": FINGERPRINT
        }

        try:
            res = requests.post(LOGIN_URL, json=payload)
            if res.status_code == 200:
                data = res.json()
                print(f"✅ Login: {user['email']} → {data['status']}")
                if data.get("alert"):
                    print(f"⚠️ Alert: {data['alert']}")
                if data.get("linked_accounts"):
                    print(f"🔗 Linked Accounts: {data['linked_accounts']}")
            else:
                print(f"❌ HTTP {res.status_code} for {user['email']}")
        except Exception as e:
            print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    simulate_device_abuse()
