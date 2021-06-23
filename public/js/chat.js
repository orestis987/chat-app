const socket = io() //the connection with server



document.querySelector('#message-form').addEventListener('submit', (e)=>{
    e.preventDefault() //prevent refreshing the browser

    const clientMessage = e.target.elements.message.value
    socket.emit('SendMessage', clientMessage, (error)=> {
        if (error) {
            return console.log(error)
        }

        console.log('Message Delivered')
    })
})



socket.on('message', (msg)=> {
    console.log(msg)
})

document.querySelector('#send-location').addEventListener('click', ()=> {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition( (position)=>{
        //console.log(position.coords.latitude)
        socket.emit('sendLocation', { 
            lat: position.coords.latitude, 
            lon: position.coords.longitude 
        },(ack) => {
            console.log('Location Shared!', ack)
        })
    } )
})


//https://www.google.com/maps?q=0,0