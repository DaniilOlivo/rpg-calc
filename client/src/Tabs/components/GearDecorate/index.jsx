import gearImage from "./gear.png"
import "./GearDecorate.css"

function GearDecorate(props) {
    let className = "tabs__gear"

    if (props.animation) {
        className += " tabs__gear_rotate"
    }

    return (
        <img src={gearImage} alt="Шестерня" className={className} onAnimationEnd={props.animationEnd} />
    )
}

export default GearDecorate
