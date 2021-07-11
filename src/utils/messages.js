const generateMessages = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessages = (username, lat, lon) => {
    return {
        username,
        url: 'https://www.google.com/maps?q='+lat + ','+lon,
        createdAt: new Date().getTime()
    }
}


module.exports = {
    generateMessages,
    generateLocationMessages
}