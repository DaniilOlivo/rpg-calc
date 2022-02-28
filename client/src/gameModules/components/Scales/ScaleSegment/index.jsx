import React from "react";

import "../Scale.css"
import "./ScaleSegment.css"

class ScaleSegment extends React.Component {
    render() {
        let {currentValue, maxValue} = this.props
        let arrSegments = []

        let widthSegment = currentValue / maxValue / currentValue * 100 + "%"
        let className = "scale_segment__fill " + this.props.classNameColor

        for (let i = 0; i < currentValue; i++) {
            arrSegments.push(<div key={i} className={className} style={{"width": widthSegment}}></div>)
        }

        return (
            <div className="scale scale_segment">
                {arrSegments}
            </div>
        )
    }
}

export default ScaleSegment
