const server = require("../index")
const assert = require("assert")
const wsClient = require("ws").WebSocket
const config = require("config")

describe("Веб сокет", () => {
    let ws
    it("Открытие соединения", done => {
        ws = new wsClient(`ws://${config.get("host")}:${config.get("port")}/ws/table`)
        ws.on("message", mes => {
            assert.equal(mes, "Its work!")
            done()
        })
        ws.on("open", () => ws.send(JSON.stringify({type: "test"})))
    })

    after((done) => {
        ws.close()
        server.close(done)
    })
})
