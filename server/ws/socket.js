const callCore = require("../python_api").callCore

class Socket {
    constructor(ws, journalWs) {
        this.ws = ws
        this.journalWs = journalWs
    }

    static logger(message) {
        console.log("WS | " + message)
    }

    send(data) {
        this.ws.send(JSON.stringify(data))
    }

    pingPong() {
        Socket.logger("Test connection")
        this.send({signal: "PONG"})
    }

    async register(username) {
        Socket.logger("Register " + username)
        await this.journalWs.addSocket(this.ws, username)
        this.send({signal: "REGISTER"})
    }

    async getDataCore() {
        let user = this.journalWs.getUser(this.ws)
        Socket.logger("Get character " + user.username)
        let dataChar = await callCore("GET", user.character)
        this.send({package: dataChar})
    }

    dispatcher(packageWs) {
        let signal = packageWs.signal
        if (signal === "PING") this.pingPong()
        if (signal === "REGISTER") this.register(packageWs.user)
        if (signal === "GET") this.getDataCore() 
    }
}

module.exports = Socket
