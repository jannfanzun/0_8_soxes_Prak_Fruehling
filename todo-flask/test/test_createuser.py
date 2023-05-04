import unittest
import json
from app import app


class UserTestCase(unittest.TestCase):

    def test_create_user(self):
        tester = app.test_client(self)
        data = json.dumps({
            "Email": "testneu@test.com",
            "Password": "test123"
        })
        response = tester.post('/user', data=data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_create_user_with_existing_email(self):
        tester = app.test_client(self)
        data = json.dumps({
            "Email": "test123@test.com",
            "Password": "test123"
        })
        tester.post('/user', data=data, content_type='application/json')
        response = tester.post('/user', data=data, content_type='application/json')
        self.assertEqual(response.status_code, 401)
