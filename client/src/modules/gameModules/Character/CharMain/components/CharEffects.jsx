import "./CharEffects.css"

const exapmleEffects = [
    {
        title: "Кровавый понос",
        time: "1 день",
        type: "negative",
    },

    {
        title: "Повышенная потенция",
        time: "1 ход",
        type: "positive",
    },

    {
        title: "Бухущий в хлам",
        time: "3 часа",
        type: "neutral",
    },
]

function CharEffects(props) {
    let arrEffects = []
    let count = 0

    for (let effect of exapmleEffects) {
        let effectClass = "char-effects__block char-effects__" + effect.type

        let divEffect = <div className={effectClass} key={count}>
                <span className="char-effects__title">{effect.title}</span>
                <span className="char-effects__time">{effect.time}</span>
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
