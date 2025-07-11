from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

# Router imports
from fraud_detection.routes import router as fraud_router
from bot_trap.routes import router as bot_trap_router
from merkel_logging.routes import router as merkel_router
from attack_simulator.routes import router as attack_simulator_router
from auth import router as auth_router  # ✅ NEW

app = FastAPI()

# Serve static files (for favicon and product images)
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include all routers
app.include_router(fraud_router, prefix="/fraud", tags=["fraud-detection"])
app.include_router(bot_trap_router, prefix="/bot-trap", tags=["bot-trap"])
app.include_router(merkel_router, prefix="/merkel-logging", tags=["merkel-logging"])
app.include_router(attack_simulator_router, prefix="/attack-simulator", tags=["attack-simulator"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])  # ✅ NEW

# Add redirects for believable bot trap URLs
from fastapi.responses import RedirectResponse

@app.get("/deals/special-offer")
@app.get("/clearance/sale-item")
async def redirect_to_bot_trap():
    return RedirectResponse(url="/bot-trap/product/1")

@app.get("/")
def read_root():
    return {
        "message": "Walmart Security Dashboard API",
        "modules": {
            "fraud-detection": "/fraud",
            "bot-trap": "/bot-trap",
            "merkel-logging": "/merkel-logging",
            "attack-simulator": "/attack-simulator",
            "auth": "/auth"  # ✅ Add this for visibility
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

