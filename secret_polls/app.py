from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

from model import db, Poll, create_poll, get_poll_by_id, add_participant_to_poll
from config import Config
from helpers import generate_script_file


app = Flask(__name__)

# Configure the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///polls.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database with the Flask app
db.init_app(app)
CORS(app)


# Define a basic route
@app.route('/')
def home():
    return jsonify({'message': 'Welcome to Secret Polls Backend Server!'})

@app.route('/polls', methods=['POST'])
def create_poll_route():
    data = request.json

    # Validate required fields
    required_fields = ['question', 'options', 'visibility', 'poll_owner_id']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    # Extract options array into individual options
    if len(data['options']) < 4:
        return jsonify({"error": "At least 4 options are required"}), 400

    # Create the poll using the create_poll function from model.py
    poll = create_poll(
        question=data['question'],
        option_1=data['options'][0],
        option_2=data['options'][1],
        option_3=data['options'][2],
        option_4=data['options'][3],
        visibility=data['visibility'],
        poll_owner_id=data['poll_owner_id'],
        max_participants_count=data.get('max_participants', 5)  # Default: 5 participants if not provided
    )

    print(poll)

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
        "participants_party_ids": poll.participants_party_ids,
        "owner_id": poll.poll_owner_id
    })

@app.route('/polls/<int:poll_id>/add_participant', methods=['POST'])
def edit_poll_add_participant(poll_id):
    data = request.json  # Expecting JSON payload

    # Validate required fields
    required_fields = ['party_id', 'store_id', 'party_name']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400
    

    poll = Poll.query.get(poll_id)
    
    if not poll:
        return jsonify({"error": "Poll not found"}), 404

    # Check if the poll is active
    if poll.status != 'active':
        return jsonify({"error": "Participants can only be added when the poll is active."}), 400

    try:
        # Add the participant using the add_participant_to_poll function
        poll = add_participant_to_poll(poll_id, data['party_id'], data['store_id'], data['party_name'])
        return jsonify({
            "message": "Participant added successfully",
            "poll_id": poll.id,
            "current_participants": poll.current_participants
        }), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/polls/<int:poll_id>/status', methods=['PUT'])
def update_poll_status(poll_id):
    data = request.json

    # Ensure the status field is provided
    if 'status' not in data:
        return jsonify({"error": "Missing 'status' field"}), 400

    # Retrieve the poll by ID
    poll = Poll.query.get(poll_id)
    
    if not poll:
        return jsonify({"error": "Poll not found"}), 404

    # Update the poll status
    new_status = data['status']
    poll.status = new_status

    # Commit the changes to the database
    db.session.commit()

    return jsonify({"message": "Poll status updated successfully", "new_status": poll.status}), 200

@app.route('/polls/<int:poll_id>/script', methods=['GET'])
def fetch_poll_script(poll_id):
    # Fetch the poll by ID
    poll = Poll.query.get(poll_id)
    
    if not poll:
        return jsonify({"error": "Poll not found"}), 404
    
    # Number of participants can be derived from the poll's current participants
    num_participants = poll.current_participants
    poll_num = poll.id  # We use the poll_id as the poll number for script generation
    
    try:
        # Generate the script file (filename is optional, let it be auto-generated)
        script = generate_script_file(num_participants=num_participants, poll_num=poll_num, override_parties=True)
        
        # Send the generated file as a response
        # return send_file(script_file_path, as_attachment=True, download_name=f'poll_{poll_num}_script.py')

        return jsonify({"message": "Poll script generated", "script":script}), 200
    
    except Exception as e:
        return jsonify({"error": f"Failed to generate script: {str(e)}"}), 500



# Run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
    app.run(debug=True)
