let users = []

export const addUser = (userId, socketId, roomId) => {
    const user = users.some(user => user.userId === userId)
    if(!user){
        users.push({userId, socketId, roomId})
    }
}

export const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

export default users