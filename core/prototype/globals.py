from hashlib import new


class TimeTracker:
    MAX_DAYS = 30
    MAX_MOUNTHS = 2
    def __init__(self, mounth=1, day=1) -> None:
        self.year = 1234
        self.mounths = ("Месяц Серпа", "Месяц Молота")

        self.map_plan = {}

        self.current_date = [mounth, day]

    def _set_date_unit(self, step: int, limit: int) -> tuple:
        grow = step // limit
        if limit == step:
            grow = 0
        difference = step - grow * limit
        return grow, difference

    def _calc_step(self, count: int):
        mounth, day = self.current_date
        
        grow, difference = self._set_date_unit(count + day, self.MAX_DAYS)
        new_day = difference
        new_mounth = mounth
        new_year = self.year
        if grow > 0:
            grow_mounths, difference_mounths = self._set_date_unit(grow + mounth, self.MAX_MOUNTHS)
            new_year += grow_mounths
            new_mounth = difference_mounths
        return new_day, new_mounth, new_year

    def _check_plan(self, day: int, mounth: int):
        for key_date, action in self.map_plan.items():
            day_plan, mounth_plan, year_plan = key_date.split(".")
            if day * mounth >= int(day_plan) * int(mounth_plan):
                action()

    def step(self, count: int):
        day, mounth, year = self._calc_step(count)
        self.current_date = mounth, day
        self.year = year
        self._check_plan(day, mounth)
    
    def set_plan(self, step_time: int, action):
        calc_date = self._calc_step(step_time)
        key_date = ".".join((str(i) for i in calc_date))
        self.map_plan[key_date] = action

    def __str__(self) -> str:
        mounth, day = self.current_date
        label_mounth = self.mounths[mounth - 1]
        return "{mounth} {day} {year} г.".format(mounth=label_mounth, day=day, year=self.year)
