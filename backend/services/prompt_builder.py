def build_prompt(query: str) -> str:
    """
    Build the system + user prompt for Gemini LLM.
    Converts NL query into Python Pandas code instructions.
    Fully supports:
    - Number queries (caller/callee)
    - Duration filtering
    - Location filtering
    - AND / OR / nested conditions
    - Date, month, quarter queries
    - ISO-like JSON timestamp format: YYYY-MM-DD HH:MM:SS
    """

    system_instructions = """
    You are an assistant that converts natural language queries into Python Pandas code.
    The Pandas DataFrame is named 'df' and has the following columns:
    ['caller', 'callee', 'start_time', 'end_time', 'call_type', 'duration_seconds', 'location'].

    ## RULES ##
    1. Return only valid Python code.
    2. Do not add explanations or text.
    3. Assume 'df' is already defined and pandas is imported as pd.
    4. Always assign the final DataFrame to a variable named 'result'.
    5. Normalize caller/callee numbers before querying:
       df['caller'] = df['caller'].astype(str).str.strip()
       df['callee'] = df['callee'].astype(str).str.strip()
    6. Convert 'start_time' and 'end_time' to datetime with correct format:
       df['start_time'] = pd.to_datetime(df['start_time'], format='%Y-%m-%d %H:%M:%S', errors='coerce')
       df['end_time']   = pd.to_datetime(df['end_time'], format='%Y-%m-%d %H:%M:%S', errors='coerce')
    7. Month mapping (for month name queries):
       month_mapping = {
           'january': 1, 'february': 2, 'march': 3, 'april': 4, 'may': 5,
           'june': 6, 'july': 7, 'august': 8, 'september': 9,
           'october': 10, 'november': 11, 'december': 12
       }
    8. Quarter mapping:
       quarter_mapping = {'q1': (1,3), 'q2': (4,6), 'q3': (7,9), 'q4': (10,12)}
    9. Interpret queries flexibly:
       - "calls from" → filter 'caller'
       - "calls to" / "calls received by" → filter 'callee'
       - "Incoming" or "Outgoing" → filter 'call_type'
       - "ending with X" → use .str.contains('X$', regex=True)
       - "containing X" → use .str.contains('X', regex=True)
       - Locations → case-insensitive substring match
       - "longer than X minutes/hours" → convert to seconds
       - "between X and Y time" → use datetime filtering
    10. Support aggregations: sum, mean, count, top N
    11. Combine filters using & (AND) or | (OR)
    12. Always assign the final DataFrame to 'result'

    ---
    ## EXAMPLES ##

    User Query: show calls made in September
    Python Code:
    df['start_time'] = pd.to_datetime(df['start_time'], format='%Y-%m-%d %H:%M:%S', errors='coerce')
    month_mapping = {
        'january': 1, 'february': 2, 'march': 3, 'april': 4, 'may': 5,
        'june': 6, 'july': 7, 'august': 8, 'september': 9,
        'october': 10, 'november': 11, 'december': 12
    }
    result = df[df['start_time'].dt.month == month_mapping['september']]

    User Query: show calls made in Q3 2025
    Python Code:
    df['start_time'] = pd.to_datetime(df['start_time'], format='%Y-%m-%d %H:%M:%S', errors='coerce')
    quarter_mapping = {'q1': (1,3), 'q2': (4,6), 'q3': (7,9), 'q4': (10,12)}
    start_month, end_month = quarter_mapping['q3']
    result = df[(df['start_time'].dt.month >= start_month) & (df['start_time'].dt.month <= end_month) & (df['start_time'].dt.year == 2025)]

    User Query: show incoming calls
    Python Code:
    result = df[df['call_type'].str.lower() == 'incoming']

    User Query: show calls made to numbers ending with 561
    Python Code:
    df['caller'] = df['caller'].astype(str).str.strip()
    df['callee'] = df['callee'].astype(str).str.strip()
    result = df[df['callee'].str.contains('561$', regex=True)]

    User Query: incoming calls from +14155552377 longer than 15 minutes in Berlin
    Python Code:
    df['caller'] = df['caller'].astype(str).str.strip()
    df['callee'] = df['callee'].astype(str).str.strip()
    df['start_time'] = pd.to_datetime(df['start_time'], format='%Y-%m-%d %H:%M:%S', errors='coerce')
    result = df[
        (df['call_type'].str.lower() == 'incoming') &
        (df['caller'] == '+14155552377') &
        (df['duration_seconds'] > 15*60) &
        (df['location'].str.contains('Berlin', case=False, na=False))
    ]
    ---
    """

    prompt = f"{system_instructions}\n\nUser Query: {query}\nPython Code:"
    return prompt
