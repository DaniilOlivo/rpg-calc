import libs.base as base
from libs.skills import SkillTable
import utils.findRecursion as find


class ParamTable (base.Table):
    params = ("hp", "mp", "sp", "hunger", "fatigue")

    scheme = {
        "max": base.ModSystem(),
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
    
    def change_current(self, item: str, difference: int) -> int:
        param = self[item]
        param["current"] += difference

        param_current = param["current"]
        param_max = param["max"].value

        if param_current < 0:
            param["current"] = 0
        elif param_current > param_max:
            param["current"] = param_max

        return param["current"]


class CharTable (base.Table):
    scheme = {
        "value": base.ModSystem()
    }

    def __init__(self, mapBase={}):
        config = base.get_config("chars.json")
        super().__init__(config)
        
        if mapBase:
            for (item, base_item) in mapBase.items():
                if not item in self:
                    raise IndexError("Нет такой сущности!")
                self[item]["value"].base = base_item
    
    def mod(self, item: str) -> int:
        return int((self[item]["value"].value - 10) / 2)


class EffectsTable (base.Table):
    units = {
        "logic": ("turn", "hour", "day"),
        "alias": ("Ход", "Час", "День",)
    }

    scheme = {
        "effect": None,
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


class FeaturesTable (base.Table):
    scheme = {
        "effect": None,
        "desc": ""
    }


class Player (base.GameObject):
    MAX_DEGREE_EXHAUSTION = 6

    _file_races = "race.json"

    def __init__(self, id_player="player", **config):
        super().__init__(id_player)
        self.name = config.get("name", "player")
        self.race = self._get_race(config.get("race", "Человек"))
        self.bio = config.get("bio", "")

        self.chars = CharTable(config.get("chars", {}))
        for char, value in self.race["chars"].items():
            self.chars[char]["value"].set_mod("Раса", value, readonly=True)

        self.params = ParamTable()

        self.effects = EffectsTable()
        self.features = FeaturesTable()

        self.skills = SkillTable(config.get("skills", {}))

        self.destiny = config.get("destiny", 0)

        self.degree_exhaustion = config.get("exhaustion", 0)

        self.calc()
        self.params.full()

    @property    
    def registry(self) -> dict:
        proto_dict = super().registry
        proto_dict.update({
            "charMain": {
                "name": self.name,
                "race": self.race["title"],
                "bio": self.bio,
                "params": self.params,
                "chars": self.chars,
                "effects": self.effects,
                "features": self.features
            },

            "charSkills": {
                "skills": self.skills,
            }
        })
        return proto_dict

    def calc(self):
        self._calc_params()
    
    def step_time(self, difference: int):
        self._calc_needs(difference)

    def _calc_params(self):
        base = 5
        endurance = self.chars["END"]["value"].value
        willpower = self.chars["WIL"]["value"].value
        
        stoic = 0
        if (endurance > 15):
            stoic += 1
        elif (endurance < 5):
            stoic -= 1
        
        params = {
            "hp": endurance,
            "sp": (willpower + endurance) / 2,
            "mp": willpower,
            "hunger": stoic,
            "fatigue": stoic
        }
        for param, bonus in params.items():
            mod_system =  self.params[param]["max"]
            mod_system.base = base
            mod_system.set_mod("Характеристики", bonus, readonly=True)
        
        if self.params["hp"] == 0:
            self.features.add_item("Без сознания")
        else:
            self.features.pop("Без сознания", None)
    
    def _set_exhaustion(self, degree: int):
        if self.degree_exhaustion > 0:
            self.features.pop("Истощение {} степени".format(self.degree_exhaustion))
        
        self.degree_exhaustion += degree

        if self.degree_exhaustion > self.MAX_DEGREE_EXHAUSTION:
            self.degree_exhaustion = self.MAX_DEGREE_EXHAUSTION

        if self.degree_exhaustion > 0:
            self.features.add_item("Истощение {} степени".format(self.degree_exhaustion))

    def _calc_needs(self, difference: int):
        needs = ("hunger", "fatigue")

        for day in range(difference):
            flag_exhaustion = True
            for need in needs:
                value_need = self.params[need]["current"]
                if value_need == 0:
                    self._set_exhaustion(+1)
                    flag_exhaustion = False
                else:
                    self.params.change_current(need, -1)
                    
            if self.degree_exhaustion != 0 and flag_exhaustion:
                        self._set_exhaustion(-1)
        
    def _get_race(self, title: str):
        races = base.get_config(self._file_races)
        for race in races:
            if race["title"] == title:
                return race

        raise ValueError("Not found race {}".format(title))
    
    def _change_table(self, id_element: str, change: dict, action: str):
        result = find.findRecursion(id_element, self.registry)
        if result == find.EMPTY:
            raise KeyError("Not found element {}".format(id_element))
        
        table, element = result
        for parameter, change_parameter in change.items():
            if action.startswith("MOD_"):
                complex_value = element[parameter]
                next_action = action[action.find('_') + 1:]
                self._set_complex(complex_value, change_parameter, next_action)
            else:
                table.edit_item(id_element, parameter, change_parameter)


    def set_change(self, package_change: dict):
        for action, change in package_change.items():
            action:str
            change:dict
            if action.startswith("TABLE_"):
                for id_element, subchange in change.items():
                    next_action = action[action.find('_') + 1:]
                    self._change_table(id_element, subchange, next_action)
            else:
                raise KeyError("Action {} undifined".format(action))

        self.calc()
    
    def _set_complex(self, complex_value: base.ModSystem, change: dict, action_type: str):
        label = change["label"]
        if action_type != "DEL":
            value = change["value"]
        
        if action_type in ("EDIT", "DEL"):
            readonly = complex_value.mod_settings[label]
            if readonly:
                return

        if action_type == "ADD":
            complex_value.set_mod(label, value)
        elif action_type == "EDIT":
            complex_value.del_mod(label)
            complex_value.set_mod(change["newLabel"], value)
        elif action_type == "DEL":
            complex_value.del_mod(label)
        else:
            raise AssertionError("Нет такого action - {}".format(action_type))
        
    def __str__(self):
        return self.name
