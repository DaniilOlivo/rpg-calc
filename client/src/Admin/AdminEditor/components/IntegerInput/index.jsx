import React from "react"
import "./IntegerInput.css"

import LabelInput from "../LabelComponent"

import { isNumber } from "../../../../utils/funcTypeData"

class IntegerInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {value: ""}
    }

    getDelta(value) {
        if (value.startsWith('+') || value.startsWith('-')) {
            return value.substring(1, value.length)
        }
    }

    typeValidate(value) {
        let validValue = false
        if (isNumber(this.getDelta(value)) || isNumber(value)) validValue = true
        return validValue
    }

    logicValidate(value) {
        let valid = true
        if (this.getDelta(value) === '') valid = false
        return valid
    }

    handler = (value) => {
        let typeValid = this.typeValidate(value)
        let logicValid = this.logicValidate(value)
        
        if (typeValid) {
            this.setState({value})
            let sendValue = value
            if (this.getDelta(value)) {
                if (this.props.value) {
                    sendValue = parseInt(this.props.value) + parseInt(value)
                } else {
                    sendValue = parseInt(value)
                }
            }
            this.props.onChange(this.props.id, {value: sendValue, valid: logicValid})
        } 
    }

    btnClick = (e, sign) => {
        let increment = 1
        if (e.ctrlKey) increment = 10
        let initValue = this.props.value ?? 0
        let lastValue = (this.state.value === '') ? initValue : this.state.value
        let value = parseInt(lastValue) + parseInt(sign + increment)
        this.handler(String(value))
    }

    onKeyDown = (e) => {
        if (e.key === "ArrowLeft") this.btnClick(e, "-")
        if (e.key === "ArrowRight") this.btnClick(e, "+")
    }

    render() {
        return (
            <LabelInput className="integer-input" label={this.props.label} desc={this.props.desc} onKeyDown={this.onKeyDown} >
                <input type="button" className="integer-input__btn integer-input__btn_left" value="<"
                    onClick={e => this.btnClick(e, '-')} />
                <input type="text"
                    className="admin-editor__input integer-input__field"
                    placeholder={this.props.value}
                    value={this.state.value}
                    onChange={e => this.handler(e.target.value)}
                    ref={this.props.refInput} />
                <input type="button" className="integer-input__btn integer-input__btn_right" value=">"
                    onClick={e => this.btnClick(e, '+')} />
            </LabelInput>
        )
    }
}

export default IntegerInput
