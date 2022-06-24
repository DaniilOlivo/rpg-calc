import unittest
import libs.base as base
import libs.effects as effects

class SimpleGameObject:
    def __init__(self):
        self.mod_system = base.ModSystem(10)
        self.element = {
                "mod_system": self.mod_system,
                "hp": 10,
            }
    
    @property
    def registry(self) -> dict:
        return {
            "element": self.element
        }


class MockTimeTracker:
    def __init__(self):
        self.step = []

    def set_plan(self, action, step: int):
        self.step.append(step)
        action()

class TestEffect (unittest.TestCase):
    def setUp(self):
        self.game_object = SimpleGameObject()
    
    def get_parameter(self, parameter: str):
        return self.game_object.registry["element"][parameter]

    def test_mod(self):
        label = "За красивые глаза"
        effect = effects.ModEffect(self.game_object, "element",
            parameter="mod_system", label=label, value=5
        )
        effect.activate()
        mod_system = self.get_parameter("mod_system")
        self.assertEqual(mod_system.mod_values[label], 5)

        del effect
        mod_system = self.get_parameter("mod_system")
        self.assertFalse(label in mod_system.mod_values)
    
    def test_action(self):
        tracker = MockTimeTracker()
        effect = effects.ActionEffect(self.game_object, "element", tracker,
            count=5, step=10, parameter="hp", action=-1
        )
        self.assertEqual(self.get_parameter("hp"), 5)
        self.assertListEqual(tracker.step, [i for i in range(10, 51, 10)])
