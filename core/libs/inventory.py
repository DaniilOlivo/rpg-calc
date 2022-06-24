from libs.base import GameObject
from libs.player import Player

BACKPACK_INVENTORY = "backpack"
EQUIP_INVENTORY = "equip"
ACTIVE_INVENTORY = "active"


class Inventory (GameObject):
    def __init__(self, player: Player):
        super().__init__(player.id + "_inventory")
        self.player = player
        mod_END = self.player.chars.mod("END")
        self.limit_weight = 60 + mod_END * 10
        if self.limit_weight < 30:
            self.limit_weight = 30
        
        self.weight = 0.0

        self.total_items = {}
        self.group_items = {
            BACKPACK_INVENTORY: {},
            EQUIP_INVENTORY: {},
            ACTIVE_INVENTORY: {},
        }

    @property
    def registry(self) -> dict:
        proto_dict = super().registry
        proto_dict.update({
            "weight": self.weight,
            "limit_weight": self.limit_weight,
            "total_items": self.total_items,
            "group_items": self.group_items,
        })
        return proto_dict

    def _clear_inventory(self, title: str) -> dict:
        item = None

        for inventory in self.group_items.values():
            if title in inventory:
                item = inventory.pop(title)
        
        if not item:
            raise AssertionError("{} not found in inventory".format(title))
        
        return item
    
    def add_item(self, place: str, title: str, features: dict, edit=False):
        if title in self.total_items and not edit:
            raise KeyError("Такой предмет уже существует {}".format(title))

        new_item = features

        if not "type" in features:
            raise KeyError("Not found type item {}".format(title))
        if not "weight" in features:
            raise KeyError("Not found weight parameter item {}".format(title))

        if not "desc" in features:
            new_item["desc"] = ""
        if not "number" in features:
            new_item["number"] = 1
        if not "equip" in features:
            new_item["equip"] = False
        if not "effect" in features:
            new_item["effect"] = None

        total_weight = new_item["weight"] * new_item["number"]
        self._add_weight(total_weight)

        self.total_items[title] = new_item
        if edit:
            self._clear_inventory(title)
        self.group_items[place][title] = new_item
    
    def del_item(self, title: str):
        self.total_items.pop(title)
        item = self._clear_inventory(title)
        total_weight = item["weight"] * item["number"]
        self._add_weight(-total_weight)
    
    def replace_item(self, title: str, new_place: str):
        item = self._clear_inventory(title)
        self.group_items[new_place][title] = item
        
    def _add_weight(self, value, force=False) -> float:
        if force:
            self.weight = value
        else:
            self.weight += value
        
        if self.weight > self.limit_weight:
            self.player.features.add_item("Перегруз")
        else:
            self.player.features.pop("Перегруз", None)
        
        return self.weight
