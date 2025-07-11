# 🛡️ GrinchGuard™ — The Future of Web Security

> **Stop bots. Stop breaches. In real-time.** > A production-ready AI-powered firewall to defend e-commerce from Grinch bots, stolen credentials, and automated fraud.

---

## 🚨 Problem Statement

In the modern web, malicious bots outnumber humans **4 to 1**.

- 🔓 **Credential stuffing** and **account takeovers** cost billions annually.
- 🛍️ **Grinch bots** buy out inventory before real users can.
- ⚠️ Security teams are often reactive — responding *after* damage is done.

We asked:  
**What if a system could detect, block, and remediate threats on its own… in real-time?**

---

## 💡 Our Solution — GrinchGuard™

An intelligent, autonomous, **real-time cybersecurity engine** built for defense, not detection.  
It’s **not a dashboard. It’s not a simulation.** It’s **a product.**

### ⚔️ Key Capabilities

| Feature                               | Description                                                                 |
|---------------------------------------|-----------------------------------------------------------------------------|
| 🧠 **Bot vs Human AI** | Live ML ensemble using 13+ behavior features for real-time classification   |
| 🪤 **Honeypot Traps** | Bait links to catch bots that humans won't click                            |
| 🔐 **Merkle Tree Logging** | Cryptographically chained logs for forensic trust                           |
| 🎯 **Fingerprint-Based Correlation** | Detect and block multi-account abuse from same device                       |
| 📈 **Live Dashboards & Analytics** | Real-time charts, alerts, heatmaps, and exportable CSV logs                 |
| 📡 **WebSocket Alerts to Slack/Email** | Instant alerting system to notify the infosec team                          |
| 🔄 **Auto-Remediation** | Dynamic IP banning, session blacklisting, and fake-checkout blocking        |
| 🕵️ **Credential Breach Check** | Detect and stop login attempts with breached email credentials              |

---

## 🧬 Architecture

```txt
Frontend (Next.js + Recharts + WebSocket)
       ⬇
Backend (FastAPI + ML Model + Router-Based Microservices)
       ⬇
• Bot Detection Engine (XGBoost + RF Ensemble)
• Honeypot Handler
• Merkel Tree Logging Core
• Slack & Email Alert Pipelines
• Auto-Remediation Module
• Fingerprint Tracker
````

📊 **Real-time Dashboard**

  - 📈 Bot vs Human traffic (AI-driven)
  - 🔐 Credential alerts (breach attempts, repeated devices)
  - 📡 Live Slack alerts
  - 📍 Heatmaps, IP logs, and forensic trails
    *Demo screenshots or live link here*

🤖 **AI Classifier (Bot vs Human)**
We trained a powerful ensemble model (XGBoost + Random Forest) on synthetic + real-world behavioral data:

| Feature Name             | Description                                       |
|--------------------------|---------------------------------------------------|
| `click_rate`             | Clicks per second                                 |
| `session_duration`       | How long the user stayed                          |
| `ua_entropy`             | Entropy of User Agent                             |
| `repeated_paths_ratio`   | % of requests to same path                        |
| `cookies_enabled`        | Browser cookie support                            |
| `num_unique_pages`       | Unique pages visited in session                   |
| `suspicious_ua`          | If the user-agent string is suspicious            |
| ...and many more...      |                                                   |

🧪 **Simulation & Testing**
⚠️ Simulators are used for testing only — the product works on live production logs.

| Simulation Route              | Description                                       |
|-------------------------------|---------------------------------------------------|
| `/simulate/honeypot`          | Fake product click by bot                         |
| `/simulate/header_spoofing`   | Attempts fake proxy headers                       |
| `/simulate/click_flooding`    | Bot clicking fast + repeatedly                    |
| `/simulate/fake_checkout`     | Abandoned cart + fake payment session             |

📬 **Alerts Pipeline**
Live alerts go to:

  - ✅ Slack (via webhook)
  - ✅ Email (via EmailJS or SMTP)
  - ✅ UI Dashboard (via WebSocket)

🔐 **Merkle Logging Chain**
Every suspicious activity log is:

  - 🔗 Cryptographically hashed
  - ⛓️ Linked to the previous log in a Merkle tree
  - 🧾 Exportable as CSV with root hash for verification

`[Event1Hash] -> [Event2Hash] -> [Event3Hash] ... RootHash`

🛡️ **Auto-Remediation**

  - 🛑 IP or fingerprint auto-banned upon detection
  - 📡 Slack/Email notification instantly sent
  - 🧾 Logs are marked and frozen
  - 🔓 Admin override possible via dashboard

⚙️ **Tech Stack**

| Layer              | Tools                                                     |
|--------------------|-----------------------------------------------------------|
| 🌐 Frontend        | Next.js, ShadCN UI, Recharts, Framer Motion               |
| 🧠 ML Model        | XGBoost, Random Forest, Scikit-learn, Joblib              |
| 🔒 Backend         | FastAPI, WebSockets, Pydantic                             |
| 📡 Alerts          | EmailJS, Slack API                                        |
| 📦 Logging         | Merkle Hashing, CSV Export                                |
| 🧪 Simulations     | Custom FastAPI endpoints                                  |

🚀 **Getting Started**

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

🏁 **Hackathon Highlights**

  - ✅ Works in real-time, not post-analysis
  - ✅ Security-first design — no “demo toy” code
  - ✅ Includes AI, Merkle trees, honeypots, breach detection
  - ✅ Fully integrated UI, Slack alerts, logs, ML engine
  - ✅ Designed for production-grade deployment

🏆 **Why GrinchGuard™ Stands Out**
Most hackathon submissions show dashboards.

We built a real, intelligent, autonomous cybersecurity system.
From honeypot traps to live ML defenses, from hash-chain logs to auto-remediation, we didn’t just monitor the threat —
We fight back.

👨‍💻 **Team AstroBugs**

  - Pavithe — ML, Core integration logic, Security
  - Nikhil- Frontend and UI  
  - Ayush- Core Security Logic
  - Dhruv- Testing 

-----

📎 **Demo Video**
🎬 Watch the Full Walkthrough →

“This isn’t a simulation.

This is GrinchGuard™ — and this is the future of web security.”

```
```
