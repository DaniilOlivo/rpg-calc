import React from "react"

import tips from "./tips-load.json"
import loadImage from "./load.png"
import "./LoadBox.css"

function LoadBox(props) {
  let randomIndexTip = Math.floor(Math.random() * tips.length)
  let tip = tips[randomIndexTip]

  return (
    <div className="load-box">
        <img className="load-box__img" src={loadImage} alt="Представьте себе шестеренку" />
        <p className="load-box__tip">{ tip }</p>
    </div>
  )
}

export default LoadBox
