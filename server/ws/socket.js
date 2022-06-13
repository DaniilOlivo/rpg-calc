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

    static loggerObject(obj) {
        console.log(obj)
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
        this.broadcast(log.packageMesHello(user))
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

    async setDataCore(user, data) {
        data.character = user.character
        return await python.callCore("SET", JSON.stringify(data))
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

    async set(data) {
        Socket.logger(`SET`)
        Socket.loggerObject(data)
        let user = this.journalWs.getUser(this.ws)
        let char = await this.setDataCore(user, data)
        this.send({package: char})
        await this.sendAdmin(user)
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
        let user = this.journalWs.getUser(this.ws)
        this.broadcast(log.packageMes(user, message))
    }

    dispatcher(packageWs) {
        let signal = packageWs.signal
        if (signal === "PING") this.pingPong()
        if (signal === "REGISTER") this.register(packageWs.user)
        if (signal === "GET") this.get()
        if (signal === "GET_ALL") this.getAll()
        if (signal === "SET") this.set(packageWs.data)
        if (signal === "SET_COLOR") this.setColor(packageWs.color)
        if (signal === "MESSAGE") this.message(packageWs.message)
    }

    close() {
        Socket.logger("Close")
        let user = this.journalWs.getUser(this.ws)
        this.broadcast(log.packageMesGoodbye(user))
        this.journalWs.removeSocket(this.ws)
    }
}

module.exports = Socket
