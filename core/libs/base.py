from os import path
import json
import copy
from timeit import repeat
import utils.findRecursion as find
import libs.global_controller as controller

dir_config = "config"

def get_config(name_config: str):
    with open(path.join(path.dirname(__file__), dir_config, name_config), "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


class ModSystem:
    def __init__(self, base=0):
        self.base = base
        self.mod_values = {}
        self.mod_settings = {}
    
    def _calc_value(self) -> int:
        total_value = self.base

        for mod_value in self.mod_values.values():
            total_value += mod_value
        
        return total_value

    def set_mod(self, label: str, value: int, **flags):
        self.mod_settings[label] = flags
        self.mod_values[label] = value
    
    def del_mod(self, label: str):
        self.mod_settings.pop(label)
        self.mod_values.pop(label)
        
    @property
    def value(self):
        return self._calc_value()

    @property
    def registry(self) -> dict:
        return {
            "base": self.base,
            "mod_values": self.mod_values,
            "mod_settings": self.mod_settings,
            "value": self.value
        }
    
    def __str__(self):
        els = [self.base]
        els.extend(self.mod_values.values())
        present_str = "ModSystem"
        present_str += "+".join(list(map(lambda number: str(number), els)))
        return present_str
    
    def __repr__(self):
        return self.__str__()


class Effect:
    def __init__(self, game_object, id_element: str):
        registry = game_object.registry
        result = find.findRecursion(id_element, registry)
        if result == find.EMPTY:
            raise KeyError("ID элемента в регистре не найден")
        table, element = result

        self.element = element
        self.table = table
    
    def _get_parameter(self, id_parameter: str):
        return self.element[id_parameter]


class ModEffect (Effect):
    def __init__(self, game_object, id_element: str, **kwargs):
        super().__init__(game_object, id_element)

        parameter = self._get_parameter(kwargs["parameter"])

        if isinstance(parameter, ModSystem):
            label = kwargs["label"]
            parameter.set_mod(label, kwargs["value"])
            def clear():
                parameter.del_mod(label)
            self.clear = clear
        else:
            raise KeyError("Не указан parameter")

    def __del__(self):
        self.clear()


class ActionEffect (Effect):
    def __init__(self, game_object, id_element: str, time_tracker: controller.TimeTracker, **kwargs):
        super().__init__(game_object, id_element)

        self.repeat_count = kwargs.get("count", 1)
        repeat_step = 0

        action = kwargs["action"]
        id_parameter = kwargs["parameter"]

        if not isinstance(self.element[id_parameter], int):
            raise KeyError("Parameter element not int")

        def activate_action():
            self.element[id_parameter] += action

        if self.repeat_count > 1:
            repeat_step = kwargs["step"]
            total_step = repeat_step
            for i in range(self.repeat_count):
                time_tracker.set_plan(activate_action, total_step)
                total_step += repeat_step
        elif self.repeat_count == 1:
            activate_action()
        else:
            raise ValueError("Invalid count kwarg")


class TimeEffect (ModEffect):
    def __init__(self, game_object, id_element: str, time_settings: dict, **kwargs):
        super().__init__(game_object, id_element, **kwargs)

        time_tracker = time_settings["tracker"]
        time_tracker:controller.TimeTracker

        step = time_settings["step"]
        unit = time_settings["unit"]

        time_tracker.set_plan(self.clear, step, unit)


class Table (dict):
    scheme = {}

    def __init__(self, items=None):
        if isinstance(items, list) or isinstance(items, tuple):        
            for item in items:
                self[item] = copy.deepcopy(self.scheme)
        elif isinstance(items, dict):
            for (item, scheme) in items.items():
                self[item] = self._copy_scheme(scheme)
        elif items:
            raise TypeError("Не тот тип данных!")
    
    def _copy_scheme(self, element_scheme={}):
        scheme = {}
        scheme.update(copy.deepcopy(self.scheme))
        if element_scheme:
            scheme.update(copy.deepcopy(element_scheme))
        return scheme

    def add_item(self, item: str, element_scheme={}):
        self[item] = self._copy_scheme(element_scheme)

    def edit_item(self, item: str, parameter: str, value):
        self[item][parameter] = value
