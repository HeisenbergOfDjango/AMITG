import requests
import json

# Test the /analyze endpoint
url = "http://localhost:8000/analyze"
headers = {"Content-Type": "application/json"}
data = {"code": "def hello():\n    print('Hello world')"}

print("Sending request to /analyze endpoint...")
response = requests.post(url, headers=headers, json=data)

print(f"Status code: {response.status_code}")
if response.status_code == 200:
    print("Response:")
    print(json.dumps(response.json(), indent=2))
else:
    print(f"Error: {response.text}")

