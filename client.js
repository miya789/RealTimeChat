const io = require('socket.io-client');
const socket = io('http://13.113.66.127:3000/');

socket.on('connect', () => {
    console.log("connected!")
    socket.emit('chat message', 'send message.');
    socket.disconnect()
    // socket.on('chat message', (msg) => {
    //     // io.emit('chat message', msg);
    // });
});