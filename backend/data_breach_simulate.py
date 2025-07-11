import requests
import random
import time

# ------------------------
# CONFIG
# ------------------------
LOGIN_URL = "http://localhost:8000/auth/login"

# Fake bot fingerprint
FINGERPRINT = "grinch-device-999"

# Simulated bot email pool (some valid, some invalid)
EMAIL_POOL = [
    "victim@example.com",         # in users.json
    "grinchbot@example.com",      # in users.json
    "normal.user@example.com",    # in users.json
    "fakeuser1@spam.com",
    "hacker@leakmail.net"
]

# Passwords to test
PASSWORDS = [
    "wrong-password",
    "hunter2",
    "not-the-right-pass",
    "123456",
    "correct-password",  # included for variety
]

# ------------------------
# BOT ATTACK FUNCTION
# ------------------------
def simulate_bot_login(email, password, fingerprint):
    payload = {
        "email": email,
        "password": password,
        "fingerprint": fingerprint
    }

    try:
        print(f"🛠️  Trying: {email} | pw: {password}")
        res = requests.post(LOGIN_URL, json=payload, timeout=5)

        if res.status_code == 200:
            result = res.json()
            print(f"🔍 Response: {result['status']} | {result.get('reason', '')}")

            if result.get("alert"):
                print(f"🚨 ALERT: {result['alert']}")
            if result.get("breached"):
                print(f"🛑 BREACHED ACCOUNT: {email}")
            if result.get("linked_accounts"):
                print(f"🔗 Linked accounts: {result['linked_accounts']}")
        else:
            print(f"⚠️ Error {res.status_code}: {res.text}")

    except Exception as e:
        print(f"❌ Request failed: {e}")

# ------------------------
# BOT MAIN LOOP
# ------------------------
def run_bot_simulation():
    print("🤖 Bot Attack Simulator Starting...\n")

    for _ in range(7):
        email = random.choice(EMAIL_POOL)
        password = random.choice(PASSWORDS)
        simulate_bot_login(email, password, FINGERPRINT)

        # Optional delay to simulate real activity
        time.sleep(random.uniform(1.5, 3.5))

    print("\n✅ Simulation complete. Check your dashboard UI.")

# ------------------------
# RUN
# ------------------------
if __name__ == "__main__":
    run_bot_simulation()
