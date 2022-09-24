const express = require('express')
const { joinUser, getRoomUsers, removeUser } = require('./utils/users')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const PORT = process.env.PORT || 5000

app.use(express.static('public'))

io.on('connection', socket => {
  // join room
  socket.on('join-room', (username, room) => {
    joinUser(socket.id, username, room)
    socket.join(room)
    io.to(room).emit('user-joined', username, new Date())
    io.to(room).emit('room-users', getRoomUsers(room))
  })
  // disconnect
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if (user) {
      io.to(user.room).emit(
        'user-left',
        user.username,
        new Date()
      )
      io.to(user.room).emit('room-users', getRoomUsers(user.room))
      socket.broadcast.to(user.room).emit('typing-message-remove')
    }
  })
  // new messge
  socket.on('new-message', (message, username, room) => {
    io.to(room).emit(
      'receive-message',
      username,
      new Date(),
      message
    )
  })
  // user is typing
  socket.on('user-typing', (username, room) => {
    socket.broadcast.to(room).emit('typing-message', username)
  })
  // user typing false
  socket.on('user-typing-false', room => {
    socket.broadcast.to(room).emit('typing-message-remove')
  })
})

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
