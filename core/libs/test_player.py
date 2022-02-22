import unittest
import json
from libs.player import Player, CharTable

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
        self.player = Player("Барак", "Орк", CharTable(chars))

    def test_chars(self):
        self.assertEqual(self.player.chars.get_value("STR"), 22)
    
    def test_effects(self):
        self.player.effects.add_item("Кровавый понос", shade="negative", timeUnit="hour")
        effects = self.player.effects
        alias = effects["Кровавый понос"]["timeUnitAlias"]
        count = effects["Кровавый понос"]["timeNumber"]

        self.assertEqual(alias, "Час")
        self.assertEqual(count, 1)

    def test_decode(self):
        decodePlayer = self.player.decode()
        json.dumps(decodePlayer)
