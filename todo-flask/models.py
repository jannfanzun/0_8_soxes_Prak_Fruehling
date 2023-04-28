import hashlib

from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('mysql+pymysql://jann:soxes123!@janntest.mysql.database.azure.com:3306/todo')
Session = sessionmaker(bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True)
    Email = Column(String(255))
    Password = Column(String(255))

    def __repr__(self):
        return f"<User(id='{self.id}', Email='{self.Email}', Password='{self.Password}')>"


class Todo(Base):
    __tablename__ = 'Todo'

    id = Column(Integer, primary_key=True)
    Title = Column(String(255))
    user_id = Column(Integer, ForeignKey(User.id))
    Status = Column(Boolean)

    def __repr__(self):
        return f"<Todo(id='{self.id}', Title='{self.Title}', user_id='{self.user_id}', Status='{self.Status}')>"


class Schema:
    def __init__(self):
        Base.metadata.create_all(engine)


class TodoModel:
    def __init__(self):
        self.session = Session()

    def create(self, title, user_id):
        todo = Todo(Title=title, user_id=user_id, Status=False)
        self.session.add(todo)
        self.session.commit()
        return f"Ok {todo}"

    def get_all(self, user_id):
        todos = self.session.query(Todo).filter(Todo.user_id == user_id).all()
        return todos

    def del_todo(self, id):
        todo = self.session.query(Todo).filter(Todo.id == id).first()
        self.session.delete(todo)
        self.session.commit()

    def update(self, todo):
        todo_obj = self.session.query(Todo).filter(Todo.id == todo[0]).first()
        todo_obj.Title = todo[1]
        self.session.commit()
        return 'ok'

    def get_by_id(self, id):
        todo = self.session.query(Todo).filter(Todo.id == id).first()
        return todo

    def create_user(self, email, password):
        hashed_password = self.hash_password(password)
        user = User(Email=email, Password=hashed_password)
        self.session.add(user)
        self.session.commit()
        return f"Ok"


    def get_todos_by_user(self, user_id):
        todos = self.session.query(Todo).filter(Todo.user_id == user_id).all()
        return [todo.__dict__ for todo in todos]

    def get_user_by_email(self, email):
        user = self.session.query(User).filter(User.Email == email).first()
        if user:
            return {"id": user.id, "Email": user.Email, "Password": user.Password}
        else:
            return None

    def hash_password(self, password):
        password_bytes = password.encode('utf-8')
        hashed_bytes = hashlib.sha256(password_bytes).digest()
        hashed_password = hashed_bytes.hex()
        return hashed_password

    def set_todo_status(self, id, status):
        todo = self.session.query(Todo).filter(Todo.id == id).first()
        todo.Status = status
        self.session.commit()
        return 'ok'

    def get_completed_todos(self, user_id):
        todos = self.session.query(Todo).filter(Todo.user_id == user_id, Todo.Status == True).all()
        return todos

    def get_incomplete_todos(self, user_id):
        todos = self.session.query(Todo).filter(Todo.user_id == user_id, Todo.Status == False).all()
        return todos
