import unittest
import core
import json

class TestCore(unittest.TestCase):
    def setUp(self):
        self.charName = "Барак"
    
    def test_get_char_db(self):
        char = core.getChar(self.charName)
        self.assertEqual(self.charName, char.name)

