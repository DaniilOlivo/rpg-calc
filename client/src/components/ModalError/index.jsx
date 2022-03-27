import React from "react"

import ModalWindow from "../ModalWindow"
import "./ModalError.css"

class ModalError extends React.Component {
    constructor(props) {
        super(props)
        this.state = {error: null}
    }

    componentDidCatch(error) {
        this.setState({error})
    }

    render() {
        if (this.state.error) {
            return < ModalWindow content={this.state.error.toString()} />
        }
        return this.props.children
    }
}

export default ModalError
