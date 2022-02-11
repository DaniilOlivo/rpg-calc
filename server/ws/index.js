const express = require("express")
const ws = require("express-ws")

const user = require("../db").user
const callCore = require("../python_api").callCore

const wsRouter = express.Router()
ws(wsRouter)

const journalWs = []

function logger(data) {
    console.log("WS | " + data)
}

wsRouter.ws("/table", (ws, req) => {
    logger("Connect")

    ws.on("message", (data) => {
        let validData = JSON.parse(data)
        if (validData.type === "test") ws.send("Its work!")
        if (validData.type === "REGISTER") {
            logger("REGISTER, " + validData.user)
            user.getUser({username: validData.user})
                .then((user) => {
                    console.log("Пользователь " + user)
                    journalWs.push({
                        ws,
                        user
                    })
                    ws.send(JSON.stringify({type: "SuccesRegister"}))
                })
        }
        if (validData.type === "GET") {
            logger("GET")
            let char = journalWs.find(user => user.ws === ws).user.character
            callCore(validData.type, char, (err, results) => {
                if (err) throw err
                console.log(results[0])
                let package = {
                    initFlag: true,
                    package: results[0]
                }
                ws.send(JSON.stringify(package))
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
