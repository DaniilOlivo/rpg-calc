from sys import argv, path
import json
from utils.jsonParser import json_parser
import pickle
from db.character import Character

from libs.player import Player

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

def sendChar(playerObj: Player):
    data = json_parser(playerObj.registry)
    print(data)

def getFlag(changesObj: dict, idFlag: str):
    flag = changesObj[idFlag]
    changesObj.pop(idFlag)
    return flag

if __name__ == "__main__":
    method = argv[1]
    argument = argv[2]

    if (method == "GET"):
        playerObj = loadPickle(argument)
        sendChar(playerObj)
    if (method == "SET"):
        changes = json.loads(argument)

        charname = getFlag(changes, "character")
        action_type = getFlag(changes, "actionSet")

        playerObj = loadPickle(charname)
        playerObj.setData(changes, action_type)

        sendChar(playerObj)

        writePickle(charname, playerObj)
