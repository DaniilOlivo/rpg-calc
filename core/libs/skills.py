import libs.base as base


class SkillTable (base.Table):
    BASE_REQUIRE_XP = 10

    scheme = {
        "title": "",
        "desc": "",
        "level": 0,
        "xp": 0,
        "require_xp": BASE_REQUIRE_XP,
    }

    def __init__(self, map_values={}):
        config = base.get_config("skills.json")
        super().__init__(config)

        for item, value in map_values.items():
            if not item in self:
                raise IndexError("Not found skill {}".format(item))
            skill = self[item]
            skill["level"] = value
            skill["require_xp"] = self._calc_require_xp(value)
    
    def _calc_require_xp(self, level: int) -> int:
        return self.BASE_REQUIRE_XP + level
    
    def level_up(self, item: str) -> int:
        skill = self[item]
        skill["level"] += 1
        skill["xp"] = 0
        skill["require_xp"] = self._calc_require_xp(skill["level"])

    def edit_item(self, item: str, parameter: str, value):
        super().edit_item(item, parameter, value)
        if parameter == "xp":
            if value >= self[item]["require_xp"]:
                self.level_up(item)
