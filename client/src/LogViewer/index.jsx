import { useState } from "react"
import "./LogViewer.css"
import { Provider, connect } from "react-redux"
import store from "../Redux/store"
import socket from "../Socket"


export function LogViewerComponent(props) {
    const [inputMes, setInputMes] = useState("")

    function keyDown(e) {
        if (e.key === "Enter") {
            socket.sendMessage(inputMes)
            setInputMes("")
        }
    }

    let arrRecords = []
        
    let count = 0

    for (let record of props.log) {
        let classNameFrom = "log-viewer__from"
        let classNameMes = "log-viewer__message"
        let color = props.users.get(record.from).color
        let styleColor = {}

        if (record.type === "HELLO" || record.type === "GOODBYE") {
            classNameFrom += " log-viewer__from_system"
            classNameMes += " log-viewer__message_system"
            styleColor.color = color
        }

        if (record.type === "MESSAGE") {
            classNameFrom += " log-viewer__from_message"
        }

        arrRecords.push(<div className="log-viewer__record" key={count}>
                <span className={classNameFrom} style={{color}}>{record.from}</span>
                <span className={classNameMes} style={styleColor}>{record.message}</span>
            </div>)
        count++
    }

    return (
        <div className="log">
            <div className="log-viewer">
                {arrRecords}
            </div>
            <input type="text"
                className="log-input"
                value={inputMes}
                onChange={e => setInputMes(e.target.value)}
                onKeyDown={keyDown} />
        </div>
    )
} 

function mapStateToProps(state) {
    let log = state.get("log")
    return {
        log: log.toArray(),
        users: state.get("users"),
    }
}

let Wrap = connect(mapStateToProps)(LogViewerComponent)
let LogViewer = <Provider store={store}>< Wrap /></Provider>

export default LogViewer
