import { setCharData, pushLog } from "./index"
import store from "./store"
import { actionReset } from "./actions" 

import { setListChars, setChar } from "./admin"
import adminStore from "./admin/store"

import { Map } from "immutable"

const dataChar = {
    charMain: {
        name: "Барак"
    },
    color: "white"
} 

describe("Redux API", () => {
    it("Запись персонажа", () => {
        setCharData(dataChar)
        let char = store.getState().get("char")
        expect(char).toEqual(dataChar)
    })

    it("Добавление сообщения в лог", () => {
        pushLog("Сообщение 1")
        let log = store.getState().get("log")
        expect(log.get(0)).toEqual("Сообщение 1")
        pushLog("Сообщение 2")
        log = store.getState().get("log")
        expect(log.get(1)).toEqual("Сообщение 2")
    })

    afterEach(() => {
        store.dispatch(actionReset())
    })
})

describe("Redux Admin API", () => {
    it("Добавление персонажа в список", () => {
        setListChars("Барак", dataChar)
        
        let state = adminStore.getState()
        let chars = state.get("chars")
        let currentChar = state.get("currentChar")

        expect(chars.get("Барак")).toEqual(dataChar)
        expect(currentChar).toEqual(dataChar)

        setListChars("Чан Кочан", dataChar)

        chars = adminStore.getState().get("chars")

        expect(chars.count()).toBe(2)
    })

    it("Установка текущего персонажа", () => {
        setListChars("Барак", dataChar)
        setChar()
        let char = store.getState().get("char")
        expect(char).toEqual(dataChar)
    }) 

    afterEach(() => {
        adminStore.dispatch(actionReset())
    })
})
