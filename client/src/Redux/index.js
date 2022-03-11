import store from "./store";
import { actionSetCharData, actionPushLog } from "./actions"

export function setCharData(charData) {
    store.dispatch(actionSetCharData(charData))
}

export function pushLog(message) {
    store.dispatch(actionPushLog(message))
}
