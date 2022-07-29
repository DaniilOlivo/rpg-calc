import { mount, configure } from "enzyme"
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"

import { CharsMenu } from "./CharsMenu"
import { Map } from "immutable"

configure({adapter: new Adapter()})

const users = Map({
    "Поркчоп": {
        color: "green",
        character: "Барак"
    },
    "Чан Кочан": {
        color: "white",
        character: "Олег"
    }
})

const currentChar = {name: "Барак"}

const listChars = [
    {name: "Барак"},
    {name: "Олег"}
]

describe("Admin Menu Chars", () => {
    it("Все персонажи появились", () => {
        let component = mount(< CharsMenu setCharacter={jest.fn()} characters={listChars} currentCharacter={currentChar} users={users} />)
        let btnsChars = component.find(".chars-menu__btn")
        let firstChar = btnsChars.first()
        expect(firstChar.find(".chars-menu__btn p").text()).toBe("Барак")
        expect(firstChar.hasClass("chars-menu__btn_selected")).toBe(true)
        expect(firstChar.find(".chars-menu__marker").props().style).toEqual({backgroundColor: 'green'})

        let secondChar = btnsChars.last()
        expect(secondChar.find(".chars-menu__btn p").text()).toBe("Олег")
    })

    it("Вызов API", () => {
        let spySetCharacter = jest.fn()

        let component = mount(< CharsMenu setCharacter={spySetCharacter} characters={listChars} currentCharacter={currentChar} users={users} />)
        
        component.find(".chars-menu__btn").last().simulate("click")
        let callsSetCharacter = spySetCharacter.mock.calls
        expect(callsSetCharacter.length).toBe(1)
        expect(callsSetCharacter[0][0]).toEqual({name: "Олег"})
    })
})
