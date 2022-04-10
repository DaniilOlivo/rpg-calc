import React from "react"
import AdminEditor from "../../../Admin/AdminEditor"
import ContextMenu from "../../../components/ContextMenu"

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

let emptyVariant = () => {
    throw new Error("Опция пуста, и не имеет обработчика")
}

const structMenu = [
    {
        title: "Добавить",
        action: ACTIONS.ADD,
        handler: emptyVariant
    },
    {
        title: "Изменить",
        action: ACTIONS.EDIT,
        handler: emptyVariant
    },
    {
        title: "Удалить",
        action: ACTIONS.DEL,
        handler: emptyVariant
    }
]

class GameComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            openContextMenu: false,
            openAdminEditor: false,
            action: null
        }

        this.pos = {
            x: 0, y: 0
        }

        this.structMenu = []
        
        for (let variantObj of structMenu) {
            let copyVariantObj = {}
            Object.assign(copyVariantObj, variantObj)
            this.structMenu.push(copyVariantObj)

            if (props.contextMenu) {
                let entryMenu = props.contextMenu.entry
                if (entryMenu) {
                    copyVariantObj.title += " " + entryMenu
                }
            }

            copyVariantObj.handler = (e) => this.openAdminEditor(e, copyVariantObj.action)
        }
    }

    openContextMenu = (e) => {
        e.preventDefault()
        this.pos.x = e.clientX
        this.pos.y = e.clientY
        this.setState({openContextMenu: true})
    }

    closeContextMenu = (e) => {
        this.setState({openContextMenu: false})
    }

    openAdminEditor = (e, action=ACTIONS.EDIT) => {
        this.setState({openAdminEditor: true, action})
    }

    closeAdminEditor = (e) => {
        if (!e || e.target === e.currentTarget) {
            this.setState({openAdminEditor: false, action: null})
        }
    }

    render() {
        let adminEditor = null

        if (this.state.openAdminEditor) {
            adminEditor = < AdminEditor title={this.props.title}
                schemeData={this.props.schemeData}
                action={this.state.action}
                closeEditor={this.closeAdminEditor} />
        }

        let contextMenu = null
        if (this.state.openContextMenu) {
            contextMenu = < ContextMenu 
                variants={this.structMenu}
                close={this.closeContextMenu}
                xPos={this.pos.x} yPos={this.pos.y} />
        }

        let adminEditorCall = null
        let contextMenuCall = null

        let styleGameComponentContainer

        if (this.props.contextMenu) {
            contextMenuCall = this.openContextMenu
        } else {
            styleGameComponentContainer = {cursor: "pointer"}
            adminEditorCall = this.openAdminEditor
        }

        return (
            <div className="game-component">
                <div className="game-component__container"
                    style={styleGameComponentContainer}
                    onClick={adminEditorCall}
                    onContextMenu={contextMenuCall}>
                    {this.props.children}
                </div>
                <div className="admin-editor__container">
                    {adminEditor}
                </div>
                <div className="context-menu__container">
                    {contextMenu}
                </div> 
            </div>
        )
    }
}

export default GameComponent
