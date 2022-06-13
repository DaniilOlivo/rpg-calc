class Skill:
    BASE_REQUIRE_XP = 10
    GROW_REQUIRE_XP = 2


    def __init__(self, title: str, **init_params):
        self.title = title
        self.level = init_params.get("level", 1)
        self.xp = init_params.get("xp", 0)
        xp_require = self.BASE_REQUIRE_XP + (self.level - 1) * self.GROW_REQUIRE_XP
        self.xp_require = init_params.get("xp_require", xp_require)
    
    def level_up(self) -> int:
        self.level += 1

        self.xp = 0
        self.xp_require += self.GROW_REQUIRE_XP

        return self.level
    
    def set_xp(self, value: int):
        self.xp = value
        if (self.xp >= self.xp_require):
            self.level_up()

