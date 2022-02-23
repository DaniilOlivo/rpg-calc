import libs.player as player
import pickle
from db.character import Character

def createCharacter(name: str, race: str, chars: dict):
    new_player = player.Player(name, race, player.CharTable(chars))
    record = Character(name=name, pickle=pickle.dumps(new_player))
    record.save()
    return record

if __name__ == "__main__":
    Character.create_table()
    createCharacter("Эндрю Брант", "Человек", {
        "STR": 7,
        "END": 6,
        "AGL": 10,
        "REF": 14,
        "INT": 16,
        "WIL": 16,
        "CHR": 6,
    })
    createCharacter("Джон Королев", "Человек", {
        "STR": 15,
        "END": 14,
        "AGL": 12,
        "REF": 9,
        "INT": 11,
        "WIL": 9,
        "CHR": 9,
    })
    
