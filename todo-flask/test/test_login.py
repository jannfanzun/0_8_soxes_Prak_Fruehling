import unittest
from app import app


class LoginTest(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def test_login_success(self):
        response = self.app.post('/login', json={"Email": "12@12.ch", "Password": "1212"})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"token", response.data)

    def test_login_invalid_email(self):
        response = self.app.post('/login', json={"Email": "user2example.com", "Password": "password123"})
        self.assertEqual(response.status_code, 401)
        self.assertIn(b"email or password is wrong", response.data)

    def test_login_invalid_password(self):
        response = self.app.post('/login', json={"Email": "user1@example.com", "Password": "wrongpassword"})
        self.assertEqual(response.status_code, 401)
        self.assertIn(b"email or password is wrong", response.data)
