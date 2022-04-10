import "./CharChars.css"

import GameComponent from "../../../../components/GameComponent"

function CharChars(props) {
    let arrChars = []

    let count = 0

    for (let objChar of Object.values(props)) {
        let modValues = []
        let baseValue = "База: " + objChar.base_value
        modValues.push(baseValue)
        for (let [label, value] of Object.entries(objChar.mod_values)) {
            let strValue
            if (value > 0) strValue = "+" + value
            if (value < 0) strValue = '-' + value
            modValues.push(label + ': ' + strValue)
        }
        let descModValues = modValues.join("<br/>")

        let schemeDataChar = [
            {
                type: "INTEGER",
                label: "Значение " +  objChar.alias,
                value: objChar.value,
            },
            {
                type: "SHORT",
                label: "Описание модификатора",
                desc: `Оставте это поле пустым, если хотите напрямую изменить характеристику в force режиме.
                    Если же, вы хотите использовать модификаторной режим, то заполните это поле. Я понимаю, что легче не стало`
            }
        ]

        let settingsContextMenu = {entry: "модификатор"}

        let line = < GameComponent title={objChar.alias}
            schemeData={schemeDataChar}
            contextMenu={settingsContextMenu}
            key={count} >
                <div className="char-chars__line" >
                    <span className="char-chars__label" data-tip={objChar.desc}>{objChar.alias}</span>
                    <span className="char-chars__value" data-tip={descModValues}>{objChar.value}</span>
                </div>
            </GameComponent>
            
        arrChars.push(line)

        count++
    }

    return (
        <div className="char-chars">
            {arrChars}
            
        </div>
    )
}

export default CharChars
