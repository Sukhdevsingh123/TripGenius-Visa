#!/usr/bin/env python3
"""
AI Travel Planner 
A simplified travel planning system using( CrewAI/Serper)
"""

import os
import sys
import logging
from datetime import datetime
from typing import Dict, List
from dataclasses import dataclass, asdict
from pathlib import Path

# Third-party imports
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Ensure required directories exist
REPORTS_DIR = Path("reports")
REPORTS_DIR.mkdir(exist_ok=True)

@dataclass
class TravelRequest:
    """Travel request data structure"""
    origin: str
    destinations: List[str]
    start_date: str
    end_date: str
    duration: int
    budget_range: str
    travel_style: str
    interests: List[str]
    group_size: int
    special_requirements: List[str] = None
    
    def __post_init__(self):
        if self.special_requirements is None:
            self.special_requirements = []
    
    def to_dict(self) -> Dict:
        return asdict(self)

class OpenAITravelPlanner:
    """Travel planning system using pure """
    
    def __init__(self):
        self.client = self._initialize_client()
    
    def _initialize_client(self):
        try:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("Missing OPENAI_API_KEY")
            
            client = OpenAI(api_key=api_key)
            logger.info("OpenAI client initialized successfully")
            return client
            
        except Exception as e:
            logger.error(f"OpenAI initialization failed: {e}")
            raise
    
    def _construct_prompt(self, request: TravelRequest) -> str:
        """Constructs the comprehensive prompt for the AI"""
        
        return f"""
        **ROLE:**
        You are an elite Travel Planning Team composed of three internal personas:
        1. **Destination Analyst:** Evaluates weather, costs, and suitability.
        2. **Local Expert:** Provides cultural insights, hidden gems, and food recommendations.
        3. **Concierge:** Builds the logistics, itinerary, and budget.

        **TASK:**
        Plan a trip based on the details below. Since you do not have real-time internet access, use your extensive internal knowledge to provide **historical weather averages** and **estimated market rates** for costs.

        **TRIP DETAILS:**
        - **Origin:** {request.origin}
        - **Potential Destinations:** {', '.join(request.destinations)}
        - **Dates:** {request.start_date} to {request.end_date} ({request.duration} days)
        - **Budget:** {request.budget_range}
        - **Style:** {request.travel_style}
        - **Interests:** {', '.join(request.interests)}
        - **Group Size:** {request.group_size}
        - **Special Req:** {', '.join(request.special_requirements)}

        **OUTPUT INSTRUCTIONS:**
        Please output a detailed report in Markdown format. The report must logically flow through these sections:

        ### 1. Destination Selection & Analysis
        - If multiple destinations were listed, select the BEST one for these dates/interests.
        - Explain WHY this destination was chosen.
        - **Weather:** Expected weather conditions for this time of year.
        - **Pros/Cons:** Brief summary.

        ### 2. Local Expert Insights
        - **Hidden Gems:** Non-touristy spots.
        - **Culture:** Etiquette and tips.
        - **Food:** Must-try local dishes and specific restaurant names (famous ones).

        ### 3. Detailed Itinerary ({request.duration} Days)
        - Provide a Day-by-Day breakdown (Morning, Afternoon, Evening).
        - Include specific hotel recommendations (provide names fitting the {request.budget_range} budget).
        - Include transport logistics between activities.

        ### 4. Estimated Budget Breakdown ({request.budget_range})
        - Accommodation (Total)
        - Flights/Transport (Estimate based on typical rates)
        - Food & Activities
        - **TOTAL Estimated Cost**

        **TONE:** Professional, enthusiastic, and highly organized. Use formatting (bolding, lists) to make it readable.
        """

    def plan_trip(self, request: TravelRequest) -> str:
        """Execute the travel planning via OpenAI"""
        try:
            logger.info("Sending request to OpenAI...")
            
            prompt = self._construct_prompt(request)
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini", 
                messages=[
                    {"role": "system", "content": "You are a world-class Travel Agent Assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7, # Slightly creative for travel ideas
            )
            
            result = response.choices[0].message.content
            logger.info("Travel planning completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Travel planning failed: {e}")
            return f"Error during travel planning: {str(e)}"

class TravelPlannerApp:
    """Main application class"""
    
    def __init__(self):
        self.planner = OpenAITravelPlanner()
    
    def run_cli(self):
        """Run the command-line interface"""
        print("🌟" + "="*60 + "🌟")
        print("        AI TRAVEL PLANNER ")
        print("🌟" + "="*60 + "🌟")
        
        try:
            # Get user input
            request = self._get_user_input()
            
            print(f"\n🚀 Planning your trip to {', '.join(request.destinations)}...")
            print(f"⏳ Please wait while our AI constructs your itinerary...")
            
            # Plan the trip
            result = self.planner.plan_trip(request)
            
            # Display results
            self._display_results(result)
            
            # Save the plan
            self._save_plan(result, request)
            
        except KeyboardInterrupt:
            print("\n❌ Planning cancelled by user")
        except Exception as e:
            logger.error(f"Application error: {e}")
            print(f"\n❌ Error: {e}")
    
    def _get_user_input(self) -> TravelRequest:
        """Get travel planning input from user"""
        print("\n📝 Let's plan your perfect trip:")
        
        # Basic information
        origin = input("\n🏠 Where are you traveling from? ").strip()
        
        destinations_input = input("🎯 What destinations are you considering? (comma-separated): ").strip()
        destinations = [d.strip() for d in destinations_input.split(',')]
        
        start_date = input("📅 Start date (YYYY-MM-DD): ").strip()
        end_date = input("📅 End date (YYYY-MM-DD): ").strip()
        
        # Calculate duration
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            duration = (end - start).days
            if duration <= 0:
                print("⚠️  End date is before start date, defaulting to 7 days.")
                duration = 7
        except:
            duration = 7
            print("⚠️  Invalid date format, defaulting to 7 days")
        
        group_size = input("👥 Number of travelers (default 1): ").strip()
        try:
            group_size = int(group_size) if group_size else 1
        except:
            group_size = 1
        
        # Preferences
        budget_options = ["budget", "mid-range", "luxury"]
        print(f"\n💰 Budget options: {', '.join(budget_options)}")
        budget_range = input("💰 Budget range (default mid-range): ").strip().lower()
        if budget_range not in budget_options:
            budget_range = "mid-range"
        
        style_options = ["relaxed", "adventure", "cultural", "romantic", "business"]
        print(f"🎭 Travel style options: {', '.join(style_options)}")
        travel_style = input("🎭 Travel style (default relaxed): ").strip().lower()
        if travel_style not in style_options:
            travel_style = "relaxed"
        
        interests_input = input("🎨 Your interests (comma-separated): ").strip()
        interests = [i.strip() for i in interests_input.split(',') if i.strip()]
        if not interests:
            interests = ["sightseeing", "local culture"]
        
        # Optional requirements
        special_req = input("♿ Any special requirements (optional): ").strip()
        special_requirements = [special_req] if special_req else []
        
        return TravelRequest(
            origin=origin,
            destinations=destinations,
            start_date=start_date,
            end_date=end_date,
            duration=duration,
            budget_range=budget_range,
            travel_style=travel_style,
            interests=interests,
            group_size=group_size,
            special_requirements=special_requirements
        )
    
    def _display_results(self, result: str):
        """Display the travel plan results"""
        print("\n" + "🎉" + "="*60 + "🎉")
        print("       YOUR TRAVEL PLAN IS READY!")
        print("🎉" + "="*60 + "🎉")
        
        print("\n" + result)
        
        print("\n" + "✈️" + "="*60 + "✈️")
        print("Have an amazing trip! 🌍")
        print("✈️" + "="*60 + "✈️")
    
    def _save_plan(self, result: str, request: TravelRequest):
        """Save the travel plan to a file"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"travel_plan_{timestamp}.md"
            filepath = REPORTS_DIR / filename
            
            # Create markdown content
            content = f"""# Travel Plan
**Generated on:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Trip Summary
- **Origin:** {request.origin}
- **Destinations:** {', '.join(request.destinations)}
- **Travel Dates:** {request.start_date} to {request.end_date}
- **Duration:** {request.duration} days
- **Group Size:** {request.group_size}
- **Budget:** {request.budget_range}
- **Travel Style:** {request.travel_style}
- **Interests:** {', '.join(request.interests)}

---

{result}

---
*Generated by AI Travel Planner *
"""
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"\n💾 Travel plan saved to: {filepath}")
            
        except Exception as e:
            logger.error(f"Failed to save travel plan: {e}")
            print(f"⚠️  Could not save travel plan: {e}")

def main():
    """Main function"""
    try:
        # Check for required environment variables
        if not os.getenv("OPENAI_API_KEY"):
            print("❌ Error: OPENAI_API_KEY not found in environment variables")
            print("Please add your OPENAI_API_KEY API key to your .env file")
            return
        
        # Run the application
        app = TravelPlannerApp()
        app.run_cli()
        
    except Exception as e:
        logger.error(f"Application startup failed: {e}")
        print(f"❌ Startup error: {e}")

if __name__ == "__main__":
    main()