from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Mock generation logic
PLATFORM_TEMPLATES = {
    "twitter": [
        "🚀 Just discovered {topic}! It's a game changer for {target}. #innovation #tech",
        "Thread 🧵: Why {topic} is the most underrated tool in 2024. Let's dive in! 👇",
        "Short & sweet: {topic} is everything you need for {target}."
    ],
    "linkedin": [
        "I’m thrilled to share my latest insights on {topic}. In today's landscape, {target} remains a top priority. Here's why...",
        "Grateful for the opportunity to explore {topic}. It's clear that {target} is evolving rapidly. What are your thoughts?",
        "Reflecting on {topic}: The intersection of strategy and execution. #leadership #growth"
    ],
    "instagram": [
        "Vibing with {topic} today. ✨ {target} never looked so good. #lifestyle #goals",
        "Behind the scenes of {topic}. 📸 Capturing the essence of {target}.",
        "Current mood: {topic}. 🌈 Loving the energy of {target}!"
    ],
    "facebook": [
        "Check out what I found about {topic}! It's perfect for anyone interested in {target}. Hope you find this helpful!",
        "Exciting news about {topic}. {target} is definitely taking a step forward with this one.",
        "Had a great time learning more about {topic}. It's a must-watch for {target} enthusiasts."
    ]
}

@app.route('/api/generate', methods=['POST'])
def generate_content():
    data = request.json
    topic = data.get('topic', 'General Interest')
    platform = data.get('platform', 'twitter').lower()
    tone = data.get('tone', 'professional')
    target = data.get('target', 'professionals')

    if platform not in PLATFORM_TEMPLATES:
        return jsonify({"error": "Platform not supported"}), 400

    templates = PLATFORM_TEMPLATES[platform]
    content = random.choice(templates).format(topic=topic, target=target)
    
    # Simple tone adjustment simulation
    if tone == "humorous":
        content = "😂 " + content + " (No joke!)"
    elif tone == "inspirational":
        content = "✨ " + content + " #Believe"

    return jsonify({
        "platform": platform,
        "content": content,
        "topic": topic
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
