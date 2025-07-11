import requests

BASE_URL = "http://localhost:8000/attack-simulator/simulate"

attacks = [
    "honeypot",
    "click_flooding",
    "fake_checkout",
    "header_spoofing"
]

def simulate_attack(endpoint):
    url = f"{BASE_URL}/{endpoint}"
    try:
        response = requests.post(url)
        if response.status_code == 200:
            print(f"✅ {endpoint.replace('_', ' ').title()} simulation succeeded.")
        else:
            print(f"❌ {endpoint} failed with status code {response.status_code}")
    except Exception as e:
        print(f"🚨 Error during {endpoint} simulation: {e}")

if __name__ == "__main__":
    for attack in attacks:
        simulate_attack(attack)
