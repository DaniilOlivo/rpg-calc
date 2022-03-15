export function actionSetCharData(charData) {
    return {
        type: "SET_CHAR",
        charData
    }
}

export function actionPushLog(message) {
    return {
        type: "PUSH_LOG",
        message
    }
}

export function actionReset() {
    return {
        type: "RESET"
    }
}
