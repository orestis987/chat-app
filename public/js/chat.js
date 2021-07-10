const socket = io() //the connection with server

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//message template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, {ignoreQuerPrefix: true})

socket.on('message', (msg)=> {
    console.log(msg)
    const html = Mustache.render(messageTemplate, { 
        msg: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (locationUrl)=> {
    console.log(locationUrl)
    const html = Mustache.render(locationTemplate, {
        url: locationUrl.url,
        createdAt: moment(locationUrl.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault() //prevent refreshing the browser

    $messageFormButton.setAttribute('disabled', 'disabled')

    //disable button
    const clientMessage = e.target.elements.message.value

    socket.emit('SendMessage', clientMessage, (error)=> {
        $messageFormButton.removeAttribute('disabled')//re-enable button
        $messageFormInput.value = '' //clear the text field
        $messageFormInput.focus() //move the curson inside of it

        if (error) {
            return console.log(error)
        }

        console.log('Message Delivered')
    })
})



$sendLocationButton.addEventListener('click', ()=> {
    $sendLocationButton.setAttribute('disabled', 'disabled')

    if (!navigator.geolocation) {
        $sendLocationButton.removeAttribute('disabled')
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

        $sendLocationButton.removeAttribute('disabled')
    } )
})


socket.emit('join', {username, room})

//https://www.google.com/maps?q=0,0