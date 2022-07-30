SYSTEM_KEYS = {"py/object", "__dict__"}

def clear_shandow(obj: dict) -> dict:
    cleaning_obj = {}

    for key, value in obj.items():
        if key in SYSTEM_KEYS:
            continue
        
        cleaning_value = value

        if isinstance(value, dict):
           cleaning_value = clear_shandow(value)
        
        cleaning_obj[key] = cleaning_value
    
    return cleaning_obj
