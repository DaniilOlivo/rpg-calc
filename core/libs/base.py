from os import path
import json

dir_config = "config"

def get_config(name_config: str):
    with open(path.join(path.dirname(__file__), dir_config, name_config), "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


class Tree(dict):
    def __init__(self, config={}):
        if config:
            self.update(config)

    def add_items(self, items: tuple):
        for item in items:
            self[item] = {}
    
    def add_key(self, key: str, value):
        for item in self:
            self[item][key] = value


class DynamicTree(Tree):
    def __init__(self, config={}):
        super().__init__(config)
        self.defaultKeys = []
    
    def add_key(self, key, value):
        self.defaultKeys.append((key, value))
        super().add_key(key, value)

    def add_item(self, item):
        new_item = {}
        for key, value in self.defaultKeys:
            new_item[key] = value
        self[item] = new_item


class ModValues(Tree):
    def __init__(self, config):
        super().__init__(config)
        for item in self:
            self[item]["mod_values"] = {}
        self.add_key("base_value", 0)

    def update_base_values(self, mapValues: dict):
        for item, value in mapValues.items():
            self[item]["base_value"] = value

    def add_mod_value(self, item: str, mod_label: str, mod_value: int):
        self[item]["mod_values"][mod_label] = mod_value
    
    def del_mod_value(self, item: str, mod_label: str):
        return self[item]["mod_values"].pop(mod_label)

    def get_value(self, item: str):
        total_value = self[item]["base_value"]
        dict_values = self[item]["mod_values"]
        for mod_value_label in dict_values:
            total_value += dict_values[mod_value_label]
        return total_value


class GroupTree(Tree):
    def __init__(self, config: dict):
        valid_dict = {}
        
        for group_label, items in config.items():
            for label, content in items.items():
                valid_dict[label] = content
                valid_dict["group"] = group_label
        
        super().__init__(valid_dict)
