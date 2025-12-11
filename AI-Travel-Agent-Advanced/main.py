# main.py
from fastapi import FastAPI, HTTPException
# for visa agent
from fastapi import File, UploadFile, Form
from visa_agent import VisaAgent
# end import for visa agent
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from crew import TravelPlannerAgents, TravelRequest
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

        # Calculate duration
        from datetime import datetime
        start = datetime.strptime(request.start_date, "%Y-%m-%d")
        end = datetime.strptime(request.end_date, "%Y-%m-%d")
        duration = (end - start).days
        if duration <= 0: duration = 1

        # Initialize your Agent System
        planner = TravelPlannerAgents()

        # Create the TravelRequest object expected by your crew.py
        travel_req = TravelRequest(
            origin=request.origin,
            destinations=request.destinations,
            start_date=request.start_date,
            end_date=request.end_date,
            duration=duration,
            budget_range=request.budget_range,
            travel_style=request.travel_style,
            interests=request.interests,
            group_size=request.group_size
        )

        # Run the Crew
        result = planner.plan_trip(travel_req)

        return {"itinerary": result}

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    


@app.post("/api/assess-visa-upload")
async def assess_visa_upload(
    nationality: str = Form(...),
    destination: str = Form(...),
    purpose: str = Form(...),
    documents: str = Form(""),
    file: UploadFile = File(...)
):
    try:
        logger.info(f"Processing Visa Request for: {nationality} -> {destination}")
        
        # 1. Read the uploaded PDF file
        file_content = await file.read()
        
        # 2. Initialize Agent
        agent = VisaAgent()
        
        # 3. Extract Text from PDF
        pdf_text = agent.extract_text_from_pdf(file_content)
        
        # 4. Run Assessment
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