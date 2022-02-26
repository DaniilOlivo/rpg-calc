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
        let user = await this.journalWs.addSocket(this.ws, username)
        this.send({signal: "REGISTER", admin: user.admin})
    }

    async getDataCore(user) {
        let dataChar = await callCore("GET", user.character)
        dataChar.color = user.color
        return dataChar
    }

    async get(user) {
        if (!user) user = this.journalWs.getUser(this.ws)
        Socket.logger("Get character " + user.username)
        this.send({package: await this.getDataCore(user)})
    }

    async getAll() {
        Socket.logger("Get all characters")
        let data = {}
        for (let user of await getAllUsers(false)) {
            data[user.character] = await this.getDataCore(user)
        }
        this.send({package: data, admin: true})
    }

    async setColor(color) {
        let user = this.journalWs.getUser(this.ws)
        user.color = color
        await user.save()
        this.send({package: await this.getDataCore(user)})
    }

    dispatcher(packageWs) {
        let signal = packageWs.signal
        if (signal === "PING") this.pingPong()
        if (signal === "REGISTER") this.register(packageWs.user)
        if (signal === "GET") this.get()
        if (signal === "GET_ALL") this.getAll()
        if (signal === "SET_COLOR") this.setColor(packageWs.color)
    }
}

module.exports = Socket
