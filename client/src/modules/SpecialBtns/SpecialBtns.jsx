import ModalWindow from "../../components/ModalWindow"
import React from "react"
import menuImage from "./img/menu.png"
import "./SpecialBtns.css"

import versions from "../../data/versions-logs.json"

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

    getModal() {
        let modal = null
        if (this.state.modal) {
            modal = < ModalWindow content={this.state.content} parent={this} />
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
                <button className="btn-special-funcions" onClick={this.onClick}>dev</button>
                {this.getModal()}
            </div>
        )
    }
}

// Кнопка админа
function BtnAdminPanel(props) {
    return (
        <button className="btn-special-funcions" onClick={(e) => console.log("У нас нет админки :(")}>db</button>
    )
}

// Панель кнопок
function PanelBtnsSpecial(props) {
    let btns = [< BtnLog key={0}/>]
    if (props.boolAdmin) {
        btns.push(< BtnDev key={1} />)
        btns.push(< BtnAdminPanel key={2} />)
    }

    return (
        <div className="panel-btns-special">
            {btns}    
        </div> 
    )
}

export default PanelBtnsSpecial
