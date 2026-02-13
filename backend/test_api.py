import urllib.request
import json

url = "http://localhost:5000/api/generate"
payload = {
    "topic": "AI Agents",
    "platform": "twitter",
    "tone": "inspirational",
    "target": "developers"
}

print(f"Testing API at {url}...")
try:
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Status Code: {response.getcode()}")
        print("Response Body:")
        print(json.dumps(result, indent=4))
except Exception as e:
    print(f"Error: {e}")
