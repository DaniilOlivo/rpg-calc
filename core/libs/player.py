from libs.base import Tree, ModValues, DynamicTree, get_config

class ParamTable (Tree):
    def __init__(self):
        super().__init__()
        self.params = ("hp", "mp", "sp", "hunger", "fatigue")
        self.add_items(self.params)

        self.add_key("max", 0)
        self.add_key("current", 0)
    
    def full(self, param=None):
        if param:
            items = (param)
        else:
            items = self.params
        
        for item in items:
            self[item]["current"] = self[item]["max"]


class CharTable (ModValues):
    def __init__(self, mapChar={}):
        config = get_config("chars.json")
        super().__init__(config)
        if mapChar:
            self.update_base_values(mapChar)


class EffectsTable (DynamicTree):
    def __init__(self):
        super().__init__()

        self.units = {
            "logic": ("turn", "hour", "day"),
            "alias": ("Ход", "Час", "День",)
        }

        self.add_key("shade", "neutral")
        self.add_key("timeNumber", 1)
        self.add_key("timeUnit", "turn")
        self.add_key("timeUnitAlias", "ход")
    
    def translate(self, item: str):
        value = self[item]["timeUnit"]
        index = self.units["logic"].index(value)
        self[item]["timeUnitAlias"] = self.units["alias"][index]
    
    def add_item(self, item, **keys):
        super().add_item(item)
        for key, value in keys.items():
            self[item][key] = value
        self.translate(item)


class FeaturesTable (DynamicTree):
    def __init__(self):
        super().__init__()
        self.add_key("desc", "")
    
    def add_item(self, item, desc: str):
        super().add_item(item)
        self[item]["desc"] = desc


class Player:
    file_races = "race.json"

    def __init__(self,
        name: str,
        race: str,
        chars=CharTable(),
        **options
        ):

        self.name = name

        self.race = self._get_race(race)
        self.race_title = self.race["title"]
        self.speed = self.race["speed"]

        self.chars = chars 
        
        for char, value in self.race["chars"].items():
            self.chars.add_mod_value(char, "Раса", value)

        self.params = ParamTable()
        self.effects = EffectsTable()
        self.features = FeaturesTable()

        self.calc()
        self.params.full()
        

    def calc(self):
        self._calc_params()

    def _calc_params(self):
        base = 5
        endurance = self.chars.get_value("END")
        willpower = self.chars.get_value("WIL")
        
        self.params["hp"]["max"] = base + endurance
        self.params["mp"]["max"] = base + willpower
        self.params["sp"]["max"] = base + (willpower + endurance) / 2

        if (endurance > 10):
            base += 1
        elif (endurance <= 5):
            base -= 1
        
        self.params["hunger"]["max"] = base
        self.params["fatigue"]["max"] = base

    def _get_race(self, title: str):
        races = get_config(self.file_races)
        for race in races:
            if race["title"] == title:
                return race

        raise ValueError("Не найдено заданной расы :(") 

    def __str__(self):
        return self.name

    def decode(self):
        return {
            "charMain": {
                "name": self.name,
                "race": self.race_title,
                "params": self.params,
                "chars": self.chars,
                "effects": self.effects,
                "features": self.features
            }
        }