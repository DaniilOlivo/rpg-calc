import unittest
import prototype.base as base
import prototype.player as player
import prototype.globals as globals

class TestEffect (unittest.TestCase):
    def setUp(self) -> None:
        self.player = player.Player(STR=5, END=2)
        self.effect = base.Effect(self.player, "END", value=5)

    def test_add_effect(self):
        self.assertEqual(self.player.chars["END"]["value"], 5)

    def test_del_effect(self):
        del self.effect
        self.assertEqual(self.player.chars["END"]["value"], 2)


class TestGlobals (unittest.TestCase):
    def setUp(self) -> None:
        self.time_tracker = globals.TimeTracker()
    
    def test_init(self):
        self.assertEqual(str(self.time_tracker), "Месяц Серпа 1 1234 г.")
    
    def test_next(self):
        self.time_tracker.step(12)
        self.assertEqual(str(self.time_tracker), "Месяц Серпа 13 1234 г.")
        self.time_tracker.step(20)
        self.assertEqual(str(self.time_tracker), "Месяц Молота 3 1234 г.")
    
class TestPlan (unittest.TestCase):
    def setUp(self) -> None:
        self.time_tracker = globals.TimeTracker()
        self.player = player.Player(STR=5, END=2)
        self.effect = base.TimeEffect(self.player, "END", self.time_tracker, value=5, time=10)
    
    def get_end(self) -> int:
        return self.player.chars["END"]["value"]

    def test_self_del_with_plan(self):
        self.assertEqual(self.get_end(), 5)
        self.time_tracker.step(5)
        self.assertEqual(self.get_end(), 5)
        self.time_tracker.step(6)
        self.assertEqual(self.get_end(), 2)
    
