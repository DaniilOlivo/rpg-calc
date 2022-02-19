import "./CharParam.css"

import ScaleSolid from "../../../../../components/Scales/ScaleSolid"
import ScaleSegment from "../../../../../components/Scales/ScaleSegment"

function CharParam(props) {
    return (
        <div className="char-param">
            <img src="" alt="Перс" />

            <div className="char-param__scales_main">
                < ScaleSolid
                    title="hp"
                    currentValue={props.hp}
                    maxValue={props.maxHp}
                    classNameColor="scale_solid__fill_hp" />
                < ScaleSolid
                    title="sp"
                    currentValue={props.sp}
                    maxValue={props.maxSp}
                    classNameColor="scale_solid__fill_sp" />
                < ScaleSolid
                    title="mp"
                    currentValue={props.mp}
                    maxValue={props.maxMp}
                    classNameColor="scale_solid__fill_mp" />
            </div>

            <div className="char-param__main">
                <p>{props.name}</p>
                <p>{props.race}</p>
            </div>

            <div className="char-param__scales_second">
                <span>Голод: </span>
                < ScaleSegment 
                    currentValue={props.hunger}
                    maxValue={props.maxHunger}
                    classNameColor="scale_segment__fill_orange" />
                <span>Усталость: </span>
                < ScaleSegment 
                    currentValue={props.fatigue}
                    maxValue={props.maxFatigue}
                    classNameColor="scale_segment__fill_lime" />
            </div>
        </div>
    )
}

export default CharParam
