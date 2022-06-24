import unittest
import libs.inventory as inventory
from libs.player import Player


class TestInventory (unittest.TestCase):
    def setUp(self):
        self.player = Player("test_player", "Барак", "Орк")
        self.inventory = inventory.Inventory(self.player)
    
    def test_add_item(self):
        item_title = "Пончик"
        place = inventory.BACKPACK_INVENTORY
        item_features = {
            "type": "Еда",
            "weight": 0.2,
        }
        self.inventory.add_item(place, item_title, item_features)
        self.assertIn(item_title, self.inventory.total_items)
        self.assertIn(item_title, self.inventory.group_items[place])
        self.assertEqual(self.inventory.weight, 0.2)
    
    def test_overload(self):
        item_features = {
            "type": "Разное",
            "weight": 150,
        }
        self.inventory.add_item(inventory.BACKPACK_INVENTORY, "Почка дракона", item_features)
        self.assertIn("Перегруз", self.player.features)
    
    def test_replace_item(self):
        item_title = "Деревянный меч"
        item_features = {
            "type": "Оружие",
            "weight": 1,
        }

        first_place = inventory.BACKPACK_INVENTORY
        second_place = inventory.EQUIP_INVENTORY

        self.inventory.add_item(first_place, item_title, item_features)
        self.inventory.replace_item(item_title, second_place)

        self.assertNotIn(item_title, self.inventory.group_items[first_place])
        self.assertIn(item_title, self.inventory.group_items[second_place])
    
    def test_del_item(self):
        item_title = "Гроши"
        item_features = {
            "type": "Деньги",
            "weight": 0.1,
            "number": 5,
        }

        place = inventory.BACKPACK_INVENTORY

        self.inventory.add_item(place, item_title, item_features)
        self.assertEqual(self.inventory.weight, 0.5)

        self.inventory.del_item(item_title)
        self.assertNotIn(item_title, self.inventory.total_items)
        self.assertNotIn(item_title, self.inventory.group_items[place])

        self.assertEqual(self.inventory.weight, 0)
