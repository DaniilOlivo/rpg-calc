import "./CharParam.css"

import ScaleSolid from "../../../../components/Scales/ScaleSolid"
import ScaleSegment from "../../../../components/Scales/ScaleSegment"

function CharParam(props) {
    return (
        <div className="char-param">
            <img src="" alt="Перс" />

            <div className="char-param__scales_main">
                < ScaleSolid
                    title="hp"
                    currentValue={props.hp.current}
                    maxValue={props.hp.max}
                    classNameColor="scale_solid__fill_hp" />
                < ScaleSolid
                    title="sp"
                    currentValue={props.sp.current}
                    maxValue={props.sp.max}
                    classNameColor="scale_solid__fill_sp" />
                < ScaleSolid
                    title="mp"
                    currentValue={props.mp.current}
                    maxValue={props.mp.max}
                    classNameColor="scale_solid__fill_mp" />
            </div>

            <div className="char-param__main">
                <p>{props.name}</p>
                <p>{props.race}</p>
            </div>

            <div className="char-param__scales_second">
                <span>Голод: </span>
                < ScaleSegment 
                    currentValue={props.hunger.current}
                    maxValue={props.hunger.max}
                    classNameColor="scale_segment__fill_orange" />
                <span>Усталость: </span>
                < ScaleSegment 
                    currentValue={props.fatigue.current}
                    maxValue={props.fatigue.max}
                    classNameColor="scale_segment__fill_lime" />
            </div>
        </div>
    )
}

export default CharParam
