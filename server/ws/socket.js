const callCore = require("../python_api").callCore
const { getAllUsers } = require("../db").user

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

    async getDataCore(user) {
        if (!user) user = this.journalWs.getUser(this.ws)
        Socket.logger("Get character " + user.username)
        let dataChar = await callCore("GET", user.character)
        dataChar.color = user.color
        this.send({package: dataChar})
    }

    async getAllDataCore() {
        Socket.logger("Get all characters")
        let data = {}
        for (let user of await getAllUsers(false)) {
            let dataChar = await callCore("GET", user.character)
            dataChar.color = user.color
            data[user.character] = dataChar
        }
        this.send({package: data})
    }

    dispatcher(packageWs) {
        let signal = packageWs.signal
        if (signal === "PING") this.pingPong()
        if (signal === "REGISTER") this.register(packageWs.user)
        if (signal === "GET") this.getDataCore()
        if (signal === "GET_ALL") this.getAllDataCore()
    }
}

module.exports = Socket
