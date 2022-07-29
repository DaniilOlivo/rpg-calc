import "./CharParam.css"

import ScaleSolid from "../../../../components/Scales/ScaleSolid"
import ScaleSegment from "../../../../components/Scales/ScaleSegment"

// import ElementGC from "../../../../components/ElementGC"


function CharParam(props) {
    let paramsData = [
        {id: "hp", title: "Здоровье"},
        {id: "sp", title: "Выносливость"},
        {id: "mp", title: "Мана"},
    ]

    let paramsComponents = []

    for (let paramObj of paramsData) {
        let id = paramObj.id
        let gameObject = props[id]

        let schemeData = {
            current: {
                type: "INTEGER",
                label: "Текущее значение " + id
            },
            max: {
                type: "MOD",
                label: "Максимальное значение " + id
            } 
        }
        
        // paramsComponents.push(
        //     <ElementGC
        //         idElement={id}
        //         gameElement={gameObject}
        //         schemeData={schemeData}
        //         title={paramObj.title}
        //         key={id}>
        //         < ScaleSolid
        //             title={id}
        //             currentValue={gameObject.current}
        //             maxValue={gameObject.max.value}
        //             classNameColor={`scale_solid__fill_${id}`} />
        //     </ElementGC>
        // )
    }

    let needsData = [
        {id: "hunger", title: "Голод", labelCase: "голода", color: "orange"},
        {id: "fatigue", title: "Усталость", labelCase: "усталости", color: "lime"}
    ]

    let needsComponents = []

    for (let needObj of needsData) {
        let id = needObj.id
        let title = needObj.title
        let gameObject = props[id]

        let schemeData = {
            current: {
                type: "INTEGER",
                label: "Текущее значение " + needObj.labelCase,
            },
            max: {
                type: "INTEGER",
                label: "Максимальное значение " + needObj.labelCase
            }
        }
        
        needsComponents.push(<span key={title}>{title}</span>)
        // needsComponents.push(
        //     <ElementGC
        //         idElement={id}
        //         gameElement={gameObject}
        //         schemeData={schemeData}
        //         title={title}
        //         key={id}>
        //         < ScaleSegment 
        //                 currentValue={gameObject.current}
        //                 maxValue={gameObject.max.value}
        //                 classNameColor={`scale_segment__fill_${needObj.color}`} />
        //     </ElementGC>
        // )
    }

    return (
        <div className="char-param">
            <img src="" alt="Перс" />

            <div className="char-param__scales_main">
                {paramsComponents}
            </div>

            <div className="char-param__main">
                <p>{props.name}</p>
                <p>{props.race.title}</p>
            </div>

            <div className="char-param__scales_second">
                {needsComponents}
            </div>
        </div>
    )
}

export default CharParam
