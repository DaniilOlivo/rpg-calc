from sys import argv
import jsonpickle
import json
from utils.clear_shandow import clear_shandow
from db.core_game_model import CoreGame
from libs.global_controller import GlobalController


def get_controller() -> CoreGame:
    return CoreGame.get(CoreGame.id_controller == "global_controller")

def write_controller(controller_enity: CoreGame, edited_controller: GlobalController):
    controller_enity.json_shandow = jsonpickle.encode(edited_controller)
    controller_enity.save()

def print_controller(json_controller: str):
    # Clean json from system keys
    # To do this, we need to decode the string using a standard json parser so that it turns it not into a class object but into a dict
    print(json.dumps(clear_shandow(json.loads(json_controller))))


if __name__ == "__main__":
    method = argv[1]

    controller_enity = get_controller()
    json_shandow = controller_enity.json_shandow
    controller_object = jsonpickle.decode(json_shandow)
    controller_object:GlobalController

    if (method == "GET"): 
        print_controller(json_shandow)

    if (method == "SET"):
        argument = argv[2]

        package_changes = jsonpickle.decode(argument)
        controller_object.set_change(package_changes)

        write_controller(controller_enity, controller_object)

        print_controller(jsonpickle.encode(controller_object))
