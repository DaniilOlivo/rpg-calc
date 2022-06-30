import coreAPI
import jsonpickle
import json
import inspect
from sys import modules
import libs.player

KEY_JSON_CLASS = "py/object"
CACHE_CLASSES = {}


def obj_to_dict(obj: object) -> dict:
    json_obj = jsonpickle.encode(obj)
    return json.loads(json_obj)

def test_json(obj: any):
    try:
        json_format = json.dumps(obj)
        return True
    except TypeError:
        return False

def get_class(id_class: str) -> object:
    constructor_class = CACHE_CLASSES.get(id_class)
    if constructor_class:
        return constructor_class()
    else:
        segments_id_class = id_class.split('.')
        module_class = '.'.join(segments_id_class[:-1])
        for cls_name, cls_object in inspect.getmembers(modules[module_class]):
            if inspect.isclass(cls_object):
                CACHE_CLASSES['.'.join((module_class, cls_name))] = cls_object
        constructor_class = CACHE_CLASSES.get(id_class)
        if constructor_class:
            return constructor_class()
        else:
            return None

def update_json_struct(json_struct: dict) -> dict:
    dict_new_obj = json_struct
    if KEY_JSON_CLASS in json_struct:
        new_obj = get_class(json_struct[KEY_JSON_CLASS])
        dict_new_obj = obj_to_dict(new_obj)
        dict_new_obj.update(json_struct)
        
    for key, item in dict_new_obj.items():
        if isinstance(item, dict):
            dict_new_obj[key] = update_json_struct(item)
            
    return dict_new_obj
    

if __name__ == "__main__":
    controller_enity = coreAPI.get_controller()
    json_shandow = controller_enity.json_shandow
    controller_dict_object = json.loads(json_shandow)
    updated_json_shandow = json.dumps(update_json_struct(controller_dict_object))
    updated_controller = jsonpickle.decode(updated_json_shandow)
    coreAPI.write_controller(controller_enity, updated_controller)
