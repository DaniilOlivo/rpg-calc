import libs.player as player
import pickle
from db.character import Character

if __name__ == "__main__":
    Character.create_table()
    record = Character(name="Барак", pickle=pickle.dumps(player.Player("Барак", "Орк")))
    record.save()
