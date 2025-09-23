# model/llm_client.py
import google.generativeai as genai
import os

# Configure Gemini API key
def configure_gemini():
    api_key = 'AIzaSyCXwmV7JEBvEc9p99t22CywJajjC7flSTk'
    if not api_key:
        raise ValueError("Set GEMINI_API_KEY environment variable")
    genai.configure(api_key=api_key)

# Call Gemini to get Pandas code
def query_llm(prompt: str) -> str:
    configure_gemini()
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error querying Gemini: {e}")
        return ""