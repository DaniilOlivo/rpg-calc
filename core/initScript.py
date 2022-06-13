import libs.player as player
import pickle
from db.character import Character

if __name__ == "__main__":
    Character.drop_table()
    Character.create_table()
    barak = player.Player("Барак", "Орк", {
        "STR": 20,
        "END": 17,
        "AGL": 6,
        "REF": 6,
        "INT": 2,
        "WIL": 10,
        "CHR": 10,
    })
    kochan = player.Player("Чан Кочан", "Человек", {
        "STR": 8,
        "END": 10,
        "AGL": 16,
        "REF": 15,
        "INT": 10,
        "WIL": 15,
        "CHR": 7,
    })
    Character(name="Барак", pickle=pickle.dumps(barak)).save()
    Character(name="Чан Кочан", pickle=pickle.dumps(kochan)).save()
