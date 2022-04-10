import React from "react"

import LabelInput from "../LabelComponent"
import "./SelectBox.css"

class SelectBox extends React.Component {
    constructor(props) {
        super(props)
        let value = props.value
        if (!value) {
            value = props.options[0]
            this.props.onChange(this.props.label, {value, valid: true})
        }
        this.state = {value: value}
    }
    
    handler = (value) => {
        this.setState({value})
        this.props.onChange(this.props.id, {value, valid: true})
    }

    render() {
        let options = []
        for (let optionValue of this.props.options) {
            options.push(<option value={optionValue} key={optionValue} className="select-box__option">
                    {optionValue}
                </option>)
        }
        return (
            <LabelInput className="select-box" label={this.props.label} desc={this.props.desc} >
                <select className="admin-editor__input select-box__field"
                    value={this.state.value}
                    onChange={e => this.handler(e.target.value)}>
                    {options}
                </select>
            </LabelInput>
        )
    }
}

export default SelectBox
