import "./CharParam.css"

import ScaleSolid from "../../../../components/Scales/ScaleSolid"
import ScaleSegment from "../../../../components/Scales/ScaleSegment"

import EditableComponent from "../../../../components/EditableComponent"
import GameComponent from "../../../../components/GameComponent"

function CharParam(props) {
    let fields = [
        {id: "current", label: "Текущее значение"},
        {id: "max", label: "Максимальное значение"}
    ]

    let paramsData = [
        {id: "hp", title: "Здоровье"},
        {id: "sp", title: "Выносливость"},
        {id: "mp", title: "Мана"},
    ]

    let paramsComponents = []

    for (let paramObj of paramsData) {
        let id = paramObj.id
        let schemeData = []
        for (let fieldObj of fields) {
            schemeData.push({
                id: [id, fieldObj.id].join("."),
                type: "INTEGER",
                label: [fieldObj.label, id].join(' '),
                value: props[id][fieldObj.id]
            })
        }

        paramsComponents.push(
            <GameComponent title={paramObj.title} schemeData={schemeData} key={id}>
                < ScaleSolid
                    title={id}
                    currentValue={props[id].current}
                    maxValue={props[id].max}
                    classNameColor={`scale_solid__fill_${id}`} />
            </GameComponent>
        )
    }

    let needsData = [
        {id: "hunger", title: "Голод", label: "Голод", labelCase: "голода", color: "orange"},
        {id: "fatigue", title: "Усталость", label: "Усталость", labelCase: "усталости", color: "lime"}
    ]

    let needsComponents = []

    for (let needObj of needsData) {
        let schemeData = []
        for (let fieldObj of fields) {
            schemeData.push({
                id: [needObj.id, fieldObj.id].join('.'),
                type: "INTEGER",
                label: [fieldObj.label, needObj.labelCase].join(' '),
                value: props[needObj.id][fieldObj.id]
            })
        }

        needsComponents.push(<span key={needObj.label}>{needObj.label}</span>)
        needsComponents.push(
            <GameComponent title={needObj.title} schemeData={schemeData} key={needObj.id}>
                < ScaleSegment 
                        currentValue={props[needObj.id].current}
                        maxValue={props[needObj.id].max}
                        classNameColor={`scale_segment__fill_${needObj.color}`} />
            </GameComponent>
        )
    }

    return (
        <div className="char-param">
            <img src="" alt="Перс" />

            <div className="char-param__scales_main">
                {paramsComponents}
            </div>

            <div className="char-param__main">
                <p>{props.name}</p>
                <p>{props.race}</p>
            </div>

            <div className="char-param__scales_second">
                {needsComponents}
            </div>
        </div>
    )
}

export default CharParam
