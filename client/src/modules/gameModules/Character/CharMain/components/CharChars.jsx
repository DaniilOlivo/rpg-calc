import "./CharChars.css"

function CharChars(props) {
    let arrChars = []

    let count = 0

    for (let objChar of Object.values(props)) {
        let line = <div className="char-chars__line" key={count} >
                <span className="char-chars__label">{objChar.alias}</span>
                <span className="char-chars__value">{objChar.value}</span>
            </div>
         
            
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
