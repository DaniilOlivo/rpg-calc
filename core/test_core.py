import unittest
from libs.player import Player
import coreAPI
import json

class TestCore(unittest.TestCase):
    def setUp(self):
        self.controller_enity = coreAPI.get_controller()
        self.controller_object = coreAPI.get_controller_object(self.controller_enity)
    
    def test_get_controller(self):
        objects = self.controller_object.space_objects
        self.assertIn('player_barak', objects)

    def test_get_json(self):
        json_shandow = self.controller_enity.json_shandow
        shandow_object = json.loads(json_shandow)
        self.assertEqual(shandow_object[0]["id"], "time_tracker")
    
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
        new_controller = coreAPI.get_controller_object(self.controller_enity)
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
