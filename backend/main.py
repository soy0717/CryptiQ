# backend/main.py
from dotenv import load_dotenv
load_dotenv()

import zipfile
import os
import pandas as pd
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# UPDATED IMPORT: Pointing to the new 'services' folder
from services.model_handler import handle_query

# --- New Helper Function to Load and Standardize Data ---
def load_and_standardize_dataframe(file_path):
    """
    Loads a dataframe from a CSV or JSON file and standardizes column names.
    """
    # Check if the file exists and is not empty
    if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
        return pd.DataFrame() # Return an empty DataFrame

    # Load the dataframe based on file extension
    try:
        if file_path.lower().endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_path.lower().endswith('.json'):
            # 'orient="records"' is used for JSON arrays of objects
            df = pd.read_json(file_path, orient='records')
        else:
            # Unsupported format
            return pd.DataFrame()
    except Exception as e:
        print(f"Error loading file {file_path}: {e}")
        return pd.DataFrame()


    # Define a mapping from possible input names to standard names
    column_renames = {
        'from': 'caller_number',
        'to': 'receiver_number',
        'caller': 'caller_number',
        'receiver': 'receiver_number',
        'duration': 'duration_seconds'
    }

    # Rename the columns in the dataframe
    df.rename(columns=column_renames, inplace=True)
    return df
# --- End of Helper Function ---


# Global variables and directory setup
df = None
CALL_LOG_FILENAME = "call_logs" # Use a base name without extension
UPLOAD_DIR = "uploads"
EXTRACT_DIR = "extract"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

if not os.path.exists(EXTRACT_DIR):
    os.makedirs(EXTRACT_DIR)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global df
    # Check for both .csv and .json versions of the call log
    call_log_path_csv = os.path.join(EXTRACT_DIR, f"{CALL_LOG_FILENAME}.csv")
    call_log_path_json = os.path.join(EXTRACT_DIR, f"{CALL_LOG_FILENAME}.json")

    if os.path.exists(call_log_path_csv):
        df = load_and_standardize_dataframe(call_log_path_csv)
    elif os.path.exists(call_log_path_json):
        df = load_and_standardize_dataframe(call_log_path_json)
    else:
        df = pd.DataFrame()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the SIH Backend API!"}

@app.post("/upload_ufdr")
async def upload_ufdr(file: UploadFile = File(...)):
    # Save ufdr file
    ufdr_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(ufdr_path, "wb") as f:
        f.write(await file.read())

    # Extract UFDR (assumed ZIP format)
    with zipfile.ZipFile(ufdr_path, "r") as zip_ref:
        zip_ref.extractall(EXTRACT_DIR)
        extracted_files = zip_ref.namelist()

    # Find call log file (CSV or JSON) and rename it
    call_log_path = None
    for filename in extracted_files:
        is_call_log = "call_logs" in filename.lower()
        is_csv = filename.lower().endswith('.csv')
        is_json = filename.lower().endswith('.json')
        
        if is_call_log and (is_csv or is_json):
            extension = '.csv' if is_csv else '.json'
            full_path = os.path.join(EXTRACT_DIR, filename)
            target_path = os.path.join(EXTRACT_DIR, f"{CALL_LOG_FILENAME}{extension}")
            os.rename(full_path, target_path)
            call_log_path = target_path
            break
            
    global df
    if call_log_path:
        df = load_and_standardize_dataframe(call_log_path)
    else:
        df = pd.DataFrame()

    return JSONResponse({
        "message": "UFDR file uploaded and extracted.",
        "extracted_files": extracted_files,
        "call_log_found": bool(call_log_path)
    })

@app.post("/select_file")
async def select_file(payload: dict = Body(...)):
    global df
    filename = payload.get("filename")
    if not filename:
        return {"success": False, "message": "No filename provided."}

    file_path = os.path.join(EXTRACT_DIR, filename)
    if not os.path.exists(file_path):
        return {"success": False, "message": "File not found."}
        
    try:
        loaded_df = load_and_standardize_dataframe(file_path)
        if loaded_df is not None:
            df = loaded_df
            return {"success": True, "message": f"'{filename}' loaded for analysis."}
        else:
            return {"success": False, "message": f"Unsupported file type for '{filename}'."}
    except Exception as e:
        return {"success": False, "message": str(e)}

@app.post("/query")
async def query_endpoint(request: dict):
    global df
    user_query = request.get("query", "")

    if df is None or df.empty:
        return {
            "query": user_query,
            "totalResults": 0,
            "callLogs": [],
            "message": "No data loaded. Please upload a file first."
        }

    # Call the model handler which talks to the LLM and executes the code
    result_df = handle_query(df.copy(), user_query) # Pass a copy to prevent modification of the global df

    # Process the result from the model handler
    if result_df is not None and isinstance(result_df, pd.DataFrame):
        results_json = result_df.to_dict(orient="records")
        message = "Query processed successfully."
    else:
        results_json = []
        message = "Sorry, I couldn't understand that query. Please try rephrasing."

    # Return the final, structured response
    return {
        "query": user_query,
        "totalResults": len(results_json),
        "callLogs": results_json,
        "message": message
    }