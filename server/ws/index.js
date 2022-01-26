const express = require("express")
const ws = require("express-ws")

const wsRouter = express.Router()
ws(wsRouter)

const journalWs = []

function logger(data) {
    console.log("WS | " + data)
}

wsRouter.ws("/table", (ws, req) => {
    logger("Connect")

    journalWs.push({
        ws,
        user: req.user
    })

    ws.on("message", (data) => {
        let validData = JSON.parse(data)
        if (validData.type === "test") ws.send("Its work!")
    })

    ws.on("close", () => {
        logger("Close")
        let index = journalWs.findIndex((item) => item.ws === ws)
        journalWs.splice(index, 1)
    })
})

module.exports = wsRouter
