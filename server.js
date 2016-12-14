// require express and path
var express = require("express");
var path = require("path");
// create the express app
var app = express();
// select port and listens
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});

var usersInRoom = {};

// use server variable w/ socket.io
var io = require('socket.io').listen(server)
// on connection event, run code
io.sockets.on('connection', function (socket) {
console.log('socket id: ', socket.id);

    var userName = null;

    //listener waiting for form submit from modal
    socket.on('user_name_added', function(data){
        //saved to back end for chat room user display (future)
        var key1 = data.un
        console.log(usersInRoom[key1])
        if(usersInRoom[key1]){
            console.log("duplicate user name detected")
            socket.emit('un_server_response', {response: "error"})
        }else{
            userName = data.un;
            usersInRoom[userName] = 1;
            socket.broadcast.emit('un_server_response', {response: data.un});
        }
    })
    socket.on('udateUL', function(data){
        io.emit('ul_server_response', {usersList: usersInRoom});
    })
    //listener waiting for "text_sent" emit from front end
    //data in callback is form data object passed by emitter
    socket.on('text_sent', function(data){
        //use io.emit to broadcast to all users
        console.log(data)
        io.emit('text_received', {response: data.text[0].value, userName: userName});
    })
    socket.on('disconnect', function(){
        io.emit('user_left', {response: userName})
        //remove user from list
        delete usersInRoom[userName];
    })
})



// static content
app.use(express.static(path.join(__dirname, "./static")));
// root route
app.get('/', function(req, res) {
    //res.render("index", {users: usersInRoom});
    res.sendFile(__dirname + '/views/index.html');
})
