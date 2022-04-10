EMPTY = "EMPTY"

def findRecursion(target: str, obj: dict):
    for [key, value] in obj.items():
        if (key == target):
            return (obj, value)
        
        if isinstance(value, dict):
            result = findRecursion(target, value)
            if not result == EMPTY:
                return result
        
    return EMPTY