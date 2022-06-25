import json
from libs.base import ModSystem

class ExtendEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ModSystem):
            return obj.registry
        else:
            return super().default(obj)

def json_parser(obj):
    return json.dumps(obj, cls=ExtendEncoder)
    
