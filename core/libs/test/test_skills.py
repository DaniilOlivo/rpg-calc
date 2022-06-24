import unittest
import libs.skills as skills


class TestSkillTable (unittest.TestCase):
    def setUp(self):
        self.skills = skills.SkillTable({"Колющее": 2})
    
    def test_init_table(self):
        skill = self.skills["Колющее"]
        self.assertEqual(skill["level"], 2)
        self.assertEqual(skill["require_xp"], 12)

    def test_xp_up(self):
        self.skills.edit_item("Колющее", "xp", 12)
        skill = self.skills["Колющее"]
        self.assertEqual(skill["xp"], 0)
        self.assertEqual(skill["level"], 3)
        self.assertEqual(skill["require_xp"], 13)
        