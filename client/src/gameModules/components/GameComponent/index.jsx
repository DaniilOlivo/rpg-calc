import React from "react"
import AdminEditor from "../../../Admin/AdminEditor"

const ACTIONS = {
    ADD: {
        label: "Добавить",
        key: "ADD"
    },
    EDIT: {
        label: "Изменить",
        key: "EDIT"
    },
    DEL: {
        label: "Удалить",
        key: "DEL"
    }
}

class GameComponent extends React.Component {
    constructor(props) {
        /*
        Пропсы:
        gameElement: Игровой объект на основе которого будет содзаваться схема
        schemeData: Схема для полей, которые содежит их настройки как например тип
            Если параметра нет в схеме, то он не будт отображаться в форме
        title: Название элемента, нужно для заголовков
        idElement: ID элемента, необходимый для socket API
        action: Тип действия
        close: Функция закрытия, для дополнительных действий. Необязательна
        children: Дочерний компонент, представляющий отображение игрового элемента
        */
        super(props)

        let action = ACTIONS.EDIT
        if (props.action) {
            action = ACTIONS[props.action]
        }

        this.state = {
            openListMod: false,
            openAdminEditor: false,
            action
        }
    }

    openAdminEditor = (e) => {
        this.setState({openAdminEditor: true})
    }

    closeAdminEditor = (e) => {
        // Костыль
        if (this.props.close) {
            this.props.close()
        }
        this.setState({openAdminEditor: false})
    }

    getScheme() {
        let gameElement = this.props.gameElement

        let schemeData = []
        if (gameElement) {
            for (let [parameter, value] of Object.entries(gameElement)) {
                let settings = this.props.schemeData[parameter]
                if (!settings) continue
                schemeData.push({
                    id: parameter,
                    type: settings.type,
                    label: settings.label,
                    value: value
                })
            }
        } else {
            for (let [parameter, settings] of Object.entries(this.props.schemeData))
            schemeData.push({
                id: parameter,
                type: settings.type,
                label: settings.label,
                value: settings.value
            })
        }

        return schemeData
    }

    getAdminEditor() {
        let adminEditor = null

        if (this.state.openAdminEditor) {
            adminEditor = < AdminEditor title={this.props.title}
                idElement={this.props.idElement}
                schemeData={this.getScheme()}
                action={this.state.action}
                closeEditor={this.closeAdminEditor} />
        }

        return adminEditor
    }
}

export default GameComponent
