from sys import argv
import libs.player as player
from ioController import IO_Controller

def getData(name_char: str):
    io_controller = IO_Controller("players")
    player = io_controller.load(name_char)
    return player.decode()

if __name__ == "__main__":
    if (argv[1] == "GET"):
        data = getData(argv[2])
        print(data)
