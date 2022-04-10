import unittest
from utils.findRecursion import findRecursion, EMPTY

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
