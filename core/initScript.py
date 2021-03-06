import jsonpickle
import libs.player as player
from libs.global_controller import GlobalController
import pickle
from db.core_game_model import CoreGame
from utils.jsonParser import json_parser


CHARS_BARAK = {
    "STR": 20,
    "END": 17,
    "AGL": 6,
    "REF": 6,
    "INT": 2,
    "WIL": 10,
    "CHR": 10,
}

CHARS_KOCHAN = {
    "STR": 8,
    "END": 10,
    "AGL": 16,
    "REF": 15,
    "INT": 10,
    "WIL": 15,
    "CHR": 7,
}


if __name__ == "__main__":
    CoreGame.create_table(safe=True)
    controller = GlobalController()

    barak = player.Player("player_barak", name="Барак", race="Орк", chars=CHARS_BARAK)
    kochan = player.Player("player_kochan", name="Чан Кочан", race="Человек", chars=CHARS_KOCHAN)

    controller.add_object(barak)
    controller.add_object(kochan)

    CoreGame(id_controller="global_controller", json_shandow=jsonpickle.encode(controller)).save()
