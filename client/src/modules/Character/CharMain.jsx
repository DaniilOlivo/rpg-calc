import Block from "../../components/Block";

import CharParam from "./CharMain/CharParam";
import CharChars from "./CharMain/CharChars";
import CharEffects from "./CharMain/CharEffects";
import CharFeatures from "./CharMain/CharFeatures";

import "./CharMain.css"

function CharMain(props) {
    return (
        <div className="char-main">
            <Block title="Параметры" idArea="Params">
                < CharParam />
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

export default CharMain

