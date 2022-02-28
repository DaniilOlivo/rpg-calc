import { setData } from ".."
import adminStore from "./store"

import { setPackage } from "../actions"

export function setListChars(mapData) {
    adminStore.dispatch(setPackage(mapData))
    setChar(Object.keys(mapData)[0])
}

export function setChar(nameChar) {
    let dataChar = adminStore.getState().get(nameChar)
    setData(dataChar)
}