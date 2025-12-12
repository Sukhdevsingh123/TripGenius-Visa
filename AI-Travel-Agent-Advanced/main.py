# main.py
import hashlib
import json
import logging
from datetime import datetime
from threading import Lock
from time import time

from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- Import your new logic from trip.py ---
from trip import OpenAITravelPlanner, TravelRequest

# --- Import Visa Agent (Ensure visa_agent.py exists or comment this out) ---
try:
    from visa_agent import VisaAgent
except ImportError:
    VisaAgent = None
    print("Warning: visa_agent.py not found. Visa endpoints will fail.")

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache Setup
TRIP_CACHE: dict = {}
TRIP_CACHE_LOCK = Lock()
TRIP_CACHE_TTL = 60 * 60  # 1 hour

app = FastAPI()

# Allow React to talk to this server (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the data structure expected from React
class TripRequestSchema(BaseModel):
    origin: str
    destinations: list[str]
    start_date: str
    end_date: str
    budget_range: str
    travel_style: str
    interests: list[str]
    group_size: int

@app.post("/api/plan-trip")
async def plan_trip(request: TripRequestSchema):
    try:
        logger.info(f"Received request: {request}")

        # 1. Create a canonical key for caching
        req_json = json.dumps(request.dict(), sort_keys=True, default=str)
        key = hashlib.sha256(req_json.encode("utf-8")).hexdigest()

        # 2. Check Cache
        now = time()
        with TRIP_CACHE_LOCK:
            cached = TRIP_CACHE.get(key)
            if cached:
                if now - cached.get("ts", 0) < TRIP_CACHE_TTL:
                    logger.info("Returning cached itinerary")
                    return {"itinerary": cached["result"], "cached": True}
                else:
                    TRIP_CACHE.pop(key, None) # Expired

        # 3. Calculate Duration
        try:
            start = datetime.strptime(request.start_date, "%Y-%m-%d")
            end = datetime.strptime(request.end_date, "%Y-%m-%d")
            duration = (end - start).days
            if duration <= 0: duration = 1
        except ValueError:
            duration = 5 # Fallback

        # 4. Initialize Your OpenAI Planner (From trip.py)
        planner = OpenAITravelPlanner()

        # 5. Create the TravelRequest object (From trip.py)
        travel_req = TravelRequest(
            origin=request.origin,
            destinations=request.destinations,
            start_date=request.start_date,
            end_date=request.end_date,
            duration=duration,
            budget_range=request.budget_range,
            travel_style=request.travel_style,
            interests=request.interests,
            group_size=request.group_size,
            special_requirements=[] # Optional: Add to schema if needed
        )

        # 6. Run the Planner
        result = planner.plan_trip(travel_req)

        # 7. Save to Cache
        with TRIP_CACHE_LOCK:
            TRIP_CACHE[key] = {"result": result, "ts": now}

        return {"itinerary": result, "cached": False}

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Visa Endpoint (Kept from your snippet) ---
@app.post("/api/assess-visa-upload")
async def assess_visa_upload(
    nationality: str = Form(...),
    destination: str = Form(...),
    purpose: str = Form(...),
    documents: str = Form(""),
    file: UploadFile = File(...)
):
    if not VisaAgent:
        raise HTTPException(status_code=501, detail="Visa Agent not available")
        
    try:
        logger.info(f"Processing Visa Request for: {nationality} -> {destination}")
        file_content = await file.read()
        agent = VisaAgent()
        pdf_text = agent.extract_text_from_pdf(file_content)
        
        result = agent.assess_visa_with_docs(
            nationality=nationality,
            destination=destination,
            purpose=purpose,
            additional_docs_text=documents,
            pdf_content=pdf_text
        )
        return result
    except Exception as e:
        logger.error(f"Visa Upload Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)