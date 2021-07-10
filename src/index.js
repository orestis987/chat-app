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


const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))



io.on('connection', (socket)=>{
    console.log('New web socket connection!')




    socket.on('join', ({username, room})=>{
        socket.join(room)
        socket.emit('message', generateMessages("Welcome user!") )
        socket.broadcast.to(room).emit('message', generateMessages(`${username} has joined ${room}!`))// send to all others
    })

    socket.on('SendMessage', (clientMessage, callback)=> {
        filter = new Filter()

        if (filter.isProfane(clientMessage)) {
            return callback('Profanity is not allowed')
        }

        io.emit('message', generateMessages(clientMessage))
        callback()
    })

    socket.on('sendLocation', (location, callback)=> {
        io.emit('locationMessage', generateLocationMessages(location.lat, location.lon) )
        callback()
    })

    //User-Disconnect
    socket.on('disconnect', () =>{
        io.emit('message', generateMessages("A user has left"))
    })
})



server.listen(port, ()=> {
    console.log('Server is up on port ' + port)
})

