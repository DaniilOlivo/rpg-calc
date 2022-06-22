from os import path
import json
import copy

dir_config = "config"

def get_config(name_config: str):
    with open(path.join(path.dirname(__file__), dir_config, name_config), "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


class GameObject:
    def __init__(self, id_object: str):
        self.id = id_object
    
    @property
    def registry(self) -> dict:
        return {
            "id": self.id,
        }
    
    def set_change(self, package_change: dict):
        pass


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
