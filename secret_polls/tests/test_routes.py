import unittest
from flask import Flask, json
from app import app, db
from model import Poll

class PollRoutesTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Setup the Flask test client
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Use in-memory database for testing
        cls.client = app.test_client()
        cls.app_context = app.app_context()
        cls.app_context.push()

        # Create the database tables
        db.create_all()

    @classmethod
    def tearDownClass(cls):
        # Drop the database and remove the app context
        db.session.remove()
        db.drop_all()
        cls.app_context.pop()

    def setUp(self):
        # Empty database before each test
        db.session.query(Poll).delete()
        db.session.commit()

    def tearDown(self):
        # Rollback the session after each test
        db.session.rollback()

    # Test poll creation route
    def test_create_poll(self):
        data = {
            "question": "What's your favorite programming language?",
            "option_1": "Python",
            "option_2": "JavaScript",
            "option_3": "Go",
            "option_4": "Rust",
            "visibility": "public",
            "poll_owner_id": "owner123",
            "max_participants": 10
        }
        
        response = self.client.post('/polls', json=data)
        self.assertEqual(response.status_code, 201)

        json_response = response.get_json()
        self.assertIn("poll_id", json_response)
        self.assertEqual(json_response["message"], "Poll created successfully")

        # Ensure the poll is in the database
        poll = Poll.query.get(json_response["poll_id"])
        self.assertIsNotNone(poll)
        self.assertEqual(poll.question, data["question"])
        self.assertEqual(poll.max_participants, data["max_participants"])

    # Test poll fetching route
    def test_get_poll(self):
        # First create a poll
        poll = Poll(
            question="What's your favorite color?",
            option_1="Red",
            option_2="Blue",
            option_3="Green",
            option_4="Yellow",
            visibility="public",
            poll_owner_id="owner123",
            max_participants=5
        )
        db.session.add(poll)
        db.session.commit()

        # Fetch the poll by ID
        response = self.client.get(f'/polls/{poll.id}')
        self.assertEqual(response.status_code, 200)

        json_response = response.get_json()
        self.assertEqual(json_response['question'], poll.question)
        self.assertEqual(json_response['options']['option_1'], poll.option_1)
        self.assertEqual(json_response['options']['option_2'], poll.option_2)
        self.assertEqual(json_response['options']['option_3'], poll.option_3)
        self.assertEqual(json_response['options']['option_4'], poll.option_4)

    # Test poll not found
    def test_get_poll_not_found(self):
        response = self.client.get('/polls/999')  # Non-existent poll ID
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json()["error"], "Poll not found")


if __name__ == "__main__":
    unittest.main()
