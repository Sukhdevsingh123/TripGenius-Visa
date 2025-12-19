
import os
import json
import PyPDF2
import io
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

class VisaAgent:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found")
        
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            api_key=api_key,
            temperature=0.0
        )

    def extract_text_from_pdf(self, pdf_bytes):
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            return f"Error reading PDF: {str(e)}"

    def assess_visa_with_docs(self, nationality, destination, purpose, additional_docs_text, pdf_content):
        
        prompt_template = """
        You are a Senior Immigration Officer. 
        
        Task: Analyze the IELTS Report and User Profile to determine Visa Eligibility.
        
        Profile:
        - Nationality: {nationality} -> Destination: {destination}
        - Purpose: {purpose}
        - Documents: {additional_docs_text}
        
        IELTS Content Detected:
        {pdf_content}

        Rules:
        1. Extract Candidate Name and Scores carefully.
        2. If Overall Band > 7.0 and no module < 6.0, Status = "Recommended".
        3. If Overall Band < 6.0, Status = "Rejected".
        4. Otherwise, Status = "Review Required".

        Output JSON:
        {{
            "candidate_name_detected": "Name",
            "ielts_scores_detected": {{ "Listening": "0.0", "Reading": "0.0", "Writing": "0.0", "Speaking": "0.0", "Overall": "0.0" }},
            "eligibility_score": 85,
            "eligibility_reason": "Provide a 2-sentence professional explanation of why this visa is recommended or rejected based on the language score and nationality.",
            "admin_approval_status": "Recommended", 
            "missing_documents": ["List", "of", "missing", "docs"]
        }}
        """

        prompt = PromptTemplate(
            input_variables=["nationality", "destination", "purpose", "additional_docs_text", "pdf_content"],
            template=prompt_template
        )

        formatted_prompt = prompt.format(
            nationality=nationality,
            destination=destination,
            purpose=purpose,
            additional_docs_text=additional_docs_text,
            pdf_content=pdf_content
        )

        try:
            response = self.llm.invoke(formatted_prompt)
            content = response.content.strip()
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "")
            return json.loads(content)
        except Exception as e:
            return {
                "error": str(e),
                "admin_approval_status": "Error",
                "eligibility_score": 0
            }
