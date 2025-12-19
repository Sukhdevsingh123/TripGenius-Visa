
"""
Configuration file for OpenAI Setup
"""
import os
from dotenv import load_dotenv

load_dotenv()

# We no longer disable OpenAI. 
# instead, we ensure the key is loaded.

if not os.getenv("OPENAI_API_KEY"):
    print("⚠️  WARNING: OPENAI_API_KEY not found in environment variables.")
else:
    print("✅ OpenAI API Key loaded.")

if not os.getenv("SERPER_API_KEY"):
    print("⚠️  WARNING: SERPER_API_KEY not found in environment variables.")
else:
    print("✅ Serper API Key loaded.")