const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { Socket } = require('dgram')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Filter = require('bad-words')

const port = process.env.PORT || 3012
const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))



io.on('connection', (socket)=>{
    console.log('New web socket connection!')


    socket.emit('message', "Welcome user!")
    socket.broadcast.emit('message', 'A new user has joined!')// send to all others


    socket.on('SendMessage', (clientMessage, callback)=> {
        filter = new Filter()

        if (filter.isProfane(clientMessage)) {
            return callback('Profanity is not allowed')
        }

        io.emit('message', clientMessage)
        callback()
    })

    socket.on('sendLocation', (location, callback)=> {
        io.emit('message', 'https://www.google.com/maps?q='+location.lat + ','+location.lon)
        callback('Location Delivered')
    })

    //User-Disconnect
    socket.on('disconnect', () =>{
        io.emit('message', "A user has left")
    })
})



server.listen(port, ()=> {
    console.log('Server is up on port ' + port)
})

