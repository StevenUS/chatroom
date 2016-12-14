$(document).ready(function (){

    // this triggers the connection event in our server!
    var socket = io.connect();

    //activate the modal
    function activateModal(){
        //disable exiting modal by clicking background
        //or pressing the escape key
        $('#myModal').modal({
            backdrop: 'static',
            keyboard: false
        })

        //show login modal on page load
        $('#myModal').modal('show');
    };
    activateModal();

    function scrollToTop(){
        //grab element
        var element = document.getElementById("chat");
        //scroll to top
        element.scrollTop = element.scrollHeight;
    };
    //store username from modal form in socket
    $('#userNameBtn').click(function (){
        var userName = document.getElementById('userName').value;
        $('#myModal').modal('hide');
        setTimeout(function(){socket.emit("user_name_added", {un: userName})}, 500)

    });

    //assign the username to uN variable
    socket.on('un_server_response', function(data){

        if(data.response == "error" || null){
            activateModal()
        }else{
            $('#chat').append("<p><span class='userEnter'>" + data.response + " entered the chat</span></p><hr>")
        }
        updateUL();
        scrollToTop();
    });

    function updateUL(){
        socket.emit('udateUL', {});
    }
    //update uL
    socket.on('ul_server_response', function(data){
            $('#user_list').empty();
            $('#user_list').append("<ul>")
            for(key in data.usersList){
                $('#user_list').append("<li>" + key + "</li>")
            }
            $('#user_list').append("</ul>")

        scrollToTop();
    });

    //text entered to chat
    $('.user_msg').submit(function(event){
        //jquery form data to array
        var msg = $('.user_msg').serializeArray();
        //emit array to server.js listener socket.on("text_sent")
        socket.emit("text_sent", {text: msg});

        //clear the form after submit
        this.reset();
        //stop form from submitting
        event.preventDefault();

        scrollToTop();

    });

    //listener for broadcast of user chat message
    //callback contains message object from original emit on line 30
    socket.on('text_received', function(data){
        $('#chat').append("<p>" + data.userName + " said: " + data.response + "</p><hr>")

        scrollToTop();
    })

    //user leaves the room
    socket.on('user_left', function(data){
        updateUL();
        if(data.response == 'null'){
            $('#chat').append("<p><span class='userLeft'>" + data.response + " exited the chat</span></p><hr>")
        }

        scrollToTop();
    })

})
