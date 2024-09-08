import unittest
from flask import Flask
from model import db, Poll, add_participant_to_poll

class PollTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Initialize the Flask app and Flask-SQLAlchemy
        cls.app = Flask(__name__)
        cls.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        cls.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

        # Initialize the database with the app
        db.init_app(cls.app)

        # Create the database tables
        with cls.app.app_context():
            db.create_all()

    def setUp(self):
        # Create an application context and session before each test
        self.app_context = self.app.app_context()
        self.app_context.push()

        # Create a sample poll for testing
        self.sample_poll = Poll(
            question="What's your favorite color?",
            option_1="Red",
            option_2="Blue",
            option_3="Green",
            option_4="Yellow",
            visibility="public",
            poll_owner_id="owner123",
            max_participants=3,
            participants_party_ids=[],
            participants_store_ids=[],  # Add store IDs for the test
            participants_party_names=[],  # Add party names for the test
            current_participants=0,
        )
        db.session.add(self.sample_poll)
        db.session.commit()

    def tearDown(self):
        # Rollback any session changes and remove the app context
        db.session.rollback()
        db.session.remove()
        self.app_context.pop()

        # Drop all tables to ensure test isolation (optional)
        with self.app.app_context():
            db.drop_all()
            db.create_all()

    def test_add_participant_to_poll(self):
        # Test adding a participant with store ID and party name to a poll
        updated_poll = add_participant_to_poll(self.sample_poll.id, "party1", "store123", "John Doe")

        self.assertEqual(updated_poll.current_participants, 1)
        self.assertIn("party1", updated_poll.participants_party_ids)
        self.assertIn("store123", updated_poll.participants_store_ids)
        self.assertIn("John Doe", updated_poll.participants_party_names)

    def test_add_participant_exceeding_limit(self):
        # Test adding more participants than allowed
        add_participant_to_poll(self.sample_poll.id, "party1", "store123", "John Doe")
        add_participant_to_poll(self.sample_poll.id, "party2", "store456", "Jane Doe")
        add_participant_to_poll(self.sample_poll.id, "party3", "store789", "Jake Doe")

        with self.assertRaises(ValueError):
            # This should raise an error since the max_participants is 3
            add_participant_to_poll(self.sample_poll.id, "party4", "store012", "Jill Doe")

    def test_add_participant_no_poll_found(self):
        # Test adding a participant to a non-existent poll
        with self.assertRaises(ValueError):
            add_participant_to_poll(999, "party1", "store123", "John Doe")  # Non-existent poll ID

    @classmethod
    def tearDownClass(cls):
        # Clean up the database and application context after all tests
        with cls.app.app_context():
            db.session.remove()
            db.drop_all()

if __name__ == "__main__":
    unittest.main()