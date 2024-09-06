import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model import Base, Poll, add_participant_to_poll

class PollTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Create an in-memory SQLite database for testing
        cls.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(cls.engine)
        cls.Session = sessionmaker(bind=cls.engine)

    def setUp(self):
        # Create a new session before each test
        self.session = self.Session()

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
            current_participants=0,
        )
        self.session.add(self.sample_poll)
        self.session.commit()

    def tearDown(self):
        # Close the session after each test
        self.session.rollback()
        self.session.close()

        Base.metadata.drop_all(self.engine)
        Base.metadata.create_all(self.engine)

    def test_add_participant_to_poll(self):
        # Test adding a participant to a poll
        print(self.sample_poll.id)
        updated_poll = add_participant_to_poll(self.session, self.sample_poll.id, "party1")

        self.assertEqual(updated_poll.current_participants, 1)
        self.assertIn("party1", updated_poll.participants_party_ids)

    def test_add_participant_exceeding_limit(self):
        # Test adding more participants than allowed
        add_participant_to_poll(self.session, self.sample_poll.id, "party1")
        add_participant_to_poll(self.session, self.sample_poll.id, "party2")
        add_participant_to_poll(self.session, self.sample_poll.id, "party3")

        with self.assertRaises(ValueError):
            # This should raise an error since the max_participants is 3
            add_participant_to_poll(self.session, self.sample_poll.id, "party4")

    def test_add_participant_no_poll_found(self):
        # Test adding a participant to a non-existent poll
        with self.assertRaises(ValueError):
            add_participant_to_poll(self.session, 999, "party1")  # Non-existent poll ID

    @classmethod
    def tearDownClass(cls):
        # Dispose the engine to clean up resources after all tests
        cls.engine.dispose()

if __name__ == "__main__":
    unittest.main()
