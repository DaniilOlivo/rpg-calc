import Block from "../../../components/Block";

import CharParam from "./components/CharParam";
import CharChars from "./components/CharChars";
import CharEffects from "./components/CharEffects";
import CharFeatures from "./components/CharFeatures";

import "./CharMain.css"

import { connect } from "react-redux"

function CharMainView(props) {
    return (
        <div className="char-main">
            <Block title="Параметры" idArea="Params">
                < CharParam {...props.params} name={props.name} race={props.race} />
            </Block>

            <Block title="Эффекты" idArea="Effects">
                < CharEffects />
            </Block>

            <Block title="Характеристики" idArea="Chars">
                < CharChars />
            </Block>

            <Block title="Особенности" idArea="Features">
                < CharFeatures />
            </Block>
        </div>
    )
}

function mapStateToProps(state) {
    return state.toObject()
}

let CharMainWrap = connect(mapStateToProps)(CharMainView)

export default CharMainWrap
