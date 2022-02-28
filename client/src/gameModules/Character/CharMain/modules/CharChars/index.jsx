import "./CharChars.css"
import Tip from "../../../../../components/Tip"

function CharChars(props) {
    let arrChars = []

    let count = 0

    for (let objChar of Object.values(props)) {
        let line = <div className="char-chars__line" key={count} data-tip={objChar.desc} >
                <span className="char-chars__label">{objChar.alias}</span>
                <span className="char-chars__value">{objChar.value}</span>
            </div>
         
            
        arrChars.push(line)

        count++
    }

    return (
        <div className="char-chars">
            {arrChars}
            < Tip />
        </div>
    )
}

export default CharChars
