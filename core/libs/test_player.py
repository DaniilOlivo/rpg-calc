import unittest
from utils.jsonParser import json_parser
from libs.base import ModSystem, Effect
from libs.player import Player, ParamTable, CharTable, EffectsTable

class TestEffect (unittest.TestCase):
    def test_change_game_element(self):
        mod_system = ModSystem()
        effect = Effect(mod_system, label="За красивые глаза", value=5)
        self.assertEqual(mod_system.value, 5)

class TestCharTable (unittest.TestCase):
    def test_init(self):
        char_table = CharTable()
        agile = char_table["AGL"]
        self.assertEqual(agile["value"].value, 0)
        self.assertEqual(agile["alias"], "Ловкость")
    
    def test_start_chars(self):
        start_chars = {
            "AGL": 20
        }
        char_table = CharTable(start_chars)
        self.assertEqual(char_table["AGL"]["value"].value, 20)
        self.assertEqual(char_table["STR"]["value"].value, 0)


class TestEffectsTable (unittest.TestCase):
    def setUp(self):
        self.effects_table = EffectsTable()

    def test_add_effect_default(self):
        self.effects_table.add_item("Кровавый понос")
        self.assertEqual(self.effects_table["Кровавый понос"]["timeNumber"], 1)

    def test_add_effect_custom(self):
        parameters_effect = {
            "timeNumber": 10,
            "timeUnit": "hour"
        }
        self.effects_table.add_item("Золотуха", parameters_effect)
        effect = self.effects_table["Золотуха"]
        self.assertEqual(effect["timeNumber"], 10)
        self.assertEqual(effect["timeUnitAlias"], "Час")


class TestPlayer(unittest.TestCase):
    def setUp(self):
        chars = {
            "STR": 20,
            "END": 17,
            "AGL": 6,
            "REF": 6,
            "INT": 2,
            "WIL": 10,
            "CHR": 10,
        }
        self.player = Player("Барак", "Орк", chars)
        self.data = {
            "hp": {
                "max": {
                    "label": "Просто так",
                    "value": 5
                }
            }
        }

    def test_set_simple(self):
        data = {
            "hp": {
                "current": 10,
            }
        }
        self.player.setData(data, "ADD")
        hp = self.player.params["hp"]
        self.assertEqual(hp["current"], 10)

    def test_set_mod_system(self):
        label = "За красивые глаза"
        data = {
            "hp": {
                "max": {
                    "label": label,
                    "value": 5
                }
            }
        }
        self.player.setData(data, "ADD")
        hp = self.player.params["hp"]
        self.assertEqual(hp["max"].mod_values[label], 5)
        self.assertEqual(hp["max"].value, 30)
    
    def test_set_char(self):
        label = "Проплачено"
        alias = "Телосложение"
        data = {
            "END": {
                "alias": alias,
                "value": {
                    "label": label,
                    "value": 2
                }
            }
        }
        self.player.setData(data, "ADD")
        end = self.player.chars["END"]
        hp = self.player.params["hp"]
        self.assertEqual(end["value"].value, 22)
        self.assertEqual(end["alias"], alias)
        self.assertEqual(hp["max"].value, 27)

    def test_set_edit(self):
        label_1 = "За красивые глаза"
        label_2 = "За очень красивые глаза"
        data = {
            "hp": {
                "max": {
                    "label": label_1,
                    "value": 5
                }
            }
        }
        self.player.setData(data, "ADD")
        change = data["hp"]["max"]
        change["newLabel"] = label_2
        change["value"] = 10
        self.player.setData(data, "EDIT")
        hp = self.player.params["hp"]["max"]
        self.assertEqual(hp.value, 35)
        mod = hp.mod_values
        self.assertNotIn(label_1, mod)
        self.assertIn(label_2, mod)

    def test_set_del(self):
        self.player.setData(self.data, "ADD")
        self.player.setData(self.data, "DEL")
        self.assertEqual(self.player.params["hp"]["max"].value, 25)

    def test_set_readonly(self):
        data = {
            "hp": {
                "max": {
                    "label": "Характеристики"
                }
            }
        }
        self.player.setData(data, "DEL")
        hp = self.player.params["hp"]["max"]
        self.assertEqual(hp.mod_values["Характеристики"], 20)


    def test_decode(self):
        decodePlayer = self.player.registry
        json_parser(decodePlayer)
