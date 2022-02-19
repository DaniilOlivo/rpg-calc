const express = require("express")
const ws = require("express-ws")

const Journal = require("./journal")
const Socket = require("./socket")
const callCore = require("../python_api").callCore

const wsRouter = express.Router()
ws(wsRouter)

const journalWs = new Journal()

wsRouter.ws("/table", (ws, req) => {
    let socket = new Socket(ws, journalWs)
    Socket.logger("Connect")

    ws.on("message", (data) => {
        let package = JSON.parse(data)
        socket.dispatcher(package)
    })

    ws.on("close", () => {
        Socket.logger("Close")
        journalWs.removeSocket(ws)
    })
})

module.exports = wsRouter
