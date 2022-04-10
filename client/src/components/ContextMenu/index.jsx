import React from "react"
import "./ContextMenu.css"

function ContextMenu(props) {
    let varaintsComponents = []

    for (let variantObj of props.variants) {
        let handler = (e) => {
            variantObj.handler()
            props.close(e)
        }

        varaintsComponents.push(
            <div className="context-menu__variant" onClick={handler} key={variantObj.title}>
                {variantObj.title}
            </div>
        )
    }

    return (
        <div className="context-menu"
        style={{left: props.xPos, top: props.yPos}}
        onMouseLeave={e => props.close(e)}>
            {varaintsComponents}
        </div>
    )
}

export default ContextMenu
