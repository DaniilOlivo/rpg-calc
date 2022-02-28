import getView from "../../Redux/views"

import charImage from "./icons/char.png"
import skillsImage from "./icons/skills.png"
import bioImage from "./icons/bio.png"

import CharMain from "./CharMain"

const charIndex = new Map([
    [charImage, getView(CharMain, "charMain")],
    [skillsImage, "Навыки"],
    [bioImage, "Биография"]
])

export default charIndex
