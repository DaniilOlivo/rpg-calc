import React from "react"
import "./LogViewer.css"

class LogViewer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {logs: []}
    }

    pushLog(message) {
        this.setState((prevState) => prevState.logs.push(message))
    }

    render() {
        return (
            <div className="log-viewer">
                {this.state.logs.join('\n')}
            </div>
        )
    }
}

export default LogViewer
