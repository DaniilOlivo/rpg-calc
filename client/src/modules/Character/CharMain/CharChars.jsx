import "./CharChars.css"

const chars = {
    "Сила": 10,
    "Выносливость": 10,
    "Ловкость": 10,
    "Внимательность": 10,
    "Интеллект": 10,
    "Сила воли": 10,
    "Харизма": 10,
}

function CharChars(props) {
    let arrChars = []

    let count = 0

    for (let [label, value] of Object.entries(chars)) {
        let line = <div className="char-chars__line" key={count}>
                <span className="char-chars__label">{label}</span>
                <span className="char-chars__value">{value}</span>
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
