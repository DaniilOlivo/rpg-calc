from libs.base import Tree, get_config

class CharTable (Tree):
    def __init__(self):
        config = get_config("chars.json")
        super().__init__(config)
    

class Player:
    file_races = "race.json"

    def __init__(self,
        name: str,
        race: str,
        chars=CharTable(),
        **options
        ):

        self.name = name

        self.race = self.get_race(race)
        self.race_title = self.race["title"]

        self.chars = chars
        
        for char, value in self.race["chars"].items():
            self.chars.add_mod_value(char, "Раса", value)

        self._init_param()
        self._init_needs()

    def _init_param(self):
        base = 5

        endurance = self.chars.get_value("Выносливость")
        willpower = self.chars.get_value("Сила воли")
        
        self.hp_max = base + endurance
        self.mp_max = base + willpower
        self.sp_max = base + (willpower + endurance) / 2

        self.hp = self.hp_max
        self.mp = self.mp_max
        self.sp = self.sp_max

        self.speed = self.race["speed"]

    def _init_needs(self):
        self.need_eat_max = 5
        self.need_sleep_max = 5

        endurance = self.chars.get_value("Выносливость")

        if (endurance > 10):
            self.need_eat_max += 1
            self.need_sleep_max += 1
        elif (endurance <= 5):
            self.need_eat_max -= 1
            self.need_sleep_max -= 1
        
        self.need_eat = self.need_eat_max
        self.need_sleep = self.need_sleep_max

    def get_race(self, title: str):
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
                "params": {
                    "hp": self.hp,
                    "maxHp": self.hp_max,
                    "sp": self.sp,
                    "maxSp": self.sp_max,
                    "mp": self.mp,
                    "maxMp": self.mp_max,
                    "hunger": self.need_eat,
                    "maxHunger": self.need_eat_max,
                    "fatigue": self.need_sleep,
                    "maxFatigue": self.need_sleep_max
                }
            }
        }