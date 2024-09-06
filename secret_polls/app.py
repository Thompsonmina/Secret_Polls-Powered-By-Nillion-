from flask import Flask, request, jsonify
from model import db, Poll, create_poll, get_poll_by_id, add_participant_to_poll
from config import Config


app = Flask(__name__)

# Configure the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///polls.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database with the Flask app
db.init_app(app)


# Define a basic route
@app.route('/')
def home():
    return jsonify({'message': 'Welcome to Secret Polls Backend Server!'})

@app.route('/polls', methods=['POST'])
def create_poll_route():
    data = request.json

    # Validate required fields
    required_fields = ['question', 'option_1', 'option_2', 'option_3', 'option_4', 'visibility', 'poll_owner_id']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    # Create the poll using the create_poll function from model.py
    poll = create_poll(
        question=data['question'],
        option_1=data['option_1'],
        option_2=data['option_2'],
        option_3=data['option_3'],
        option_4=data['option_4'],
        visibility=data['visibility'],
        poll_owner_id=data['poll_owner_id'],
        max_participants_count=data.get('max_participants', 5)  # Default: 5 participants if not provided
    )

    return jsonify({
        "message": "Poll created successfully",
        "poll_id": poll.id,
    }), 201

@app.route('/polls/<int:poll_id>', methods=['GET'])
def get_poll(poll_id):
    # Query the poll by ID
    poll = Poll.query.get(poll_id)
    
    if not poll:
        return jsonify({"error": "Poll not found"}), 404

    # Return the poll details as JSON
    return jsonify({
        "id": poll.id,
        "question": poll.question,
        "options": {
            "option_1": poll.option_1,
            "option_2": poll.option_2,
            "option_3": poll.option_3,
            "option_4": poll.option_4,
        },
        "visibility": poll.visibility,
        "status": poll.status,
        "expiration": poll.expiration.isoformat() if poll.expiration else None,
        "max_participants": poll.max_participants,
        "current_participants": poll.current_participants,
        "participants_party_ids": poll.participants_party_ids
    })


# Run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
    app.run(debug=True)
