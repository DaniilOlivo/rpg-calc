import {dispatchStore, setController} from "../Redux"
import * as redux from "../Redux/actions"

const wsConnect = "ws://127.0.0.1:5500/ws/table"

const throwErrorUnvalidArg = (arg) => {
    if (!arg) throw new Error("Socket > API: Некорректный аргумент " + arg)
}

class Socket extends WebSocket {
    constructor() {
        super(wsConnect)

        this.onmessage = (e) => {
            let data = JSON.parse(e.data)
            this.dispatcher(data)
        }

        this.onclose = (e) => {
            console.log("Сокет соединение закрыто")
        }
    }

    send(data) {
        super.send(JSON.stringify(data))
    }

    signalGet() {
        this.send({signal: "GET"})
    }

    signalRegister(username) { 
        throwErrorUnvalidArg(username)
        let packageWs = {
            signal: "REGISTER",
            username
        }
        this.send(packageWs)
    }

    signalSet(packageChange) {
        throwErrorUnvalidArg(packageChange)
        this.send({signal: "SET", packageChange})
    }

    signalSetColor(color) {
        throwErrorUnvalidArg(color)
        this.send({signal: "CHANGE_COLOR", color})
    }

    sendMessage(message) {
        throwErrorUnvalidArg(message)
        this.send({signal: "MESSAGE", message})
    }

    dispatcher(data) {
        if (data.test) console.log(data.test)
        if (data.package) setController(data.package)
        if (data.message) dispatchStore(redux.pushLog(data))
        if (data.signal) {
            let signal = data.signal
            if (signal === "USER_DATA") {
                let {users, user} = data
                dispatchStore(redux.setUsers(users))
                dispatchStore(redux.setUser(user))
                this.signalGet()
            }
        }
    }
}

const socket = new Socket()

export default socket
