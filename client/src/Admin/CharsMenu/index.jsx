import React from "react";
import { Provider, connect } from "react-redux"
import adminStore from "../../Redux/admin/store";
import { setCurrent } from "../../Redux/admin/actions";
import { setChar } from "../../Redux/admin"

import "./CharsMenu.css"

function MenuBtn(props) {
    let className = "chars-menu__btn"
    if (props.selected) {
        className += " chars-menu__btn_selected"
    }
    return (
        <div className={className} onClick={props.onClick}>
            <div className="chars-menu__marker" style={{backgroundColor: props.colorMarker}}></div>
            <p>{props.title}</p>
        </div>
    )
}

class CharsMenu extends React.Component {
    onClick = (char) => {
        this.props.setCurrent(char)
        setChar()
    } 

    render() {
        let currentChar = this.props.currentChar
        let arrBtns = []
        for (let i = 0; i < this.props.chars.length; i++) {
            let char = this.props.chars[i]
            let selected = char.packageChar === currentChar
            arrBtns.push(< MenuBtn 
                title={char.nameChar}
                colorMarker={char.color}
                selected={selected}
                key={i}
                onClick={(e) => this.onClick(char.packageChar)} />)
        }

        return (
            <div className="chars-menu">
                {arrBtns}
            </div>
        )
    }
}

function mapStateToProps(state) {
    let mapProps = {
        "chars": [],
        "currentChar": state.get("currentChar")
    }
    let chars = state.get("chars")
    for (let [nameChar, packageChar] of Object.entries(chars)) {
        mapProps.chars.push({
            nameChar,
            color: packageChar.color,
            packageChar
        })
    }

    return mapProps
}

let Wrap = connect(mapStateToProps, {setCurrent})(CharsMenu)
let CharsMenuView = <Provider store={adminStore} >< Wrap /></Provider>

export default CharsMenuView
