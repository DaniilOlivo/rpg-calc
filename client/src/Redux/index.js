import store from "./store";
import { actionSetCharData, actionPushLog } from "./actions"

const throwErrorUndefined = (value) => {
    throw new Error("Redux > API: Даны следующие данные " + value)
}

export function setCharData(charData) {
    if (!charData) throwErrorUndefined(charData)
    store.dispatch(actionSetCharData(charData))
}

export function pushLog(message) {
    if (!message) throwErrorUndefined(message)
    store.dispatch(actionPushLog(message))
}
