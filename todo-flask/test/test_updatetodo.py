from app import db, app
from models import Todo, User
import unittest


class TestUpdateTodo(unittest.TestCase):
    def test_update_todo(self):
        user = User(Email="12@12.ch", Password="1212")
        db.add(user)
        db.commit()

        todo = Todo(Title="test todo", user_id=user.id, Status=False)
        db.add(todo)
        db.commit()

        new_title = "Updated todo"
        new_status = True
        response = app.test_client().put(f"/todo/{todo.id}", json={"Title": new_title, "Status": new_status})

        assert response.status_code == 200
        data = response.get_json()
        assert data["id"] == todo.id
        assert data["Title"] == new_title
        assert data["user_id"] == todo.user_id
        assert data["Status"] == new_status
