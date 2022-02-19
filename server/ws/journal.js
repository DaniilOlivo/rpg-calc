const userDB = require("../db").user

class Journal extends Array {
    async addSocket(ws, username) {
        let user = await userDB.getUser({username})
        this.push({ws, user})
        return user
    }

    getUser(ws) {
        let socket = this.find(socket => socket.ws === ws)
        return socket.user
    }

    removeSocket(ws) {
        let socketIndex = this.findIndex(socket => socket.ws === ws)
        this.splice(socketIndex, 1)
    }
}

module.exports = Journal
