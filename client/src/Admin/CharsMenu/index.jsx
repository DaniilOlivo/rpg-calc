import React from "react";
import { Provider, connect } from "react-redux"

import { setCharacter } from "../../Redux/actions"
import store from "../../Redux/store";

import { getGroupObjects } from "../../GameController"

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

export function CharsMenu(props) {
    let arrBtns = []

    for (let character of props.characters) {
        let nameChar = character.name
        let user = props.users.find((dataUser) => dataUser.character === nameChar)
        if (!user) throw new Error("Admin > Not found user")

        let selected = props.currentCharacter.name === nameChar

        arrBtns.push(< MenuBtn 
            title={nameChar}
            colorMarker={user.color}
            selected={selected}
            key={nameChar}
            onClick={(e) => props.setCharacter(character)}
        />)
    }

    return (
        <div className="chars-menu">
            {arrBtns}
        </div>
    )
}

export function mapStateToProps(state) {
    let characters = getGroupObjects(state, "player")
    let currentCharacter = state.get("character")
    let users = state.get("users")

    return {
        characters,
        currentCharacter,
        users
    }
}

let Wrap = connect(mapStateToProps, {setCharacter})(CharsMenu)
let CharsMenuView = <Provider store={store} >< Wrap /></Provider>

export default CharsMenuView
