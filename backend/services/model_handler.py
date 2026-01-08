# In model/model_handler.py
from .llm_client import query_llm
from .prompt_builder import build_prompt
import pandas as pd

# Column mapping: canonical name -> actual DataFrame column
COLUMN_MAP = {
    "duration": "duration_seconds",
    "caller": "caller",
    "receiver": "callee",
    "type": "call_type",
    "timestamp": "start_time",
    "location": "location",
    "start": "start_time",
    "end": "end_time"
}

def handle_query(df, query):
    # Build prompt using prompt_builder
    prompt = build_prompt(query)

    # Get code from Gemini
    code_str = query_llm(prompt)

    # Remove markdown if any
    code_str = code_str.strip().replace("```python", "").replace("```", "")

    # Replace canonical names in code with actual DataFrame column names
    for alias, actual in COLUMN_MAP.items():
        code_str = code_str.replace(f"df['{alias}']", f"df['{actual}']")

    # Execute safely
    local_vars = {"df": df}
    try:
        exec(code_str, {}, local_vars)
        return local_vars.get("result", None)
    except Exception as e:
        print("Handler error")
        print(f"Error executing code: {e}")
        return None
