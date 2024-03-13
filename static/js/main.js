var protocol = 'http'
var domain = "localhost"
var port = "5000"

const socket = io(`${protocol}://${domain}:${port}`,{autoConnect: false}) 

document.getElementById("join-btn").addEventListener('click',function() {
    let username = document.getElementById('username').value;

    socket.connect();

    socket.on('connect',function(){
        socket.emit('user_join',username)
    })
    document.getElementById('chat').style.display = 'block';    
    document.getElementById('landing').style.display = 'none';
})

document.getElementById("message").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        let message = document.getElementById("message").value;
        socket.emit("new_message", message);
        document.getElementById("message").value = "";
    }
})


socket.on("chat", function(data) {
    let ul = document.getElementById("chat-messages");
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(data["username"] + ": " + data["message"]));
    ul.appendChild(li);
    ul.scrolltop = ul.scrollHeight;})


// 斷開與伺服器的連線 特定名稱=>(disconnect )
socket.on("disconnect", function(){
    console.log(username)
    socket.emit("disconnect",username)
})