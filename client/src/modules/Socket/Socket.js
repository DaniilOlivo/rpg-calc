
const wsConnect = "ws://127.0.0.1:5500/ws/table"

class Socket extends WebSocket {
    constructor(user, handlers) {
        super(wsConnect)
        this.user = user
        this.handlers = handlers

        this.onopen = (e) => {
            this.signalRegister()
        }

        this.onmessage = (e) => {
            let data = JSON.parse(e.data)
            this.dispatcher(data)
        }

        this.onclose = (e) => {
            console.log("Сокет соединение прервано")
        }
    }

    send(data) {
        super.send(JSON.stringify(data))
    }

    signalGet() {
        this.send({signal: "GET"})
    }

    signalRegister() {
        let packageWs = {
            signal: "REGISTER",
            user: this.user
        }
        this.send(packageWs)
    }

    dispatcher(data) {
        if (data.test) console.log(data.test)
        if (data.logChat) this.handlers.logChat(data.logChat)
        if (data.package) this.handlers.package(data.package)
        if (data.signal) {
            let signal = data.signal
            if (signal === "REGISTER") this.signalGet()
        }
    }
}

export default Socket
