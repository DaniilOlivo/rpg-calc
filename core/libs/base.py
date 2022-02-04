from os import path
import json

dir_config = "config"

def get_config(name_config: str):
    with open(path.join(path.dirname(__file__), dir_config, name_config), "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


class Tree(dict):
    def __init__(self, config: dict):
        self.update(config)
        self._init_config()
        
    def _init_config(self):
        for item in self:
            self[item]["mod_values"] = {}
    
    def add_mod_value(self, item: str, mod_label: str, mod_value: int):
        self[item]["mod_values"][mod_label] = mod_value
    
    def del_mod_value(self, item: str, mod_label: str):
        return self[item]["mod_values"].pop(mod_label)

    def get_value(self, item: str):
        total_value = 0
        dict_values = self[item]["mod_values"]
        for mod_value_label in dict_values:
            total_value += dict_values[mod_value_label]
        return total_value
    
    def add_config_value(self, label: str, value):
        for item in self:
            self[item][label] = value


class GroupTree(Tree):
    def __init__(self, config: dict):
        valid_dict = {}
        
        for group_label, items in config.items():
            for label, content in items.items():
                valid_dict[label] = content
                valid_dict["group"] = group_label
        
        super().__init__(valid_dict)
