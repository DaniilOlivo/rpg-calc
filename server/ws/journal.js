class Journal extends Array {
    addSocket(ws, user) {
        this.push({ws, user})
    }

    getSocket(options={}) {
        let finderFunction = null
        if (options.ws) finderFunction = socket => socket.ws === ws
        else if (options.admin) finderFunction = socket => socket.user.admin
        else throw new Error("Not found options getSocket method")
        let socket = this.find(finderFunction)
        if (socket) return socket
        else return null
    }

    removeSocket(ws) {
        let socketIndex = this.findIndex(socket => socket.ws === ws)
        this.splice(socketIndex, 1)
    }
}

module.exports = Journal
