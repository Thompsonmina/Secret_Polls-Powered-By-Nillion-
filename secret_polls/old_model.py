from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.types import TypeDecorator
import datetime
import json

# Create the engine and connect to the SQLite database
# The file 'polls.db' will be created in the same directory, if it doesn't exist
DATABASE_URL = "sqlite:///polls.db"
engine = create_engine(DATABASE_URL, echo=True)

Base = declarative_base()

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
class Poll(Base):
    __tablename__ = 'polls'

    id = Column(Integer, primary_key=True, autoincrement=True)
    question = Column(String(1000), nullable=False)
    option_1 = Column(String(500), nullable=False)
    option_2 = Column(String(500), nullable=False)
    option_3 = Column(String(500), nullable=False)
    option_4 = Column(String(500), nullable=False)
    visibility = Column(String, nullable=False) # private, public, private_link, public_link
    poll_owner_id = Column(String, nullable=False)

    status = Column(String, default="active")  # active, locked, done
    expiration = Column(DateTime, default=datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=3))  # Default: 3 days from now
    max_participants = Column(Integer, default=5)  # Default: 5 participants
    participants_party_ids = Column(JsonEncodedList)
    current_participants  = Column(Integer, default=0)

    def __repr__(self):
        return f"<Poll(id={self.id}, question={self.question}, visibility={self.visibility}, current_participants={self.current_participants}, party_ids={self.participants_party_ids})>"

# Create the SQLite tables based on the above models
Base.metadata.create_all(engine)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Session management
def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_poll(
    question, option_1, option_2, option_3, option_4, visibility, poll_owner_id, max_participants_count):
    db_session = next(get_db_session())
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
    db_session.add(new_poll)
    db_session.commit()
    db_session.refresh(new_poll)  # To get the updated object with the auto-generated ID
    print(f"Poll Created: {new_poll}")
    return new_poll


def get_poll_by_id(poll_id):
    db_session = next(get_db_session())
    poll = db_session.query(Poll).filter(Poll.id == poll_id).first()
    if poll:
        print(f"Poll {poll.id}: {poll.question}")
        print(f"Participants: {poll.participants_party_ids}")  # List of participant IDs
    return poll


def add_participant_to_poll(session, poll_id, party_id):
    """
    Adds a new participant's party ID to the poll's list of participants.
    Updates the count of current participants, ensuring it doesn't exceed the max limit.
    """
    poll = session.query(Poll).filter(Poll.id == poll_id).first()

    if poll is None:
        raise ValueError(f"No poll found with ID {poll_id}")

    # Check if the poll has reached the maximum number of participants
    if poll.current_participants >= poll.max_participants:
        raise ValueError(f"Poll {poll_id} has reached the maximum number of participants.")



    new_participant_ids = poll.participants_party_ids + [party_id]  # Create a new list with the added party ID
    poll.participants_party_ids = new_participant_ids
    print(poll.participants_party_ids)

    # Update the participant count
    poll.current_participants += 1

    # Commit the changes
    session.commit()

    print(f"Party ID {party_id} added to poll {poll_id}. Current participants: {poll.current_participants}")
    print(poll)
    return poll
