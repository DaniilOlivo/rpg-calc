import React from "react";
import TabsControl from "../Tabs/TabsControl";
import LogViewer from "../LogViewer/LogViewer";

class MainApp extends React.Component {
    constructor(props) {
        super(props)

        this.refLogChat = React.createRef()

        this.socket = new WebSocket(
            "ws://"
            + window.location.host
            + "/ws/table"
        )

        this.socket.onmessage = (e) => {
            let data = JSON.parse(e.data);
            if (data.test) {
                console.log(data.test)
            } else if (data.logChat) {
                this.refLogChat.current.pushLog(data.logChat)
            }
        }
    
        this.socket.onclose = () => {
            console.log("Что-то пошло не так")
        }

        this.props.next()
    }

    render() {
        return (
            <div className="table">
                < LogViewer ref={this.refLogChat} />
                < TabsControl />
            </div>
        )
    }
}

export default MainApp
