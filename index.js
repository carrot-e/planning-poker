const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const amqp = require('amqplib/callback_api');

var channel,
    clients = [],
    tasks = [],
    votes = [],
    boardId = '',
    phpInputQueue = 'input-queue',
    phpOutputQueue = 'output-queue',
    boardCreated = 'board-created',
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
        ch.consume(phpOutputQueue, function(data) {
            data = data.content.toString();
            data = JSON.parse(data);
            for (var clientId in data) {
                io.to(clientId).emit(taskStatistics, data[clientId]);
            }
        }, {noAck: true});
    });
});

io.on('connection', function(socket) {
    console.log('a user connected', socket.id);

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on(boardCreated, function() {
        console.log('board created', socket.id);
        if (!boardId) {

            boardId = socket.id;
        }
    });

    socket.on(startTask, function(data) {
        console.log('starting task', data);
        tasks.push(data);
        socket.broadcast.emit(startTask, data);
    });
    socket.on(stopTask, function(data) {
        socket.broadcast.emit(stopTask, data);
    });
    socket.on(clientLogin, function(data) {
        console.log(data, boardId);

        clients.push({userName: data.userName, clientId: socket.id});
        io.to(boardId).emit(clientLogin, clients); // emit all clients to board
        io.to(socket.id).emit(clientLogin, data); // emit to current client his login data
    });

    socket.on(clientVote, function(data) {
        var prepared = {task: data.task, clientId: socket.id, card: data.card};
        votes.push(prepared);
        io.to(boardId).emit(clientVote, prepared); // emit the vote to board
    });

    socket.on(taskStatistics, function() {
        channel.sendToQueue(phpInputQueue, new Buffer(JSON.stringify({
            votes: votes,
            clients: clients
        })));
    });
});

http.listen(4001, function() {
    console.log('listening on *:4001');
});
