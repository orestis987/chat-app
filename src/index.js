const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { Socket } = require('dgram')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Filter = require('bad-words')
const {generateMessages, generateLocationMessages} = require('./utils/messages')
const userUtils = require('./utils/users')

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))



io.on('connection', (socket)=>{
    console.log('New web socket connection!')




    socket.on('join', ({username, room}, callback )=>{
        socket.join(room)
        const {error, user} = userUtils.addUser({id: socket.id, username, room})

        if (error) {
            return callback(error)
        }

        socket.emit('message', generateMessages('Admin', `Welcome ${user.username}!`) )
        socket.broadcast.to(user.room).emit('message', generateMessages('Admin', `${user.username} has joined!`))// send to all others

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: userUtils.getUsersInRoom(user.room)
        })

        callback()//was run without error
    })

    socket.on('SendMessage', (clientMessage, callback)=> {
        filter = new Filter()

        if (filter.isProfane(clientMessage)) {
            return callback('Profanity is not allowed')
        }
        const user = userUtils.getUser(socket.id)
        io.to(user.room).emit('message', generateMessages(user.username, clientMessage))
        callback()
    })

    socket.on('sendLocation', (location, callback)=> {
        const user = userUtils.getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessages(user.username, location.lat, location.lon) )
        callback()
    })

    //User-Disconnect
    socket.on('disconnect', () =>{
        const user = userUtils.removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessages('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: userUtils.getUsersInRoom(user.room)
            })
        }
    })
})



server.listen(port, ()=> {
    console.log('Server is up on port ' + port)
})

