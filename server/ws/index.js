const express = require("express")
const ws = require("express-ws")

const callCore = require("../python_api").callCore

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
        if (validData.type === "GET") {
            let char = req.user.character
            callCore(validData.type, char, (err, results) => {
                if (err) throw err
                ws.send(results[0])
            })
        }
    })

    ws.on("close", () => {
        logger("Close")
        let index = journalWs.findIndex((item) => item.ws === ws)
        journalWs.splice(index, 1)
    })
})

module.exports = wsRouter
