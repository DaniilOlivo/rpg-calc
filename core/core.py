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
    if (argv[1] == "GET"):
        playerObj = loadPickle(argv[2])
        data = json.dumps(playerObj.decode())
        print(data)
