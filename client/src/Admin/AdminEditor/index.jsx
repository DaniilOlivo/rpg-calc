import React from "react";
import "./AdminEditor.css"

import TextInput from "./components/TextInput"
import TextArea from "./components/TextArea"
import IntegerInput from "./components/IntegerInput"
import SelectBox from "./components/SelectBox"

import socket from "../../Socket";

function ButtonSumbit(props) {
    return (<button className="button-sumbit" onClick={props.onClick} disabled={props.disabled}>
                {props.children}
            </button>)
}

class AdminEditor extends React.Component {
    constructor(props) {
        super(props)

        this.fieldsValues = {}

        let valid = true

        for (let {id, value} of this.props.schemeData) {
            this.fieldsValues[id] = {
                value,
                valid: true,
            }
            if (!value) valid = false
        }

        this.state = {valid}
    }

    onChange = (id, valueObj) => {
        this.fieldsValues[id] = valueObj

        let flag = true
        for (let {value, valid} of Object.values(this.fieldsValues)) {
            if (!valid || !value) flag = false
        }

        this.setState({valid: flag})
    }

    sumbit = () => {
        let data = {}

        let decomposeId = (id, obj, value) => {
            let elementsId = id.split('.')

            if (elementsId.length === 1) {
                obj[id] = value
            } else {
                let stepId = elementsId[0]
                let stepObj = obj[stepId]
                if (!stepObj) {
                    stepObj = {}
                    obj[stepId] = stepObj
                }
                let newId = elementsId.splice(1).join('.')
                decomposeId(newId, stepObj, value)
            }
        }

        for (let [id, valueObj] of Object.entries(this.fieldsValues)) {
            let {value} = valueObj
            decomposeId(id, data, value)
        }
        
        data.actionSet = this.props.action.key
        socket.signalSet(data)
        this.props.closeEditor()
    }

    render() {
        let fields = []
        for (let fieldData of this.props.schemeData) {
            let Field

            let type = fieldData.type
            if (type === "SHORT") Field = TextInput
            if (type === "LONG") Field = TextArea
            if (type === "INTEGER") Field = IntegerInput
            if (type === "SELECT") Field = SelectBox

            fields.push(
                < Field {...fieldData} onChange={this.onChange} key={fieldData.id} />
            )
        }

        let titleWindow = [this.props.action.label, this.props.title].join(' ')

        return (
            <div className="admin-editor">
                <div className="admin-editor__bg" onClick={this.props.closeEditor} >
                    <div className="admin-editor__window">
                        <h3 className="admin-editor__title">{titleWindow}</h3>
                        <div className="admin-editor__form">
                            { fields }
                            <ButtonSumbit disabled={!this.state.valid} onClick={this.sumbit}>Отправить</ButtonSumbit>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminEditor
