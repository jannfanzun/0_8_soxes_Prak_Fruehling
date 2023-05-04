import hashlib
import jwt
import secrets
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import User, Todo, Schema
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)
CORS(app)

engine = create_engine('mysql+pymysql://jann:soxes123!@janntest.mysql.database.azure.com:3306/todo')
Session = sessionmaker(bind=engine)
db = Session()

secret_key = secrets.token_hex(32)


@app.route("/todo", methods=["POST"])
def create_todo():
    req = request.get_json()
    user_id = decode_token(request.headers["Authorization"].split(" ")[1])
    if user_id is None:
        return jsonify({"error": "invalid token"}), 401
    req["user_id"] = user_id
    todo = Todo(Title=req["Title"], user_id=req["user_id"], Status=False)
    db.add(todo)
    db.commit()
    return jsonify({"id": todo.id, "Title": todo.Title, "user_id": todo.user_id, "Status": todo.Status})


@app.route("/login", methods=["POST"])
def login():
    req = request.get_json()
    email = req["Email"]
    password = req["Password"]
    print('emailllll')
    user = db.query(User).filter_by(Email=email).first()
    print('asdfkljlllds')

    if user is None:
        print('email falsch')
        return jsonify({"error": "email or password is wrong!"}), 401

    if not check_password(password, user.Password):
        print('pw falsch')
        return jsonify({"error": "email or password is wrong!"}), 401

    token = create_token(user.id)
    print('ich gebe das zurück')
    return jsonify({"token": token}), 200


def check_password(password, hashed_password):
    password_bytes = password.encode('utf-8')
    hashed_bytes = bytes.fromhex(hashed_password)
    return hashlib.sha256(password_bytes).digest() == hashed_bytes


def create_token(user_id):
    expiration = datetime.utcnow() + timedelta(minutes=60)

    payload = {
        'user_id': user_id,
        'exp': expiration
    }

    token = jwt.encode(payload, secret_key, algorithm='HS256')

    return token


@app.route("/todo", methods=["GET"])
def get_todos():
    user_id = decode_token(request.headers["Authorization"].split(" ")[1])
    if user_id is None:
        return jsonify({"error": "invalid token"}), 401
    todos = db.query(Todo).filter_by(user_id=user_id).all()
    return jsonify(
        [{"id": todo.id, "Title": todo.Title, "user_id": todo.user_id, "Status": todo.Status} for todo in todos])


@app.route("/todo/<int:id>", methods=["DELETE"])
def delete_todo(id):
    todo = db.query(Todo).get(id)
    db.delete(todo)
    db.commit()
    return jsonify(success=True)


@app.route("/todo/<int:id>", methods=["PUT"])
def update_todo(id):
    req = request.get_json()
    todo = db.query(Todo).get(id)
    todo.Title = req["Title"]
    todo.Status = req["Status"]
    db.commit()
    return jsonify({"id": todo.id, "Title": todo.Title, "user_id": todo.user_id, "Status": todo.Status})


@app.route("/user", methods=["POST"])
def create_user():
    req = request.get_json()
    email = req["Email"]
    password = req["Password"]

    existing_user = db.query(User).filter_by(Email=email).first()
    if existing_user:
        return jsonify({"error": "Email already exists!"}), 401

    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    user = User(Email=email, Password=hashed_password)
    db.add(user)
    db.commit()

    return jsonify({"id": user.id, "Email": user.Email, "Password": user.Password})


def decode_token(token):
    try:
        payload = jwt.decode(token, secret_key, algorithms='HS256')
        return payload['user_id']
    except jwt.ExpiredSignatureError as e:
        print(e)
        return None
    except jwt.InvalidTokenError as r:
        print(r)
        return None


if __name__ == "__main__":
    Schema()
    app.run(debug=True)
