import libs.env as env
import libs.base as base


class GlobalController:
    def __init__(self):
        self.space_objects = {
            "time_tracker": env.TimeTracker(),
        }

    def add_object(self, game_object: base.GameObject, force=False):
        id_object = game_object.id
        if id_object in self.space_objects and not force:
            raise KeyError("Такой id уже есть в пространстве: {}".format(id_object))
        
        self.space_objects[id_object] = game_object
    
    def del_object(self, id_object: str) -> any:
        return self.space_objects.pop(id_object, None)

    def get_objects(self) -> list:
        space_objects = []
        for object in self.space_objects.values():
            space_objects.append(object.registry)
        
        return space_objects
    
    def set_change(self, package_change: dict):
        for id_object, change in package_change.items():
            if id_object in self.space_objects:
                obj = self.space_objects[id_object]
                obj.set_change(change)
