

from flask import Flask, request, jsonify
from model import create_poll, get_poll_by_id, add_participant_to_poll, get_db_session, Poll
from config import Config

from sqlalchemy.orm import Session


# Initialize the Flask app
app = Flask(__name__)

# Load configuration
app.config.from_object(Config)

# Define a basic route
@app.route('/')
def home():
    return jsonify({'message': 'Welcome to Secret Polls Backend Server!'})

# Example route for handling POST requests
@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.get_json()
    return jsonify({
        'received_data': data,
        'message': 'Data received successfully!'
    }), 201

@app.route("/api/poll", methods=["POST"])
def create_poll():
    data = request.get_json()

# Run the app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
