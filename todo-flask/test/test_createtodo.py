import unittest
import json
from app import app


class TodoCreationTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_todo_creation_success(self):
        response = self.app.post('/login', json={"Email": "12@12.ch", "Password": "1212"})
        token = json.loads(response.data)["token"]

        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        response = self.app.post('/todo', headers=headers, json={"Title": "Test todo"})

        self.assertEqual(response.status_code, 200)
        self.assertIn("id", json.loads(response.data))
        self.assertEqual(json.loads(response.data)["Title"], "Test todo")
        self.assertIn("user_id", json.loads(response.data))
        self.assertEqual(json.loads(response.data)["Status"], False)
