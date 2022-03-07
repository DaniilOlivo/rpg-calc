import { setData } from "../Redux"
import { setListChars, updateDataChar } from "../Redux/admin"

const wsConnect = "ws://127.0.0.1:5500/ws/table"

class Socket extends WebSocket {
    constructor() {
        super(wsConnect)

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

    signalGetAll() {
        this.send({signal: "GET_ALL"})
    }

    signalRegister(user) {
        let packageWs = {
            signal: "REGISTER",
            user
        }
        this.send(packageWs)
    }

    signalSetColor(color) {
        this.send({signal: "SET_COLOR", color})
    }

    dispatcher(data) {
        if (data.test) console.log(data.test)
        if (data.package) {
            if (data.admin) setListChars(data.package)
            else if (data.update) updateDataChar(data.update, data.package)
            else setData(data.package)
        }
        if (data.signal) {
            let signal = data.signal
            if (signal === "REGISTER") {
                if (data.admin) this.signalGetAll()
                else this.signalGet()
            }
        }
    }
}

const socket = new Socket()

export default socket
