import ModalForm from "../../components/ModalForm"
import "./ModList.css"

import socket from "../../Socket"

import ElementGC from "../../gameModules/components/ElementGC"

import addImage from "./img/add.png"
import delImage from "./img/close.png"

const schemeData = {
    label: {
        type: "SHORT",
        label: "Описание"
    },
    value: {
        type: "INTEGER",
        label: "Значение"
    }
}

const altSchemeData = {
    label: {
        type: "HIDE"
    },
    newLabel: {
        type: "SHORT",
        label: "Описание"
    },
    value: {
        type: "INTEGER",
        label: "Значение"
    }
}

function ModLabel(props) {
    let className = "mod-label__value"
    let value = props.value
    if (props.colorify) {
        if (value > 0) {
            value = '+' + value
            className += " mod-label__value_positive"
        } else if (value < 0) {
            className += " mod-label__value_negative"
        }
    }

    let delBtn = null
    if (!props.readonly) {
        delBtn = <img
            src={delImage}
            alt="Крестик"
            className="mod-list__btn mod-label__del"
            onClick={e => props.onClick(props.label)} />
    }

    return (
        <div className="mod-label">
            <span className="mod-label__label">{props.label}</span>
            <span className={className}>{value}</span>
            {delBtn}
        </div>
    )
}

function ModList(props) {
    let modComponents = []
    let modSystem = props.modSystem

    let idElement = [props.idElement, "value"].join('.')

    let titleWindow = ["Модификаторы", props.title].join(' ')
    let titleLabel = ["модификатор", props.title].join(' ')

    let actionDel = (label) => {
        props.close()
        let data = {
            actionSet: "DEL",
            [props.idElement]: {
                value: {label}
            }
        }
        socket.signalSet(data)
    }
    let label = "База"
    modComponents.push(< ModLabel label={label} value={modSystem.base} readonly={true} key={label} />)
    for (let labelMod of Object.keys(modSystem.mod_values)) {
        let settings = modSystem.mod_settings[labelMod]
        
        let valueMod = modSystem.mod_values[labelMod]

        let modLabel = <ModLabel
            label={labelMod}
            value={valueMod}
            readonly={settings.readonly}
            onClick={actionDel}
            colorify={true}
            key={labelMod} />

        if (settings.readonly) {
            modComponents.push(modLabel)
        } else {
            
            modComponents.push(
                <ElementGC
                    idElement={idElement}
                    gameElement={{label: labelMod, newLabel: labelMod, value: valueMod}}
                    schemeData={altSchemeData}
                    action="EDIT"
                    close={props.close}
                    title={titleLabel}
                    key={labelMod}>
                    {modLabel}
                </ElementGC>
            )
        }
    }

    return (
        <ModalForm titleWindow={titleWindow} type="list" close={props.close}>
            <div className="mod-list__total">Итого:
                <span className="mod-list__total_value">{modSystem.value}</span>    
            </div>
            {modComponents}
            <div className="mod-list__panel-control">
                <ElementGC
                    idElement={idElement}
                    schemeData={schemeData}
                    action="ADD"
                    close={props.close}
                    title={titleLabel}>
                    <img src={addImage} alt="Добавление" className="mod-list__btn mod-list__add" />
                </ElementGC>
            </div>
        </ModalForm>
    )
}

export default ModList
