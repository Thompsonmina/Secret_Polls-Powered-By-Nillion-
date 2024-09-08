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
    # def test_create_poll(self):
    #     data = {
    #         "question": "What's your favorite programming language?",
    #         "option_1": "Python",
    #         "option_2": "JavaScript",
    #         "option_3": "Go",
    #         "option_4": "Rust",
    #         "visibility": "public",
    #         "poll_owner_id": "owner123",
    #         "max_participants": 10
    #     }
        
    #     response = self.client.post('/polls', json=data)
    #     self.assertEqual(response.status_code, 201)

    #     json_response = response.get_json()
    #     self.assertIn("poll_id", json_response)
    #     self.assertEqual(json_response["message"], "Poll created successfully")

    #     # Ensure the poll is in the database
    #     poll = Poll.query.get(json_response["poll_id"])
    #     self.assertIsNotNone(poll)
    #     self.assertEqual(poll.question, data["question"])
    #     self.assertEqual(poll.max_participants, data["max_participants"])

def test_create_poll(self):
    # Poll data to be sent in the request
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

    # Perform a POST request to create a poll
    response = self.client.post('/polls', json=data)

    # Assert that the response status code is 201 (Created)
    self.assertEqual(response.status_code, 201)

    # Check if the response contains a valid JSON response
    json_response = response.get_json()
    self.assertIsNotNone(json_response)

    # Assert that the response contains the 'poll_id' field
    self.assertIn("poll_id", json_response)

    # Assert that the message returned is correct
    self.assertEqual(json_response["message"], "Poll created successfully")

    # Ensure the poll is in the database by querying using the poll_id
    poll = Poll.query.get(json_response["poll_id"])

    # Assert that the poll exists
    self.assertIsNotNone(poll)

    # Assert that the poll data matches the input data
    self.assertEqual(poll.question, data["question"])
    self.assertEqual(poll.option_1, data["option_1"])
    self.assertEqual(poll.option_2, data["option_2"])
    self.assertEqual(poll.option_3, data["option_3"])
    self.assertEqual(poll.option_4, data["option_4"])
    self.assertEqual(poll.max_participants, data["max_participants"])
    self.assertEqual(poll.visibility, data["visibility"])
    self.assertEqual(poll.poll_owner_id, data["poll_owner_id"])


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


    # Test adding a participant successfully
    def test_add_participant_success(self):
        # First create a poll
        poll = Poll(
            question="What's your favorite color?",
            option_1="Red",
            option_2="Blue",
            option_3="Green",
            option_4="Yellow",
            visibility="public",
            poll_owner_id="owner123",
            max_participants=3
        )
        db.session.add(poll)
        db.session.commit()

        # Add a participant to the poll
        data = {
            "party_id": "party1",
            "store_id": "store123",
            "party_name": "John Doe"
        }
        response = self.client.post(f'/polls/{poll.id}/add_participant', json=data)
        self.assertEqual(response.status_code, 200)

        json_response = response.get_json()
        self.assertEqual(json_response['message'], "Participant added successfully")
        self.assertEqual(json_response['poll_id'], poll.id)

        # Check that the participant was added
        updated_poll = Poll.query.get(poll.id)
        self.assertEqual(updated_poll.current_participants, 1)
        self.assertIn("party1", updated_poll.participants_party_ids)
        self.assertIn("store123", updated_poll.participants_store_ids)
        self.assertIn("John Doe", updated_poll.participants_party_names)

    # Test exceeding participant limit
    def test_add_participant_exceeding_limit(self):
        # First create a poll with max_participants=2
        poll = Poll(
            question="What's your favorite color?",
            option_1="Red",
            option_2="Blue",
            option_3="Green",
            option_4="Yellow",
            visibility="public",
            poll_owner_id="owner123",
            max_participants=2
        )
        db.session.add(poll)
        db.session.commit()

        # Add first participant
        data_1 = {
            "party_id": "party1",
            "store_id": "store123",
            "party_name": "John Doe"
        }
        response_1 = self.client.post(f'/polls/{poll.id}/add_participant', json=data_1)
        self.assertEqual(response_1.status_code, 200)

        # Add second participant
        data_2 = {
            "party_id": "party2",
            "store_id": "store456",
            "party_name": "Jane Doe"
        }
        response_2 = self.client.post(f'/polls/{poll.id}/add_participant', json=data_2)
        self.assertEqual(response_2.status_code, 200)

        # Try to add third participant (should fail)
        data_3 = {
            "party_id": "party3",
            "store_id": "store789",
            "party_name": "Jake Doe"
        }
        response_3 = self.client.post(f'/polls/{poll.id}/add_participant', json=data_3)
        self.assertEqual(response_3.status_code, 400)
        self.assertEqual(response_3.get_json()["error"], f"Poll {poll.id} has reached the maximum number of participants.")

    # Test adding a participant to a non-existent poll
    def test_add_participant_non_existent_poll(self):
        # Try to add a participant to a non-existent poll
        data = {
            "party_id": "party1",
            "store_id": "store123",
            "party_name": "John Doe"
        }
        response = self.client.post('/polls/999/add_participant', json=data)  # Poll ID 999 does not exist
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json()["error"], "Poll not found")


if __name__ == "__main__":
    unittest.main()
