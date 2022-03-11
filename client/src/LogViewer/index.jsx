import React from "react"
import "./LogViewer.css"
import { Provider, connect } from "react-redux"
import store from "../Redux/store"
import socket from "../Socket"

class LogViewerComponent extends React.Component {
    constructor(props) {
        super(props)
        this.refInput = React.createRef()
    }

    sendMessage = (e) => {
        if (e.key === "Enter") {
            let mes = this.refInput.current.value
            socket.sendMessage(mes)
        }
    }

    render() {
        let arrRecords = []
        let color = this.props.color
        
        for (let record of this.props.log) {
            let classNameFrom = "log-viewer__from"
            let classNameMes = "log-viewer__message"

            if (record.type === "HELLO" || record.type === "GOODBYE") {
                classNameFrom += " log-viewer__from_system"
                classNameMes += " log-viewer__message_system"
            }

            if (record.type === "MESSAGE") {
                classNameFrom += " log-viewer__from_message"
            }

            arrRecords.push(<div className="log-viewer__record">
                    <span className={classNameFrom} style={{color}}>{record.from}</span>
                    <span className={classNameMes}>{record.message}</span>
                </div>)
        }

        return (
            <div className="log">
                <div className="log-viewer">
                    {arrRecords}
                </div>
                <input type="text" className="log-input" ref={this.refInput} onKeyDown={this.sendMessage} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    let color = state.get("char").color
    let log = state.get("log")
    return {color, log: log.toArray()}
}

let Wrap = connect(mapStateToProps)(LogViewerComponent)
let LogViewer = <Provider store={store}>< Wrap /></Provider>

export default LogViewer
