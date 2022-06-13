class GlobalController:
    def __init__(self):
        pass


class TimeTracker:
    MAX_MOUNTHS = 12
    MAX_DAYS = 30
    MAX_HOURS = 24

    def __init__(self, **init_parameters):
        self.current_data = {
            "year": init_parameters.get("year", 1234),
            "mounth": init_parameters.get("mounth", 0),
            "day": init_parameters.get("day", 0),
            "hour": init_parameters.get("hour", 0)
        }

        self._limit_data = {
            "mounth": self.MAX_MOUNTHS,
            "day": self.MAX_DAYS,
            "hour": self.MAX_HOURS,
        }

        self._seq_date = ("hour", "day", "mounth", "year")
        self._mod_date = {"hour": 1, "day": 24, "mounth": 720, "year": 8640}

        self.map_plan = {}
        self.stack_subcribes = []

    def _set_date_unit(self, num: int, unit: str):
        limit = self._limit_data[unit]
        grow = num // limit

        difference = num - grow * limit
        return grow, difference

    def _calc_step(self, step: int, unit='hour') -> dict:
        calc_date = {}

        current_unit = self.current_data[unit]

        if unit == "year":
            calc_date[unit] = current_unit + step
            return calc_date
        
        grow, difference = self._set_date_unit(current_unit + step, unit)

        calc_date[unit] = difference

        if grow > 0:
            index_top_unit = self._seq_date.index(unit) + 1
            top_unit = self._seq_date[index_top_unit]

            calc_date.update(self._calc_step(grow, top_unit))

        return calc_date

    def _check_plan(self, date: dict):
        for key_date, stack_actions in self.map_plan.items():
            target_hours = self._get_hours_date(date)
            if target_hours >= key_date:
                for action in stack_actions:
                    action()

    def set_plan(self, action, step_time: int, unit="hour"):
        calc_date = self._calc_step(step_time, unit)
        key_date = self._get_hours_date(calc_date)

        stack_date = self.map_plan.get(key_date)
        if stack_date:
            stack_date.append(action)
        else:
            self.map_plan[key_date] = [action,]
        
    def subscribe(self, func_subcribe):
        self.stack_subcribes.append(func_subcribe)
    
    def unsubscribe(self, func_subcribe):
        self.stack_subcribes.remove(func_subcribe)

    def _call_subscribes(self, step: int, unit: str):
        difference_days = self._translate_unit(step, unit, "day")
        for subscribe in self.stack_subcribes:
            subscribe(difference_days)

    def step(self, count: int, unit="hour"):
        new_date = self._calc_step(count, unit)
        self.current_data.update(new_date)
        self._check_plan(new_date)
        self._call_subscribes(count, unit)

    def _get_hours_date(self, date: dict) -> int:
        hours = 1
        for unit in date.values():
            hours *= unit
        return hours
    
    def get_str_date(self, date: dict) -> str:
        return "{hour}:00 {day}.{mounth}.{year}".format(
            hour=date["hour"],
            day=date["day"] + 1,
            mounth=date["mounth"] + 1,
            year=date["year"],
        )
    
    def _translate_unit(self, count: int, source_unit: str, target_unit: str):
        hours = self._mod_date[source_unit] * count
        return int(hours / self._mod_date[target_unit])

    def __str__(self) -> str:
        return self.get_str_date(self.current_data)
