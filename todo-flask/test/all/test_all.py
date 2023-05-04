import hashlib
import json
import unittest

import jwt
import datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app import app
from models import User, Todo


class Begin(unittest.TestCase):
    db = None
    token = None

    def __init__(self, *args, **kwargs):
        super(Begin, self).__init__(*args, **kwargs)
        self.app = app.test_client()
        engine = create_engine('mysql+pymysql://jann:soxes123!@janntest.mysql.database.azure.com:3306/todo')
        session = sessionmaker(bind=engine)
        base = declarative_base()
        self.db = session()
        base.metadata.create_all(engine)

        Begin.db = self.db

    @classmethod
    def setUpClass(cls):
        with app.app_context():
            cls.app = app.test_client()

    def test_login_success(self):
        # Arrange
        email = "test_login_success@test.com"
        password = "test123"
        user = self.create_user(email, password)

        # Act
        response = self.app.post('/login', json={"Email": email, "Password": password})
        print(response)

        # Clean up
        self.remove_user(user)

        # Assert
        self.assertEqual(200, response.status_code)
        self.assertIn(b"token", response.data)

    def test_login_invalid_email(self):
        # Arrange
        email = "test_login_invalid_email@test.com"
        password = "test123"
        wrong_email = "elefant@kamel.esel"
        user = self.create_user(email, password)

        response = self.app.post('/login', json={"Email": wrong_email, "Password": password})

        print(response)

        # Clean up
        self.remove_user(user)

        self.assertEqual(response.status_code, 401)
        self.assertIn(b"email or password is wrong", response.data)

    def test_login_invalid_password(self):
        # Arrange
        email = "test_login_invalid_password@test.com"
        password = "test123"
        wrong_pw = "elefantkamel.esel"
        user = self.create_user(email, password)

        response = self.app.post('/login', json={"Email": email, "Password": wrong_pw})

        print(response)

        # Clean up
        self.remove_user(user)

        self.assertEqual(response.status_code, 401)
        self.assertIn(b"email or password is wrong", response.data)

    def test_delete_todo(self):
        # Arrange
        email = "test_delete_todo@test.com"
        password = "test123"
        user = self.create_user(email, password)

        todo = Todo(Title="test todo", user_id=user.id, Status=False)
        self.db.add(todo)
        self.db.commit()

        response = self.app.delete(f"/todo/{todo.id}")

        print(response)

        self.assertEqual(response.status_code, 200)

        # Clean up
        self.remove_user(user)

    def test_get_todos_with_valid_token(self):
        email = "test_get_todos_with_valid_token1@test.com"
        password = "test123"
        user = self.create_user(email, password)

        # Login
        login_response = self.app.post('/login', json={"Email": email, "Password": password})
        print(login_response)
        self.assertEqual(200, login_response.status_code)
        self.assertIn(b"token", login_response.data)

        # Get todos
        token = login_response.json["token"]
        todo_response = app.test_client().get("/todo", headers={"Authorization": f"Bearer {token}"})
        print(todo_response)
        self.assertEqual(200, todo_response.status_code)
        self.assertIsInstance(todo_response.json, list)

        # Clean up
        self.remove_user(user)

    def test_get_todos_with_invalid_token(self):  # funktioniert
        headers = {
            "Authorization": "Bearer invalid_token"
        }
        response = self.app.get("/todo", headers=headers)
        print(response)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.data)["error"], "invalid token")

    def test_update_todo(self):  # geht
        # Arrange
        email = "test_update_todo@test.com"
        password = "test123"
        user = self.create_user(email, password)

        todo = Todo(Title="test todo", user_id=user.id, Status=False)
        self.db.add(todo)
        self.db.commit()

        new_title = "Updated todo"
        new_status = True
        response = app.test_client().put(f"/todo/{todo.id}", json={"Title": new_title, "Status": new_status})
        print(response)

        self.assertEqual(response.status_code, 200)
        # Clean up
        self.remove_user(user)

    def test_create_user(self):
        # Arrange
        email = "test_create_user@test.com"
        password = "test123"

        # Act
        response = app.test_client().post("/user", json={"Email": email, "Password": password})
        print(response)

        # Clean up
        new_user = self.db.query(User).filter_by(Email=email).first()
        self.remove_user(new_user)

        # Assert
        self.assertEqual(200, response.status_code)
        self.assertEqual(email, response.json['Email'])
        self.assertEqual(hashlib.sha256(password.encode()).hexdigest(), response.json['Password'])

    def test_create_user_with_existing_email(self):
        # Arrange
        email = "test_create_user_with_existing_email@test.com"
        password = "test123"
        response = self.app.post("/user", json={"Email": email, "Password": password})
        self.assertEqual(200, response.status_code)
        print(response)
        print('login')

        # Try to create a user with the same email
        data = {"Email": email, "Password": "asdf"}
        response = self.app.post("/user", json=data)
        print(response)

        # Assert
        self.assertEqual(401, response.status_code)

        # Clean up
        new_user = self.db.query(User).filter_by(Email=email).first()
        if new_user:
            self.remove_user(new_user)

    def create_user(self, email, password):
        user = User(Email=email, Password=hashlib.sha256(password.encode()).hexdigest())
        self.db.add(user)
        self.db.commit()
        return user

    def remove_user(self, user):
        self.db.delete(user)
        self.db.commit()

    def create_token(self, user_id, secret_key):
        expiration = datetime.timedelta(minutes=60)
        payload = {
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + expiration
        }
        token = jwt.encode(payload, secret_key, algorithm='HS256')
        return token
