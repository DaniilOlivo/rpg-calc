import React from "react";
import "./Block.css"

class Block extends React.Component {
    render() {
        return (
            <div className="block" style={{"gridArea": this.props.idArea}}>
                <h3 className="block__title">{this.props.title}</h3>
                {this.props.children}
            </div>
        )
    }
}

export default Block
