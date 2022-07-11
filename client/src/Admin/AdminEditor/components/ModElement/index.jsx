import React from "react"
import "./ModElement.css"

import LabelInput from "../LabelComponent"
import ButtonForm from "../ButtonForm"

import ModGC from "../../../../gameModules/components/ModGC"

class ModElement extends React.Component {
    render() {
        let schemeData = {
            [this.props.id]: {
                type: "MOD",
                label: this.props.label
            }
        }
        let objValue = this.props.value
        return (
            <LabelInput className="mod-element" label={this.props.label} desc={this.props.desc}>
                <span className="mod-element__value">{objValue.value}</span>
                <ModGC 
                    idElement={this.props.rootId}
                    gameElement={{[this.props.id]: objValue}}
                    schemeData={schemeData}
                    title={this.props.label}>
                    <ButtonForm className="button-form_small">Изменить</ButtonForm>
                </ModGC>
            </LabelInput>    
        )
    }
}

export default ModElement
