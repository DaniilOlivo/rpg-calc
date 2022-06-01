import utils.findRecursion as find
from prototype.globals import TimeTracker

class Effect:
    def __init__(self, game_object, id_element: str, **kwargs) -> None:
        registry = game_object.registry
        result = find.findRecursion(id_element, registry)
        if result == find.EMPTY:
            return KeyError("ID не найден")
        table, element = result

        self.element = element
        for parameter, value in kwargs.items():
            start_value = element[parameter]
            def clear():
                element[parameter] = start_value
            self.clear = clear
            element[parameter] = value
        

    def __del__(self):
        self.clear()


class TimeEffect (Effect):
    def __init__(self, game_object, id_element: str, time_tracker: TimeTracker, **kwargs):
        if not "time" in kwargs:
            raise KeyError("Нету времени для эффекта")
        self.time = kwargs.pop("time")
        super().__init__(game_object, id_element, **kwargs)

        time_tracker.set_plan(self.time, self.clear)
        

