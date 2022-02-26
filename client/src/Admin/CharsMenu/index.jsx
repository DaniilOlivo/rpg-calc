import React from "react";
import { Provider, connect } from "react-redux"
import adminStore from "../../Redux/admin/store";
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
    constructor(props) {
        super(props)
        this.state = {currentCharIndex: 0}
    }

    render() {
        setChar(this.props.chars[this.state.currentCharIndex].nameChar)
        let arrBtns = []
        for (let i = 0; i < this.props.chars.length; i++) {
            let char = this.props.chars[i]
            let selected = i == this.state.currentCharIndex
            arrBtns.push(< MenuBtn 
                title={char.nameChar}
                colorMarker={char.color}
                selected={selected}
                key={i}
                onClick={(e) => this.setState({currentCharIndex: i})} />)
        }

        return (
            <div className="chars-menu">
                {arrBtns}
            </div>
        )
    }
}

function mapStateToProps(state) {
    let mapObj = {chars: []}
    state.forEach((packageChar, nameChar) => {
        mapObj.chars.push({
            nameChar,
            color: packageChar.color
        })
    })
    return mapObj
}

let Wrap = connect(mapStateToProps)(CharsMenu)
let CharsMenuView = <Provider store={adminStore} >< Wrap /></Provider>

export default CharsMenuView
