import { setData } from "../../Redux/api"
import adminStore from "./store"
import { setPackage } from "../../Redux/actions"

export function setListChars(mapData) {
    adminStore.dispatch(setPackage(mapData))
}

export function setChar(nameChar) {
    let dataChar = adminStore.getState().get(nameChar)
    setData(dataChar)
}
