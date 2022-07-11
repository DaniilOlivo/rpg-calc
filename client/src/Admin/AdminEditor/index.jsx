import React from "react";
import "./AdminEditor.css"

import ModalForm from "../../components/ModalForm";

import TextInput from "./components/TextInput"
import TextArea from "./components/TextArea"
import IntegerInput from "./components/IntegerInput"
import SelectBox from "./components/SelectBox"
import ModElement from "./components/ModElement";

import ButtonForm from "./components/ButtonForm";

import socket from "../../Socket";

class AdminEditor extends React.Component {
    constructor(props) {
        super(props)

        this.fields = {}

        let valid = true

        for (let {id, value} of this.props.schemeData) {
            this.fields[id] = {
                value,
                valid: true, // Флаг валидности поля
                changed: false
            }
            if (!value) valid = false
        }

        this.state = {valid}
    }

    checkValid() {
        let flag = true
        for (let {value, valid} of Object.values(this.fields)) {
            if (!valid || !value) flag = false
        }

        this.setState({valid: flag})
    }

    _setValueField(id, value) {
        let field = this.fields[id]
        field.changed = true
        field.value = value
    }

    onChange = (id, valueObj) => {
        valueObj.changed = true
        this.fields[id] = valueObj
        this.checkValid()
    }

    sumbit = () => {
        let data = {}
        let parameters = {}
        for (let [id, valueObj] of Object.entries(this.fields)) {
            if (!valueObj.changed) continue
            parameters[id] = valueObj.value
        }
        // Костыль для ModSystem
        let arrId = this.props.idElement.split('.')
        if (arrId.length > 1) {
            let subData = {}
            data[arrId[0]] = subData
            subData[arrId[1]] = parameters
        } else {
            data[this.props.idElement] = parameters
        }
        data.actionSet = this.props.action.key
        console.log(data)
        socket.signalSet(data)
        this.props.closeEditor()
    }

    _getField(fieldData) {
        let Field = null
        let type = fieldData.type
        
        if (type === "SHORT") Field = TextInput
        if (type === "LONG") Field = TextArea
        if (type === "INTEGER") Field = IntegerInput
        if (type === "SELECT") Field = SelectBox
        if (type === "MOD") Field = ModElement
        if (type === "HIDE") this._setValueField(fieldData.id, fieldData.value)

        return Field
    }

    render() {
        let fields = []
        for (let fieldData of this.props.schemeData) {
            let Field = this._getField(fieldData)    

            if (Field) {
                fields.push(
                    < Field {...fieldData} onChange={this.onChange} rootId={this.props.idElement} key={fieldData.id} />
                )
            }
        }

        let titleWindow = [this.props.action.label, this.props.title].join(' ')

        return (
            <ModalForm titleWindow={titleWindow} close={this.props.closeEditor}>
                { fields }
                <ButtonForm disabled={!this.state.valid} onClick={this.sumbit}>Отправить</ButtonForm>
            </ModalForm>
        )
    }
}

export default AdminEditor
