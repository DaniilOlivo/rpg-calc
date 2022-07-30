import unittest
from utils.findRecursion import findRecursion, EMPTY
from utils.clear_shandow import clear_shandow

class TestFindRecursion (unittest.TestCase):
    def setUp(self):
        self.data = {"charMain": {
            "params": {
                "hp": {
                    "current": 10,
                    "max": 15
                }
            },
            "effects": {}
        }}

    def test_find(self):
        target = "hp"

        result = findRecursion(target, self.data)
        parentObj, value = result 
        self.assertEqual(value["current"], 10)
    
    def test_empty(self):
        target = "hhp"

        result = findRecursion(target, self.data)
        self.assertEqual(result, EMPTY)

class TestClearShandow (unittest.TestCase):
    def setUp(self):
        self.source_obj = {
            "py/object": "libs.player.Player",
            "__dict__": {},
            "name": "Барак",
            "stats": {
                "py/object": "libs.player.Stats",
                "hp": 20
            }
        }
    
    def test_clear(self):
        cleaning_obj = clear_shandow(self.source_obj)
        self.assertFalse(cleaning_obj.get("py/object", False))
        self.assertFalse(cleaning_obj["stats"].get("py/object", False))
