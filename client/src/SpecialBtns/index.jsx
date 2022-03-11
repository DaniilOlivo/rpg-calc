import ModalWindow from "../components/ModalWindow"
import React from "react"
import menuImage from "./img/menu.png"
import "./SpecialBtns.css"

import { connect, Provider } from "react-redux"
import store from "../Redux/store"
import socket from "../Socket"

import versions from "../data/versions-logs.json"

// Абстрактный класс для кнопок использующих модальные окна
// Потому что в санном JS нет нормальной реализации миксинов
class BtnModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {modal: false, content: "..."}
    }

    onClick = (e) => {
        this.setState({modal: true})
    }

    closeModal = (e) => {
        this.setState({modal: false})
    }

    getModal() {
        let modal = null
        if (this.state.modal) {
            modal = < ModalWindow content={this.state.content} onClick={this.closeModal} />
        }

        return modal
    }
}


class BtnLog extends BtnModal {
    componentDidMount() {
        let content = []
        
        for (let [version, listChanges] of Object.entries(versions)) {
            content.push(<p key={version} className="logs__title">{version}</p>)
            let liElements = []
            for (let i = 0; i < listChanges.length; i++) {
                let elem = <li key={i}>{listChanges[i]}</li>
                liElements.push(elem)
            }
            content.push(<ul key={version + "changes"} className="logs__list-changes">{liElements}</ul>)
        }
        this.setState({content})
    }

    render() {
         return (
             <div className="logs">
                 <button className="btn-special-funcions" onClick={this.onClick}>
                    <img src={menuImage} className="log-version__img" alt="Menu"/>
                </button>
                {this.getModal()}
             </div>
         )
    }
}

// Функции разработчика
function ExitProfile(props) {
    let onClick = async (e) => {
        let response = await fetch("/auth/logout", {method: "POST"})
        if (response.ok) window.location.href = response.url
    }
    return <button className="dev-func__btn" onClick={onClick}>Выйти из профиля</button>
}

class BtnDev extends BtnModal {
    componentDidMount() {
        let content = <div className="dev-func-block">
            < ExitProfile />
        </div>
        this.setState({content: content})
    }

    render() {
        return (
            <div className="dev">
                <button className="btn-special-funcions" onClick={this.onClick}>func</button>
                {this.getModal()}
            </div>
        )
    }
}

function PickColor(props) {
    const colors = ["white", "yellow", "orange", "blue", "violet",
        "red", "black", "gray", "green", "purple",
        "lime", "crimson", "darkred", "pink", "magenta",
        "indigo", "darkgreen", "olive", "cyan", "navy",
        "wheat", "chocolate", "maroon",
    ]
    let btnsColors = []

    let count = 0

    for (let color of colors) {
        btnsColors.push(<div className="pick-color__btn" onClick={e => socket.signalSetColor(color)} key={count}>
                <div className="marker" style={{backgroundColor: color}}></div>
            </div>)
        count++
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

class BtnPickColor extends BtnModal {
    componentDidMount() {
        this.setState({content: < PickColor />})
    }

    render() {
        let marker = <div className="marker" style={{backgroundColor: this.props.color}}></div>
        return (
            <div className="color">
                 <button className="btn-special-funcions btn-special-funcions__marker" onClick={this.onClick}>{marker}</button>
                 {this.getModal()}
            </div>
        )
    }
}

// Панель кнопок
function PanelBtnsSpecial(props) {
    let btns = [
        < BtnLog key="log"/>,
        < BtnDev key="func" />
    ]

    if (props.boolUser && !props.boolAdmin) {
        let mapStateToProps = (state) => {
            return {color: state.get("char").color}
        }
        let Wrap = connect(mapStateToProps)(BtnPickColor)
        let btnColor = <Provider store={store} key="color">
            < Wrap />
        </Provider>
        btns.push(btnColor)
    }

    return (
        <div className="panel-btns-special">
            {btns}    
        </div> 
    )
}

export default PanelBtnsSpecial
