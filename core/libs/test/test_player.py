import unittest
from utils.jsonParser import json_parser
import libs.player as player

class TestCharTable (unittest.TestCase):
    def test_init(self):
        char_table = player.CharTable()
        agile = char_table["AGL"]
        self.assertEqual(agile["value"].value, 0)
        self.assertEqual(agile["alias"], "Ловкость")
    
    def test_start_chars(self):
        start_chars = {
            "AGL": 20
        }
        char_table = player.CharTable(start_chars)
        self.assertEqual(char_table["AGL"]["value"].value, 20)
        self.assertEqual(char_table["STR"]["value"].value, 0)


class TestEffectsTable (unittest.TestCase):
    def setUp(self):
        self.effects_table = player.EffectsTable()

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
        self.player = player.Player("player_barak", name="Барак", race="Орк", chars=chars)

    def test_table_edit_int(self):
        package_change = {
            "TABLE_EDIT": {
                "hp": {
                    "current": 10,
                }
            }
        }
        self.player.set_change(package_change)
        hp = self.player.params["hp"]
        self.assertEqual(hp["current"], 10)
    
    def test_table_multi_edit(self):
        label = "Проплачено"
        alias = "Телосложение"
        package_change = {
            "TABLE_EDIT": {
                "END": {
                    "alias": alias,
                }
            },

            "TABLE_MOD_ADD": {
                "END": {
                    "value": {
                        "label": label,
                        "value": 2
                    }
                }
            }
        }

        self.player.set_change(package_change)
        end = self.player.chars["END"]
        hp = self.player.params["hp"]
        self.assertEqual(end["value"].value, 22)
        self.assertEqual(end["alias"], alias)
        self.assertEqual(hp["max"].value, 27)

    def test_table_mod_add(self):
        label = "За красивые глаза"
        package_change = {
            "TABLE_MOD_ADD": {
                "hp": {
                    "max": {
                        "label": label,
                        "value": 5
                    }
                }
            }
        }
        self.player.set_change(package_change)
        hp = self.player.params["hp"]
        self.assertEqual(hp["max"].mod_values[label], 5)
        self.assertEqual(hp["max"].value, 30)
        
    def test_table_mod_edit(self):
        label_1 = "За красивые глаза"
        label_2 = "За очень красивые глаза"
        package_change = {
            "TABLE_MOD_ADD": {
                "hp": {
                    "max": {
                        "label": label_1,
                        "value": 5
                    }
                }
            }
        }
        self.player.set_change(package_change)

        second_package_change = {
            "TABLE_MOD_EDIT": {
                "hp": {
                    "max": {
                        "label": label_1,
                        "newLabel": label_2,
                        "value": 10
                    }
                }
            }
        }
        self.player.set_change(second_package_change)

        hp = self.player.params["hp"]["max"]
        self.assertEqual(hp.value, 35)
        mod = hp.mod_values
        self.assertNotIn(label_1, mod)
        self.assertIn(label_2, mod)

    def test_set_del(self):
        package_change = {
            "TABLE_MOD_ADD": {
                "hp": {
                    "max": {
                        "label": "Просто так",
                        "value": 2
                    }
                }
            }
        }
        self.player.set_change(package_change)

        second_package_change = {
            "TABLE_MOD_DEL": {
                "hp": {
                    "max": {
                        "label": "Просто так"
                    }
                }
            }
        }
        self.player.set_change(second_package_change)

        self.assertEqual(self.player.params["hp"]["max"].value, 25)

    def test_table_mod_readonly(self):
        package_change = {
            "TABLE_MOD_DEL": {
                "hp": {
                    "max": {
                        "label": "Характеристики"
                    }
                }
            }
        }
        self.player.set_change(package_change)
        hp = self.player.params["hp"]["max"]
        self.assertEqual(hp.mod_values["Характеристики"], 20)

    def test_needs(self):
        hunger = self.player.params["hunger"]
        features = self.player.features

        self.player.step_time(1)
        self.assertEqual(hunger["current"], 5)

        self.player.step_time(6)
        self.assertEqual(hunger["current"], 0)
        self.assertIn("Истощение 2 степени", features)

        self.player.params.full()
        self.player.step_time(1)
        self.assertIn("Истощение 1 степени", features)
        self.assertNotIn("Истощение 2 степени", features)

        self.player.params.full("hunger")
        self.player.step_time(6)
        self.assertIn("Истощение 1 степени", features)
