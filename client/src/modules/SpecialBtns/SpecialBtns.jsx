import ModalWindow from "../../components/ModalWindow"
import React from "react"
import menuImage from "./img/menu.png"
import "./SpecialBtns.css"

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
        this.setState({content: "Версии"})
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
    let onClick = (e) => console.log("Типа вышли из профиля")
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
