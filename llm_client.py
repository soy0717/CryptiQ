import google.generativeai as genai
import os
from dotenv import load_dotenv # Import the dotenv library

# Load environment variables from a .env file
load_dotenv()

# Configure Gemini API key
def configure_gemini():
    # Get the API key from an environment variable
    api_key = os.getenv("GEMINI_API_KEY") 
    
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found. Please set it in your .env file.")
    
    genai.configure(api_key=api_key)

# Call Gemini to get Pandas code
def query_llm(prompt: str) -> str:
    configure_gemini()
    try:
        model = genai.GenerativeModel("gemini-1.5-flash") # Using a more current model name
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error querying Gemini: {e}")
        return ""
