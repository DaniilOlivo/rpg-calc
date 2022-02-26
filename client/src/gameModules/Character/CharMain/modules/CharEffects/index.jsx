import "./CharEffects.css"

function CharEffects(props) {
    let arrEffects = []
    let count = 0

    for (let [title, objEffect] of Object.entries(props)) {
        let effectClass = "char-effects__block char-effects__" + objEffect.shade
        let timeLabel = objEffect.timeNumber + ' ' + objEffect.timeUnitAlias

        let divEffect = <div className={effectClass} key={count}>
                <span className="char-effects__title">{title}</span>
                <span className="char-effects__time">{timeLabel}</span>
            </div>
        
        arrEffects.push(divEffect)

        count++
    }

    return (
        <div className="char-effects">
            {arrEffects}
        </div>
    )
}

export default CharEffects
