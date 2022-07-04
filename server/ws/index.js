const express = require("express")
const ws = require("express-ws")

const Journal = require("./journal")
const Socket = require("./socket")

const wsRouter = express.Router()
ws(wsRouter)

const journalWs = new Journal()

wsRouter.ws("/table", (ws, req) => {
    let socket = new Socket(ws, journalWs)
    socket.logger("CONNECT")

    ws.on("message", (data) => {
        let packageWs = JSON.parse(data)
        socket.dispatcher(packageWs)
    })

    ws.on("close", () => {
        socket.close()
    })
})

module.exports = wsRouter
