import unittest
import libs.global_controller as controller


class TestTimeTracker (unittest.TestCase):
    def setUp(self):
        self.tracker = controller.TimeTracker()
        self.action_call = False
        self.spy_data = 0

    def action(self):
        self.action_call = True
    
    def reset_action(self):
        self.action_call = False

    def spy_subscribe(self, difference: int):
        self.spy_data = difference

    def _eq_dates(self, true_date: str):
        self.assertEqual(str(self.tracker), true_date)

    def test_step(self):
        self.tracker.step(12)
        self._eq_dates("12:00 1.1.1234")

        self.tracker.step(12)
        self._eq_dates("0:00 2.1.1234")

        self.tracker.step(5, unit="day")
        self._eq_dates("0:00 7.1.1234")

        self.tracker.step(23, unit="day")
        self._eq_dates("0:00 30.1.1234")

        self.tracker.step(60, unit="day")
        self._eq_dates("0:00 30.3.1234")

        self.tracker.step(360, unit="day")
        self._eq_dates("0:00 30.3.1235")
    
    def test_planning(self):
        self.tracker.set_plan(self.action, 20)
        self.tracker.step(20)
        self.assertTrue(self.action_call)
    
    def test_subscribe(self):
        self.tracker.subscribe(self.spy_subscribe)
        self.tracker.step(5, "mounth")
        self.assertEqual(self.spy_data, 150)
