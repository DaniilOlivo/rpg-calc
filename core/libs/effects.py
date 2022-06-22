import utils.findRecursion as find
import libs.env as env
import libs.base as base


class Effect:
    def __init__(self, game_object, id_element: str, desc=""):
        registry = game_object.registry
        result = find.findRecursion(id_element, registry)
        if result == find.EMPTY:
            raise KeyError("ID элемента в регистре не найден")
        table, element = result

        self.desc = desc

        self.element = element
        self.table = table
    
    def _get_parameter(self, id_parameter: str):
        return self.element[id_parameter]

    @property
    def registry(self):
        return {
            "desc": self.desc
        }

    def __str__(self) -> str:
        return self.desc

    def __repr__(self) -> str:
        return self.__str__()


MOD_EFFECT = "Модификаторный эффект (постояный)"

class ModEffect (Effect):
    def __init__(self, game_object, id_element: str, **kwargs):
        super().__init__(game_object, id_element)
        self.settings = kwargs
        self.parameter = self._get_parameter(kwargs["parameter"])
        self.parameter:base.ModSystem

        if not isinstance(self.parameter, base.ModSystem):
            raise KeyError("Type parameter not valid")
    
    def activate(self):
        settings = self.settings
        self.parameter.set_mod(settings["label"], settings["value"])
    
    def clear(self):
        self.parameter.del_mod(self.settings["label"])

    @property
    def registry(self):
        proto_dict = super().registry
        proto_dict.update(self.settings)
        return proto_dict

    def __del__(self):
        self.clear()


ACTION_EFFECT = "Цикл эффект"

class ActionEffect (Effect):
    def __init__(self, game_object, id_element: str, time_tracker: env.TimeTracker, **kwargs):
        super().__init__(game_object, id_element)

        self.repeat_count = kwargs.get("count", 1)
        repeat_step = 0

        action = kwargs["action"]
        id_parameter = kwargs["parameter"]

        if not isinstance(self.element[id_parameter], int):
            raise KeyError("Parameter element not int")
        
        if not isinstance(action, int):
            raise KeyError("Action not int")

        def activate_action():
            self.element[id_parameter] += action

        if self.repeat_count > 1:
            repeat_step = kwargs["step"]
            total_step = repeat_step
            for i in range(self.repeat_count):
                time_tracker.set_plan(activate_action, total_step)
                total_step += repeat_step
        elif self.repeat_count == 1:      
            activate_action()
        else:
            raise ValueError("Invalid count kwarg")


MOD_TIME_EFFECT = "Модификаторный эффект (временный)"

class TimeEffect (ModEffect):
    def __init__(self, game_object, id_element: str, time_settings: dict, **kwargs):
        super().__init__(game_object, id_element, **kwargs)
        self.time_settings = time_settings
        self.time_tracker = time_settings["tracker"]
        self.time_tracker:env.TimeTracker
    
    def activate(self):
        super().activate()
        time_settings = self.time_settings
        self.time_tracker.set_plan(self.clear, time_settings["step"], time_settings["unit"])


MAP_EFFECTS = {
    MOD_EFFECT: ModEffect,
    ACTION_EFFECT: ActionEffect,
    MOD_TIME_EFFECT: TimeEffect,
}
