const generateMessages = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessages = (lat, lon) => {
    return {
        url: 'https://www.google.com/maps?q='+lat + ','+lon,
        createdAt: new Date().getTime()
    }
}


module.exports = {
    generateMessages,
    generateLocationMessages
}