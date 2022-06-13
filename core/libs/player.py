from libs.base import get_config, ModSystem, Effect, Table
import utils.findRecursion as find


class ParamTable (Table):
    params = ("hp", "mp", "sp", "hunger", "fatigue")

    scheme = {
        "max": ModSystem(),
        "current": 0
    }

    def __init__(self):
        super().__init__(self.params)
    
    def full(self, param=None):
        if param:
            items = [param]
        else:
            items = self.params
        
        for item in items:
            self[item]["current"] = self[item]["max"].value


class CharTable (Table):
    scheme = {
        "value": ModSystem()
    }

    def __init__(self, mapBase={}):
        config = get_config("chars.json")
        super().__init__(config)
        
        if mapBase:
            for (item, base) in mapBase.items():
                if not item in self:
                    raise IndexError("Нет такой сущности!")
                self[item]["value"].base = base


class EffectsTable (Table):
    units = {
        "logic": ("turn", "hour", "day"),
        "alias": ("Ход", "Час", "День",)
    }

    scheme = {
        "desc": "",
        "shade": "neutral",
        "timeNumber": 1,
        "timeUnit": "turn",
        "timeUnitAlias": "Ход"
    }
    
    def translate(self, item: str):
        value = self[item]["timeUnit"]
        index = self.units["logic"].index(value)
        self[item]["timeUnitAlias"] = self.units["alias"][index]
    
    def add_item(self, item: str, element_scheme={}):
        super().add_item(item, element_scheme)
        self.translate(item)


class FeaturesTable (Table):
    scheme = {
        "desc": ""
    }


class Player (dict):
    file_races = "race.json"

    def __init__(self,
        name: str,
        race: str,
        chars: dict,
        **options
        ):

        self.name = name

        self.race = self._get_race(race)
        self.race_title = self.race["title"]
        self.speed = ModSystem(self.race["speed"])

        self.chars = CharTable(chars)
        
        for char, value in self.race["chars"].items():
            self.chars[char]["value"].set_mod("Раса", value, readonly=True)

        self.params = ParamTable()

        self.effects = EffectsTable()
        self.features = FeaturesTable()

        self.calc()
        self.params.full()

    @property    
    def registry(self) -> dict:
        return {
            "charMain": {
                "name": self.name,
                "race": self.race_title,
                "speed": self.speed,
                "params": self.params,
                "chars": self.chars,
                "effects": self.effects,
                "features": self.features
            }
        }

    def calc(self):
        self._calc_params()

    def _calc_params(self):
        base = 5
        endurance = self.chars["END"]["value"].value
        willpower = self.chars["WIL"]["value"].value
        
        stoic = base
        if (endurance > 10):
            stoic += 1
        elif (endurance <= 5):
            stoic -= 1
        
        params = {
            "hp": endurance,
            "sp": willpower,
            "mp": (willpower + endurance) / 2,
            "hunger": stoic,
            "fatigue": stoic
        }
        for param, bonus in params.items():
            mod_system =  self.params[param]["max"]
            mod_system.base = base
            mod_system.set_mod("Характеристики", bonus, readonly=True)
        

    def _get_race(self, title: str):
        races = get_config(self.file_races)
        for race in races:
            if race["title"] == title:
                return race

        raise ValueError("Не найдено заданной расы :(")

    

    def setData(self, data: dict, action_type: str):
        for id_element, changes_element in data.items():
            result = find.findRecursion(id_element, self.registry)
            if result == find.EMPTY:
                raise KeyError("Невозможно изменить данные! Нет данного ключа {}".format(key))

            table, scheme_elemenet = result
            for parameter, change in changes_element.items():
                # Если изменнеия комплексные, то значит это сложный объект по типу ModSystem
                if isinstance(change, dict):
                    complex_value = scheme_elemenet[parameter]
                    self._set_complex(complex_value, change, action_type)
                # Простые изменения
                else:
                    self._set_simple(scheme_elemenet, parameter, change)

        self.calc()
    
    def _set_simple(self, scheme_element: dict, parameter: str, change):
        try:
            scheme_element[parameter] = int(change)
        except:
            scheme_element[parameter] = change

    def _set_complex(self, complex_value: ModSystem, change: dict, action_type: str):
        label = change["label"]
        if action_type != "DEL":
            if "value" in change:
                value = int(change["value"])
            else:
                value = int(complex_value.mod_values[label])
        
        if action_type in ("EDIT", "DEL"):
            readonly = complex_value.mod_settings[label]
            if readonly:
                return

        if action_type == "ADD":
            complex_value.set_mod(label, value)
        elif action_type == "EDIT":
            complex_value.del_mod(label)
            newLabel = label
            if "newLabel" in change:
                newLabel = change["newLabel"]
            complex_value.set_mod(newLabel, value)
        elif action_type == "DEL":
            complex_value.del_mod(label)
        else:
            raise AssertionError("Нет такого action - {}".format(action_type))
        

    def __str__(self):
        return self.name
