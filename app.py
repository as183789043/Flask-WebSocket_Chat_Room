from flask import Flask,render_template,request
from flask_socketio import SocketIO,emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app,cors_allowed_origins='*')

users={}

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on('connect')
def handle_connect():
    print('New User Connected!! ')


@socketio.on('user_join')
def handle_new_message(username):
    emit("system_message", {"message": f'User {username} Join Chat Room', "username": "System"}, broadcast=True)
    users[username] = request.sid

@socketio.on('new_message')
def handle_new_message(message):
    username=None
    for user in users:
        if users[user] == request.sid:
            username = user 
    emit("chat", {"message": message, "username": username}, broadcast=True)


# disconnect無法傳參數
@socketio.on('disconnect')
def handle_exit():
    for user in users:
        if users[user] == request.sid:
            username = user 
    emit("system_message", {"message": f'User {username} exit Chat Room' , "username": 'System'}, broadcast=True)


if __name__=="__main__":
    socketio.run(app,host='0.0.0.0',port=5000)
