def build_prompt(query: str) -> str:
    """
    Build the system + user prompt for Gemini LLM.
    Converts NL query into Pandas code instructions.
    """
    system_instructions = """
        You are an assistant that converts natural language queries into Python Pandas code.
        The Pandas DataFrame is named 'df' and has the following columns:
        ['caller', 'callee', 'start_time', 'end_time', 'call_type', 'duration_seconds', 'location'].

        Rules:
        1. Return only valid Python code.
        2. Do not add explanations or text.
        3. Assume 'df' is already defined and pandas is imported as pd.
        4. Use 'caller' for the person making the call and 'callee' for the receiver.
        5. Use 'start_time' or 'end_time' for date and time queries. Convert them to datetime objects first.
        6. Use 'duration_seconds' for call length and 'location' for the call's location.
        7. Always assign the final filtered DataFrame to a variable named 'result'.

        ---
        ## EXAMPLES ##

        User Query: find all calls from ‪+14155559686‬
        Python Code:
        result = df[df['caller'] == '‪+14155559686‬']

        User Query: show calls received by ‪+14155559140‬
        Python Code:
        result = df[df['callee'] == '‪+14155559140‬']

        User Query: show me calls on September 20, 2025
        Python Code:
        df['start_time'] = pd.to_datetime(df['start_time'])
        result = df[df['start_time'].dt.date == pd.to_datetime('2025-09-20').date()]
        
        User Query: find calls that ended after 3:00 PM on September 20, 2025
        Python Code:
        df['end_time'] = pd.to_datetime(df['end_time'])
        result = df[df['end_time'] > '2025-09-20 15:00:00']

        User Query: list all Outgoing calls
        Python Code:
        result = df[df['call_type'] == 'Outgoing']

        User Query: show calls longer than 1000 seconds
        Python Code:
        result = df[df['duration_seconds'] > 1000]

        User Query: list all calls from a CellTower
        Python Code:
        result = df[df['location'] == 'CellTower']
        ---
    """

    prompt = f"{system_instructions}\n\nUser Query: {query}\nPython Code:"
    return prompt
