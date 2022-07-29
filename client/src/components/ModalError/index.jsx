import React from "react"
import "./ModalError.css"

class ModalError extends React.Component {
    constructor(props) {
        super(props)
        this.state = {error: null}
    }

    componentDidCatch(error) {
        console.log(error)
        this.setState({error})
    }

    render() {
        if (this.state.error) {
            return (
                <div className="error-board">
                    {this.state.error.toString()}
                </div>
            )
        }
        return this.props.children
    }
}

export default ModalError
