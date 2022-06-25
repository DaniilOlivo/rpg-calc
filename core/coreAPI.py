from sys import argv
from utils.jsonParser import json_parser
import pickle
from db.core_game_model import CoreGame
from libs.global_controller import GlobalController


def get_controller() -> CoreGame:
    return CoreGame.get(CoreGame.id_controller == "global_controller")

def get_controller_object(controller_enity: CoreGame) -> GlobalController:
    controller_pickle = controller_enity.pickle
    return pickle.loads(controller_pickle) 

def write_controller(controller_enity: CoreGame, edited_controller: GlobalController):
    controller_enity.pickle = pickle.dumps(edited_controller)
    controller_enity.json_shandow = json_parser(edited_controller.get_objects())
    controller_enity.save()


if __name__ == "__main__":
    method = argv[1]

    controller_enity = get_controller()

    if (method == "GET"): 
        print(controller_enity.json_shandow)

    if (method == "SET"):
        argument = argv[2]

        package_changes = json_parser(argument)
        controller = get_controller_object(controller_enity)
        controller.set_change(package_changes)

        write_controller(controller_enity, controller)

        print(controller_enity.json_shandow)
