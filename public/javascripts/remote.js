remote = (function () {
    var socket, allowed,
        leftSpeed = 0, rightSpeed = 0,
        topServo = 0, bottomServo = 0,
        shouldSend = false;

    function initialize() {
        socket = io.connect(window.location.origin);
        allowed = true;
        bindEvents();
        startRemoteControl();
        setInterval(timeIntervalCallback, 300);
    }

    function timeIntervalCallback() {
        if(shouldSend){
            sentKeyboardMessageToServer(leftSpeed+","+rightSpeed+","+topServo+","+bottomServo);
        }
    }

    var bindEvents = function () {
        socket.on("keyboard message to other client event", function (data) {
            console.log("recieved Keyboard Message From Server");
            console.log(data.valueOf());
        });
    };

    function sentKeyboardMessageToServer(data) {
        socket.emit('keyboard message from client event', {action: data})
        console.log("SENT:" + data);
    }

    function startRemoteControl() {
        $("body").bind('keydown', function (event) {
            shouldSend =true;
            if (event.keyCode == 38) {
                leftSpeed = -1;
                rightSpeed = -1;
            }
            else if (event.keyCode == 40) {
                leftSpeed = 1;
                rightSpeed = 1;
            }
            else if (event.keyCode == 37) {
                leftSpeed = -1;
                rightSpeed = 1;
            }
            else if (event.keyCode == 39) {
                leftSpeed = 1;
                rightSpeed = -1;
            } else if (event.keyCode == 87) {
                //w
                topServo = 1;
            } else if (event.keyCode == 83) {
                //s
                topServo = -1;
            }
            else if (event.keyCode == 65) {
                //a
                bottomServo = 1;
            }
            else if (event.keyCode == 68) {
                //d
                bottomServo = -1;
            }
            else {
                console.log("please send actions 'w','s','a','d','h' to other device.")
            }
        });

        $("body").bind('keyup', function(event){
            shouldSend = false;
            if($.inArray(event.keyCode, [37,38,39,40,87,83,65,68]) > -1 ){
                leftSpeed = rightSpeed = topServo = bottomServo = 0;
            }
        });
    }

    function stopRemoteControl() {
        $("body").unbind('keyup');
        $("body").unbind('keydown');
    }

    initialize();

    return {
        initialize: initialize,
        startRemoteControl: startRemoteControl,
        stopRemoteControl: stopRemoteControl
    }

})()
