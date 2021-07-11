const users = []

const addUser = ({id, username, room})=>{
    if (!username || !room) {
        return {error: "Please provide username and room!"}
    }

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if (!existingUser) {
        const user = {id, username, room}
        users.push(user)
        return { user }
    } else {
        return {error: 'Username is in use'}
    }


}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if (index != -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    return users.find((user)=> user.id === id )
}


const getUsersInRoom = (room) => {
    return users.filter( (user) => user.room === room  )
}

module.exports = {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
} 