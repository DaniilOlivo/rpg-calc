const server = require("../index")

const assert = require("assert")

const wsClient = require("ws").WebSocket
const config = require("config")

describe("Веб сокет", () => {
    it("Открытие соединения", (done) => {
        let ws = new wsClient(`ws://${config.get("host")}:${config.get("port")}/ws/table`)
        ws.on("open", () => ws.send(JSON.stringify({signal: "PING"})))
        ws.on("message", mes => {
            let res = JSON.parse(mes)
            assert.equal(res.signal, "PONG")
            ws.close()
            done()
        })
    })

    after((done) => server.close(done))
})
