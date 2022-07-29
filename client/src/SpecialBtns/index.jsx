import useModal from "../components/ModalWindow"
import React from "react"
import menuImage from "./img/menu.png"
import "./SpecialBtns.css"

import { connect, Provider } from "react-redux"
import store from "../Redux/store"
import socket from "../Socket"

import versions from "../data/versions-logs.json"
import colorsMarkers from "../data/colors-markers.json"


function BtnLog(props) {
    let listVersions = []
    for (let [versionNumber, listChanges] of Object.entries(versions)) {
        listVersions.push(<p key={versionNumber} className="logs__title">{versionNumber}</p>)

        let liElements = []
        for (let i = 0; i < listChanges.length; i++) {
            let elem = <li key={i}>{listChanges[i]}</li>
            liElements.push(elem)
        }

        listVersions.push(<ul key={versionNumber + "changes"} className="logs__list-changes">{liElements}</ul>)
    }

    const [modal, openModal] = useModal(listVersions)

    return (
        <div className="logs">
            <button className="btn-special-funcions" onClick={openModal}>
                <img src={menuImage} className="log-version__img" alt="Menu"/>
            </button>

            {modal}
        </div>
    )
}


function BtnExitProfile(props) {
    let onClick = async (e) => {
        let response = await fetch("/auth/logout", {method: "POST"})
        if (response.ok) window.location.href = response.url
    }
    return <button className="dev-func__btn" onClick={onClick}>Выйти из профиля</button>
}

function BtnDev(props) {
    const [modal, openModal] = useModal(
        <div className="dev-func-block">
            < BtnExitProfile />
        </div>
    )

    return (
        <div className="dev">
            <button className="btn-special-funcions" onClick={openModal}>func</button>

            {modal}
        </div>
    )
}

function PickColor(props) {
    // currentColor - текущий цвет пользователя
    let btnsColors = []

    for (let color of colorsMarkers) {
        let classNameBtn = "pick-color__btn"
        if (props.currentColor === color) classNameBtn += " pick-color__btn_selected"
        btnsColors.push(
            <div className={classNameBtn} onClick={e => socket.signalSetColor(color)} key={color}>
                <div className="marker" style={{backgroundColor: color}}></div>
            </div>
        )
    }

    return (
        <div className="pick-color">
            <p className="pick-color__title">Выбери свой цвет!</p>
            <div className="pick-color__panel">
                {btnsColors}
            </div>
        </div>
    )
}

export function BtnPickColor(props) {
    // color - текущий цвет игрока, для отображения его на кнопке
    const [modal, openModal] = useModal(< PickColor currentColor={props.color} />)

    let marker = <div className="marker" style={{backgroundColor: props.color}}></div>

    return (
        <div className="color">
            <button className="btn-special-funcions btn-special-funcions__marker" onClick={openModal}>{marker}</button>

            {modal}
        </div>
    )
}


function PanelBtnsSpecial(props) {
    let btns = [
        < BtnLog key="log"/>,
        < BtnDev key="func" />
    ]

    if (props.user) {
        btns.push(< BtnPickColor color={props.color} key="color" />   )
    }

    return (
        <div className="panel-btns-special">
            {btns}
        </div> 
    )
}

function mapStateToProps(state) {
    let user = state.get("user")
    
    let color = null
    let username = user.username
    let userBool = Boolean(username)

    if (userBool) {
        color = user.color
    }

    return {
        color,
        user: userBool,
    }
}

let WrapPanelBtnsSpecial = connect(mapStateToProps)(PanelBtnsSpecial)
let ReduxPanelBtnsSpecial = <Provider store={store} key="panel-btns" >< WrapPanelBtnsSpecial /></Provider>

export default ReduxPanelBtnsSpecial
