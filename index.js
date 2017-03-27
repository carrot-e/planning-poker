const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const amqp = require('amqplib/callback_api');

var channel,
    clients = [],
    phpInputQueue = 'input-queue',
    phpOutputQueue = 'output-queue',
    startTask = 'start-task',
    stopTask = 'stop-task',
    clientVote = 'client-vote',
    clientLogin = 'client-login',
    taskStatistics = 'task-statistics';


amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        channel = ch;

        ch.assertQueue(phpOutputQueue, {durable: false});
        ch.assertQueue(phpInputQueue, {durable: false});
        // ch.consume(phpOutputQueue, function(msg) {
        //     msg = msg.content.toString();
        //     console.log(" [x] Received %s", msg);
        //     msg = JSON.parse(msg);
        //     io.to(msg.clientId).emit('converted', msg);
        // }, {noAck: true});
    });
});

io.on('connection', function(socket) {
    console.log('a user connected', socket.id);

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('broadcast', function(msg) {
        msg.clientId = socket.id;
        msg = JSON.stringify(msg);
        console.log(" [x] Sending %s", msg);
        channel.sendToQueue(phpInputQueue, new Buffer(msg));
    });
});

http.listen(4001, function() {
    console.log('listening on *:4001');
});
