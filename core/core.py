from sys import argv, path
import json
import pickle
from db.character import Character

def getChar(char: str):
    return Character.get(Character.name == char)

def writePickle(char: str, player: object):
    recordChar = getChar(char)
    recordChar.pickle = pickle.dumps(player)
    recordChar.save()

def loadPickle(char: str):
    recordChar = getChar(char)
    player = pickle.loads(recordChar.pickle)
    return player


if __name__ == "__main__":
    method = argv[1]
    if (method == "GET"):
        playerObj = loadPickle(argv[2])
        data = json.dumps(playerObj.decode())
        print(data)
    if (method == "SET"):
        new_data = json.loads(argv[2])
        charname = new_data["character"]
        playerObj = loadPickle(charname)
        new_data.pop("character")
        new_data.pop("actionSet") # Временная заглушка
        playerObj.setData(new_data)
        writePickle(charname, playerObj)

        data = json.dumps(playerObj.decode())
        print(data)
