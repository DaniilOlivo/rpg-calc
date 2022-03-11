import { setCharData, pushLog } from "../Redux"
import { setListChars } from "../Redux/admin"

const wsConnect = "wss://rpg-calc.herokuapp.com/ws/table"

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

    sendMessage(message) {
        this.send({signal: "MESSAGE", message})
    }

    dispatcher(data) {
        console.log(data)
        if (data.test) console.log(data.test)
        if (data.package) {
            if (data.character) setListChars(data.character, data.package)
            else setCharData(data.package)
        }
        if (data.message) pushLog(data)
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
