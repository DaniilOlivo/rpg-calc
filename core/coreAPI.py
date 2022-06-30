from sys import argv
import jsonpickle
from db.core_game_model import CoreGame
from libs.global_controller import GlobalController


def get_controller() -> CoreGame:
    return CoreGame.get(CoreGame.id_controller == "global_controller")

def write_controller(controller_enity: CoreGame, edited_controller: GlobalController):
    controller_enity.json_shandow = jsonpickle.encode(edited_controller)
    controller_enity.save()


if __name__ == "__main__":
    method = argv[1]

    controller_enity = get_controller()
    json_shandow = controller_enity.json_shandow
    controller_object = jsonpickle.decode(json_shandow)
    controller_object:GlobalController

    if (method == "GET"): 
        print(json_shandow)

    if (method == "SET"):
        argument = argv[2]

        package_changes = jsonpickle.decode(argument)
        controller_object.set_change(package_changes)

        write_controller(controller_enity, controller_object)

        print(jsonpickle.encode(controller_object))
