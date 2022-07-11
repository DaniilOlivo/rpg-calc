import "./CharChars.css"

import ModGC from "../../../../components/ModGC"
import GameComponent from "../../../../components/GameComponent"

function getTipText(modSystem) {
    let modValues = []
    let baseValue = "База: " + modSystem.base
    modValues.push(baseValue)
    for (let [label, value] of Object.entries(modSystem.mod_values)) {
        let strValue
        if (value > 0) strValue = "+" + value
        if (value < 0) strValue = '-' + value
        modValues.push(label + ': ' + strValue)
    }
    let descModValues = modValues.join("<br/>")
    return descModValues
}

function CharChars(props) {
    let arrChars = []

    for (let [id, objChar] of Object.entries(props)) {
        let tipText = getTipText(objChar.value)

        let schemeDataChar = {
            value: {
                type: "MOD",
                label: "Значение " + objChar.alias
            }
        }

        let value = objChar.value.value

        arrChars.push(
            <ModGC
                idElement={id}
                gameElement={objChar}
                schemeData={schemeDataChar}
                title={objChar.alias}
                key={id}>
                <div className="char-chars__line">
                    <span className="char-chars__label" data-tip={objChar.desc}>{objChar.alias}</span>
                    <span className="char-chars__value" data-tip={tipText}>{value}</span>
                </div>
            </ModGC>
        )
    }

    return (
        <div className="char-chars">
            {arrChars}
        </div>
    )
}

export default CharChars
