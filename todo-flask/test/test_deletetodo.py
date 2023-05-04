from app import db, app
from models import User, Todo
import unittest


class TestDeleteTodo(unittest.TestCase):
    def test_delete_todo(self):
        user = User(Email="12@12.ch", Password="1212")
        db.add(user)
        db.commit()

        todo = Todo(Title="test todo", user_id=user.id, Status=False)
        db.add(todo)
        db.commit()

        response = app.test_client().delete(f"/todo/{todo.id}")
        print(response)

        assert response.status_code == 200
        assert db.query(Todo).get(todo.id) is None
