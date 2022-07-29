import store from "./store";
import * as actions from "./actions"

import * as gameController from "../GameController"


export function setController(controller) {
    dispatchStore(actions.setController(controller))

    let currentState = store.getState()
    let user = currentState.get("user")

    let character
    if (user.admin) {
        // Check if the character has already been recorded in redux
        // So that the admin does not reset the current character when updating the game
        let lastCharacter = currentState.get("character")
        let nameLastCharacter = lastCharacter.name
        if (nameLastCharacter) {
            character = gameController.getCharacter(currentState, nameLastCharacter)
        } else {
            character = gameController.getGroupObjects(currentState, "player")[0]
        }
    } else {
        character = gameController.getCharacter(currentState, user.character)
    }
    dispatchStore(actions.setCharacter(character))
}

export function dispatchStore(action) {
    store.dispatch(action)
}

export default dispatchStore
