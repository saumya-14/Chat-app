const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const connect = require('./config/database-config');

const Chat = require('./models/chat');

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('join room', (data) => {
        console.log("joining a room", data.roomid);
        socket.join(data.roomid, function () {
            console.log('joined a room')
        });
    });

    socket.on('msg send',async (data) => {
        console.log(data);
        const chat  =await Chat.create({
            roomId:data.roomid,
            user:data.username,
            content:data.msg
        });
        io.to(data.roomid).broadcast.emit('msg received', data);
    });

    socket.on('typing',(data)=>{
        io.to(data.roomId).emit('someone is typing');
    })
});

app.set('view engine', 'ejs');

app.use('/', express.static(__dirname + '/public'));

app.get('/chat/:roomid',async (req, res) => {
    const chats=await Chat.find({
        roomId:req.params.roomid
    }).select('content user');
    res.render('index', {
        name: 'Saumya',
        id: req.params.roomid,
        chats:chats
    });
});

server.listen(3000, async () => {
    console.log('server running at http://localhost:3000');
    await connect();
    console.log("mongodb connected");
});
