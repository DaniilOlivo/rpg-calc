const python = require("../python_api")
const userDB = require("../db").user
const log = require("./log")

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

    async sendAdmin(user) {
        const packageWs = JSON.stringify({
            character: user.character,
            package: await this.getDataCore(user)
        })
        let wsAdmin = this.journalWs.getWSAdmin()
        if (wsAdmin) wsAdmin.send(packageWs)
    }

    pingPong() {
        Socket.logger("Test connection")
        this.send({signal: "PONG"})
    }

    async register(username) {
        Socket.logger("Register " + username)
        let user = await this.journalWs.addSocket(this.ws, username)
        this.send({signal: "REGISTER", admin: user.admin})
        this.broadcast(log.packageMesHello(username))
    }

    broadcast(packageWs) {
        for (let { ws } of this.journalWs) {
            ws.send(JSON.stringify(packageWs)) 
        }
    }

    async getDataCore(user) {
        let dataChar = await python.callCore("GET", user.character)
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
        for (let user of await userDB.getAllUsers(false)) {
            await this.sendAdmin(user)
        }
    }

    async setColor(color) {
        let user = this.journalWs.getUser(this.ws)
        user.color = color
        await user.save()
        let updateChar = await this.getDataCore(user)
        this.send({package: updateChar})
        await this.sendAdmin(user)
    }

    message(message) {
        let username = this.journalWs.getUser(this.ws).username
        this.broadcast(log.packageMes(username, message))
    }

    dispatcher(packageWs) {
        let signal = packageWs.signal
        if (signal === "PING") this.pingPong()
        if (signal === "REGISTER") this.register(packageWs.user)
        if (signal === "GET") this.get()
        if (signal === "GET_ALL") this.getAll()
        if (signal === "SET_COLOR") this.setColor(packageWs.color)
        if (signal === "MESSAGE") this.message(packageWs.message)
    }

    close() {
        Socket.logger("Close")
        let user = this.journalWs.getUser(this.ws)
        this.broadcast(log.packageMesGoodbye(user.username))
        this.journalWs.removeSocket(this.ws)
    }
}

module.exports = Socket
