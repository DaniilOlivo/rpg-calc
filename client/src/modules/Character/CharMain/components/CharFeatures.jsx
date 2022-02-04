import "./CharFeatures.css"

const exampleFeatures = [
    "Рукожоп",
    "Идиот",
    "Нет магических способностей",
    "Урод (ну прям вообще)",
    "Невезучий",
    "Старый",
    "Девственник",
    "Хорошо рисуюет хохлому",
]

function CharFeatures(props) {
    let arrFeatures = []
    let count

    for (let feature of exampleFeatures) {
        arrFeatures.push(<li className="char-features__feature" key={count}>{feature}</li>)
        count++
    }

    return (
        <div className="char-features">
            <ul className="char-features__list">
                {arrFeatures}
            </ul>
        </div>
    )
}

export default CharFeatures
