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
                    currentValue={props.hp}
                    maxValue={props.maxHp}
                    classNameColor="scale_solid__fill_hp" />
                < ScaleSolid
                    title="sp"
                    currentValue="24"
                    maxValue="24"
                    classNameColor="scale_solid__fill_sp" />
                < ScaleSolid
                    title="mp"
                    currentValue="0"
                    maxValue="10"
                    classNameColor="scale_solid__fill_mp" />
            </div>

            <div className="char-param__main">
                <p>Имя</p>
                <p>Раса</p>
            </div>

            <div className="char-param__scales_second">
                <span>Голод: </span>
                < ScaleSegment 
                    currentValue="2"
                    maxValue="5"
                    classNameColor="scale_segment__fill_orange" />
                <span>Усталость: </span>
                < ScaleSegment 
                    currentValue="5"
                    maxValue="5"
                    classNameColor="scale_segment__fill_lime" />
            </div>
        </div>
    )
}

export default CharParam
