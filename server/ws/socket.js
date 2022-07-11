const python = require("../python_api")
const userDB = require("../db").user
const log = require("./log")

class Socket {
    constructor(ws, journalWs) {
        this.ws = ws
        this.journalWs = journalWs
        this.user = null
    }

    logger(message) {
        let startStr = "WS | "
        if (this.user) {
            startStr += this.user.username + " | "
        }
        console.log(startStr + message)
    }

    send(packageWs, admin=false) {
        let ws = this.ws
        if (admin) {
            ws = this.journalWs.getSocket({admin: true}).ws
        }
        if (ws) ws.send(JSON.stringify(packageWs))
    }

    broadcast(packageWs) {
        for (let { ws } of this.journalWs) {
            ws.send(JSON.stringify(packageWs)) 
        }
    }

    async getDataCore() {
        return await python.callCore("GET")
    }

    async setDataCore(packageChange) {
        return await python.callCore("SET", JSON.stringify(packageChange))
    }

    async changeColor(new_color) {
        this.user.color = new_color
        await this.user.save()
    }

    pingPong() {
        this.logger("Test connection")
        this.send({signal: "PONG"})
    }

    async register(username) {
        this.logger("REGISTER " + username)
        this.user = await userDB.getUser({username})
        this.journalWs.addSocket(this.ws, this.user)
        this.send({signal: "REGISTER", admin: this.user.admin})
        this.broadcast(log.packageMesHello(this.user))
    }

    async get() {
        this.logger("GET")
        this.send({package: await this.getDataCore()})
    }

    async set(packageChange) {
        this.logger("SET")
        let packageWs = {package: await this.setDataCore(packageChange)}
        this.send(packageWs)
        this.send(packageWs, true)
    }

    message(message) {
        this.broadcast(log.packageMes(this.user, message))
    }

    dispatcher(packageWs) {
        let signal = packageWs.signal
        
        // Skip other signals, while ws not register
        let boolAllowSimpleSignals = signal == "REGISTER" || signal == "PING" 
        if (!boolAllowSimpleSignals && !this.user) {
            return
        }

        if (signal === "PING") this.pingPong()
        if (signal === "REGISTER") this.register(packageWs.username)
        if (signal === "GET") this.get()
        if (signal === "SET") this.set(packageWs.packageChange)
        if (signal === "MESSAGE") this.message(packageWs.message)
    }

    close() {
        this.logger("CLOSE")
        this.broadcast(log.packageMesGoodbye(this.user))
        this.journalWs.removeSocket(this.ws)
    }
}

module.exports = Socket
