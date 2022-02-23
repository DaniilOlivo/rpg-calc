import libs.player as player
import pickle
from db.character import Character

if __name__ == "__main__":
    Character.drop_table()
    Character.create_table()
    barak = player.Player("Барак", "Орк", player.CharTable({
        "STR": 20,
        "END": 17,
        "AGL": 6,
        "REF": 6,
        "INT": 2,
        "WIL": 10,
        "CHR": 10,
    }))
    recordChar = Character(name="Барак", pickle=pickle.dumps(barak))
    recordChar.save()
