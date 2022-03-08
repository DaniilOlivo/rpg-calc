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

    getWSAdmin() {
        let record = this.find(socket => socket.user.admin)
        if (record) return record.ws
        else return null 
    }

    removeSocket(ws) {
        let socketIndex = this.findIndex(socket => socket.ws === ws)
        this.splice(socketIndex, 1)
    }
}

module.exports = Journal
