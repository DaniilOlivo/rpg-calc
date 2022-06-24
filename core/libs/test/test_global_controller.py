import unittest
import libs.global_controller as controller
from libs.base import GameObject


class FakeObject (GameObject):
    def __init__(self, id_object: str):
        super().__init__(id_object)
        self.change = {}

    def set_change(self, package_change: dict):
        self.change = package_change


class TestController (unittest.TestCase):
    def setUp(self):
        self.controller = controller.GlobalController()

    def test_add_object(self):
        obj_id = "object_1"
        obj = GameObject(obj_id)
        self.controller.add_object(obj)
        self.assertIn(obj_id, self.controller.space_objects)
    
    def test_get_objects(self):
        list_objs = self.controller.get_objects()
        tracker = list_objs[0]
        self.assertEqual(tracker["id"], "time_tracker")
    
    def test_set_change(self):
        obj_id = "fake_object"
        obj = FakeObject(obj_id)
        self.controller.add_object(obj)
        package_change = {
            obj_id: {
                "ADD": {
                    "value": 5
                }
            }
        }
        self.controller.set_change(package_change)
        self.assertDictEqual(obj.change, {"ADD": {"value": 5}})
