const express = require('express')
const app = express()
// const cors = require('cors')
// app.use(cors())
const server = require('http').Server(app)
const { Server } = require("socket.io");
const io = new Server(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')

process.env.NODE_ENV = 'development';

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

// app.get('/', (_, res) => {
//   res.redirect(`/${uuidV4()}`)
// })
app.get('/', (req, res) => {
  console.log("hi")
  res.render('whiteBoard')
})

app.get('/logout', (_, res) => {
  res.render('logout')
})
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(3030)
