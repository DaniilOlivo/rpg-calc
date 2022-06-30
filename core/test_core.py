import unittest
from libs.player import Player
import coreAPI
import jsonpickle
from libs.global_controller import GlobalController


class TestCore(unittest.TestCase):
    def setUp(self):
        self.controller_enity = coreAPI.get_controller()
        self.controller_object = jsonpickle.decode(self.controller_enity.json_shandow)
        self.controller_object:GlobalController
    
    def test_get_controller(self):
        self.assertIn('player_barak', self.controller_object.space_objects)
    
    def test_write_controller(self):
        package_change = {
            "player_barak": {
                "TABLE_MOD_ADD": {
                    "STR": {
                        "value": {
                            "label": "За красивые глаза",
                            "value": 5
                        }
                    }
                }
            }
        }
        self.controller_object.set_change(package_change)
        coreAPI.write_controller(self.controller_enity, self.controller_object)

        new_controller_enity = coreAPI.get_controller()
        new_controller = jsonpickle.decode(new_controller_enity.json_shandow)
        new_controller:GlobalController
        player = new_controller.space_objects["player_barak"]
        player:Player
        mod_system_str = player.chars["STR"]["value"]
        self.assertEqual(mod_system_str.value, 27)

        package_change_del = {
            "player_barak": {
                "TABLE_MOD_DEL": {
                    "STR": {
                        "value": {
                            "label": "За красивые глаза",
                        }
                    }
                }
            }
        }
        self.controller_object.set_change(package_change_del)
        coreAPI.write_controller(self.controller_enity, self.controller_object)
