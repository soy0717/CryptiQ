import sys
import os
import pandas as pd

# Add the parent directory (backend) to the system path so we can import 'services'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.model_handler import handle_query

# Sample data
data = {
    "timestamp": ["2025-09-21 10:00", "2025-09-21 11:00"],
    "caller_number": ["+911234567890", "+918765432109"],
    "receiver_number": ["+441234567890", "+911111111111"],
    "duration_seconds": [600, 120],
    "call_type": ["outgoing", "incoming"],
    "caller": ["+911234567890", "+918765432109"], # Adding standardized columns for test
    "callee": ["+441234567890", "+911111111111"],
    "start_time": ["2025-09-21 10:00", "2025-09-21 11:00"],
    "end_time": ["2025-09-21 10:10", "2025-09-21 11:02"],
    "location": ["Delhi", "Mumbai"]
}
df = pd.DataFrame(data)

# Example query
print("Testing query: 'show me calls longer than 5 minutes'")
query = "show me calls longer than 5 minutes"
result = handle_query(df, query)

if result is not None:
    print("\nResult found:")
    print(result)
else:
    print("\nNo result or error occurred.")