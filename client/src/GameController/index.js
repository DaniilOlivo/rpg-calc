import { Map } from "immutable"


function getController(state=Map()) {
    let controller = state.get("globalController")
    if (!controller) throw new Error("GameController > Not found controller in redux store")
    return controller
}

export function getObject(state=Map(), id_object="") {
    if (!id_object) throw new Error("GameController > No set id object")
    let controller = getController(state)
    let obj = controller["space_objects"][id_object]
    if (!obj) throw new Error("GameController > Not found object in controller")
    return obj
}

export function getGroupObjects(state=Map(), id_group) {
    let controller = getController(state)
    let resultGroup = []
    for (let [id_obj, obj] of Object.entries(controller.space_objects)) {
        if (id_obj.startsWith(id_group + '_')) resultGroup.push(obj)
    }
    return resultGroup
}

export function getCharacter(state=Map(), character="") {
    let players = getGroupObjects(state, "player")

    for (let player of players) {
        if (player.name === character) return player
    }

    return null
}
