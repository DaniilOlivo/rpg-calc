import React from "react";

import "./Scale.css"
import "./ScaleSolid.css"

class ScaleSolid extends React.Component {
    render() {
        let {title, currentValue, maxValue} = this.props
        let label = `${title}: ${currentValue}/${maxValue}`
        let className = "scale_solid__fill " + this.props.classNameColor

        let currentWidthScale = currentValue / maxValue * 100 + "%"

        return (
            <div className="scale scale_solid">
                <div className={className} style={{"width": currentWidthScale}}></div>
                <span className="scale_solid__label">{label}</span>
            </div>    
        )
    }
}

export default ScaleSolid
