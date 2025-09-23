# backend integration with database to be done here
import pandas as pd
from model_handler import handle_query

# Sample data
data = {
    "timestamp": ["2025-09-21 10:00", "2025-09-21 11:00"],
    "caller_number": ["+911234567890", "+918765432109"],
    "receiver_number": ["+441234567890", "+911111111111"],
    "duration_seconds": [600, 120],
    "call_type": ["outgoing", "incoming"]
}
df = pd.DataFrame(data)

# Example query
query = "show me calls longer than 5 minutes"
result = handle_query(df, query)
print(result)