import json
import libs.player as player

class ExtendEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, player.ModSystem):
            return obj.registry
        else:
            return super().default(obj)

def json_parser(obj):
    return json.dumps(obj, cls=ExtendEncoder)
    
