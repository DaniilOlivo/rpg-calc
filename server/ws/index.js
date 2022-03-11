const express = require("express")
const ws = require("express-ws")

const Journal = require("./journal")
const Socket = require("./socket")

const wsRouter = express.Router()
ws(wsRouter)

const journalWs = new Journal()

wsRouter.ws("/table", (ws, req) => {
    let socket = new Socket(ws, journalWs)
    Socket.logger("Connect")
    
    let liveConnect = true

    let pulseTimer = setInterval(() => {
        ws.ping()
        liveConnect = false
        setTimeout(() => {
            if (!liveConnect) {
                Socket.logger("Client died")
                clearInterval(pulseTimer)
                ws.close()
            }
        }, 30*1000)
    }, 40 * 1000)

    ws.on("pong", () => liveConnect = true)

    ws.on("message", (data) => {
        let package = JSON.parse(data)
        socket.dispatcher(package)
    })

    ws.on("close", () => {
        socket.close()
    })
})

module.exports = wsRouter
