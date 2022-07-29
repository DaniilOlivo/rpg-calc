export function setUsers(users) {
    return {
        type: "SET_USERS",
        users
    }
}

export function setUser(user) {
    return {
        type: "SET_USER",
        user
    }
}

export function setController(controller) {
    return {
        type: "SET_CONTROLLER",
        controller
    }
}

export function setCharacter(character) {
    return {
        type: "SET_CHARACTER",
        character
    }
}

export function setFlag(flag, value) {
    return {
        type: "SET_FLAG",
        flag, value
    }
}

export function pushLog(message) {
    return {
        type: "PUSH_LOG",
        message
    }
}

export function resetStore() {
    return {
        type: "RESET"
    }
}
