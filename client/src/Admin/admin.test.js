import { mount, configure } from "enzyme"
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"

configure({adapter: new Adapter()})

import { CharsMenu, mapStateToProps } from "./CharsMenu"
import * as adminRedux from "../Redux/admin"
import { Map } from "immutable"

const char_1 = {
    charMain: {name: "Барак"},
    color: "green"
}

const char_2 = {
    charMain: {name: "Чан Кочан"},
    color: "white"
}

const listChars = [
    {
        nameChar: "Барак",
        color: "green",
        packageChar: char_1
    },
    {
        nameChar: "Чан Кочан",
        color: "white",
        packageChar: char_2
    }
]

describe("Admin", () => {
    it("Все персонажи появились", () => {
        let component = mount(< CharsMenu setCurrent={jest.fn()} currentChar={char_1} chars={listChars} />)
        let btnsChars = component.find(".chars-menu__btn")
        let firstChar = btnsChars.first()
        expect(firstChar.find(".chars-menu__btn p").text()).toBe("Барак")
        expect(firstChar.hasClass("chars-menu__btn_selected")).toBe(true)
        expect(firstChar.find(".chars-menu__marker").props().style).toEqual({backgroundColor: 'green'})

        let secondChar = btnsChars.last()
        expect(secondChar.find(".chars-menu__btn p").text()).toBe("Чан Кочан")
    })

    it("Вызов API", () => {
        let spySetCurrent = jest.fn()
        adminRedux.setChar = jest.fn()

        let component = mount(< CharsMenu setCurrent={spySetCurrent} currentChar={char_1} chars={listChars} />)
        
        component.find(".chars-menu__btn").last().simulate("click")
        let callsSetCurrent = spySetCurrent.mock.calls
        expect(callsSetCurrent.length).toBe(1)
        expect(callsSetCurrent[0][0]).toEqual(char_2)
        
        expect(adminRedux.setChar.mock.calls.length).toBe(1)
    })

    it("Connect Redux", () => {
        let stateStore = Map({
            "chars": Map({
                "Барак": char_1,
                "Чан Кочан": char_2
            }),
            "currentChar": char_1
        })

        let mapProps = mapStateToProps(stateStore)
        let expectProps = {
            "chars": listChars,
            "currentChar": char_1
        }
        expect(mapProps).toEqual(expectProps)
    })
})
