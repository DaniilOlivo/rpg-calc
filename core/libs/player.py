from base import Tree, GroupTree, get_config

class CharTable (Tree):
    def __init__(self):
        config = get_config("chars.json")
        super().__init__(config)
    

class SkillTable (GroupTree):
    def __init__(self, level=0, xp=0):
        super().__init__("data/skills.json")

        self.add_config_value("level", 0)
        self.add_config_value("xp", 0)
        self.add_config_value("xp_limit", 0)


class Player:
    file_races = "data/race.json"

    def __init__(self,
        name: str,
        race: str,
        chars=CharTable(),
        skills=SkillTable(),
        **options
        ):

        self.name = name

        self.race = self.get_race(race)
        self.race_title = self.race["title"]

        if "level" in options:
            self.level = options["level"]
        else:
            self.level = 1
        self.xp = 0

        self.chars = chars
        self.skills = skills

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
        races = Tree.read_json(self.file_races)

        for race in races:
            if race["title"] == title:
                return race

        raise ValueError("Не найдено заданной расы :(") 

    def __str__(self):
        return self.name