import hashlib

from models import Todo, User, Session


class TodoService:
    def __init__(self):
        self.session = Session()

    def create(self, params):
        todo = Todo(
            Title=params["Title"],
            user_id=params["user_id"],
            Status=False
        )
        self.session.add(todo)
        self.session.commit()
        return f"Ok {todo}"

    def get_all(self, user_id):
        todos = self.session.query(Todo).filter_by(user_id=user_id).all()
        return todos

    def del_todo(self, id):
        todo = self.session.query(Todo).get(int(id))
        self.session.delete(todo)
        self.session.commit()

    def update(self, id, req):
        try:
            todo_id = int(id)
        except ValueError:
            raise ValueError("Invalid todo ID")

        todo = self.session.query(Todo).get(todo_id)
        if not todo:
            raise LookupError("Todo not found")

        if "Title" in req:
            todo.Title = req["Title"]

        self.session.commit()
        return 'ok'

    def create_user(self, params):
        hashed_password = self.hash_password(params["Password"])
        user = User(
            Email=params["Email"],
            Password=hashed_password
        )
        self.session.add(user)
        self.session.commit()
        return f"Ok"

    def get_user_by_email(self, email):
        user = self.session.query(User).filter_by(Email=email).first()
        if user:
            return {"id": user.id, "Email": user.Email, "Password": user.Password}
        else:
            return None

    def hash_password(self, password):
        password_bytes = password.encode('utf-8')
        hashed_bytes = hashlib.sha256(password_bytes).digest()
        hashed_password = hashed_bytes.hex()
        return hashed_password
