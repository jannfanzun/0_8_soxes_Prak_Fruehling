import unittest
from app import app, create_token
import json


class TestGetTodos(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app = app.test_client()
        self.user_id = 1
        self.token = create_token(self.user_id)

    def test_get_todos_with_valid_token(self):
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        response = self.app.get("/todo", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 0)  

    def test_get_todos_with_invalid_token(self):
        headers = {
            "Authorization": "Bearer invalid_token"
        }
        response = self.app.get("/todo", headers=headers)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.data)["error"], "invalid token")