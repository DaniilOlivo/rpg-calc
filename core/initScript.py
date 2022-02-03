import libs.player as player
from ioController import IO_Controller

if __name__ == "__main__":
    test = player.Player("Барак", "Орк")
    IO_Controller("players").write("Барак", test)
