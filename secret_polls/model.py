from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.types import TypeDecorator, Text
import datetime
import json

# Use the global db instance from Flask-SQLAlchemy
db = SQLAlchemy()

class JsonEncodedList(TypeDecorator):
    impl = Text

    def process_bind_param(self, value, dialect):
        if value is None:
            return '[]'  # Default to an empty list if None
        return json.dumps(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return []
        return json.loads(value)

# Define the Poll model (table)
class Poll(db.Model):
    __tablename__ = 'polls'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    question = db.Column(db.String(1000), nullable=False)
    option_1 = db.Column(db.String(500), nullable=False)
    option_2 = db.Column(db.String(500), nullable=False)
    option_3 = db.Column(db.String(500), nullable=False)
    option_4 = db.Column(db.String(500), nullable=False)
    visibility = db.Column(db.String, nullable=False)  # private, public, etc.
    poll_owner_id = db.Column(db.String, nullable=False)

    status = db.Column(db.String, default="active")  # active, locked, done
    expiration = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=3))  # Default: 3 days from now
    max_participants = db.Column(db.Integer, default=5)  # Default: 5 participants
    participants_party_ids = db.Column(JsonEncodedList)  # To store participant Party IDs
    participants_store_ids = db.Column(JsonEncodedList)  # To store participant Store IDs
    participants_party_names = db.Column(JsonEncodedList)  # To store participant Party Names
    current_participants = db.Column(db.Integer, default=0)

    # New fields to store the results of each option
    option_1_votes = db.Column(db.Integer, default=0)
    option_2_votes = db.Column(db.Integer, default=0)
    option_3_votes = db.Column(db.Integer, default=0)
    option_4_votes = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"<Poll(id={self.id}, question={self.question}, owner_user_id={self.poll_owner_id}, visibility={self.visibility}, current_participants={self.current_participants}, party_ids={self.participants_party_ids}, store_ids={self.participants_store_ids}, party_names={self.participants_party_names})>"



    def __repr__(self):
        return f"<Poll(id={self.id}, question={self.question}, owner_user_id={self.poll_owner_id}, visibility={self.visibility}, current_participants={self.current_participants}, party_ids={self.participants_party_ids})>"


# Poll creation function
def create_poll(
    question, option_1, option_2, option_3, option_4, visibility, poll_owner_id, max_participants_count):
    new_poll = Poll(
        question=question,
        option_1=option_1,
        option_2=option_2,
        option_3=option_3,
        option_4=option_4,
        visibility=visibility,
        poll_owner_id= poll_owner_id,
        max_participants=max_participants_count,
    )
    db.session.add(new_poll)
    db.session.commit()
    db.session.refresh(new_poll)  # To get the updated object with the auto-generated ID
    print(f"Poll Created: {new_poll}")
    return new_poll


# Retrieve a poll by ID
def get_poll_by_id(poll_id):
    poll = Poll.query.filter_by(id=poll_id).first()
    if poll:
        print(f"Poll {poll.id}: {poll.question}")
        print(f"Participants: {poll.participants_party_ids}")  # List of participant IDs
    return poll



def add_participant_to_poll(poll_id, party_id, store_id, party_name):
    poll = Poll.query.filter_by(id=poll_id).first()

    if poll is None:
        raise ValueError(f"No poll found with ID {poll_id}")

    # Check if the poll has reached the maximum number of participants
    if poll.current_participants >= poll.max_participants:
        raise ValueError(f"Poll {poll_id} has reached the maximum number of participants.")

    # Append the new participant information to the lists
    updated_party_ids = poll.participants_party_ids + [party_id]
    updated_store_ids = poll.participants_store_ids + [store_id]
    updated_party_names = poll.participants_party_names + [party_name]

    # Reassign the lists to the poll object
    poll.participants_party_ids = updated_party_ids
    poll.participants_store_ids = updated_store_ids
    poll.participants_party_names = updated_party_names

    # Update the participant count
    poll.current_participants += 1

    # Commit the changes
    db.session.commit()

    print(f"Party ID {party_id}, Store ID {store_id}, and Party Name {party_name} added to poll {poll_id}. Current participants: {poll.current_participants} ")
    return poll