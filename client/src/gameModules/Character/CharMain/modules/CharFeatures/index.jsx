import "./CharFeatures.css"

function CharFeatures(props) {
    let arrFeatures = []
    let count = 0

    for (let [title, objFeature] of Object.entries(props)) {
        arrFeatures.push(<li className="char-features__feature" key={count}>{title}</li>)
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
