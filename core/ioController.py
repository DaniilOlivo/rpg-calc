import pickle
from os import path

class IO_Controller:
    extension = ".pickle"
    def __init__(self, save_directory: str):
        self.save_directory = path.abspath(save_directory)

    def get_path(self, name_file):
        return path.join(self.save_directory, name_file + self.extension)
    
    def write(self, name_file: str, obj: object):
        with open(self.get_path(name_file), "wb") as f:
            pickle.dump(obj, f)
    
    def load(self, name_file: str):
        with open(self.get_path(name_file), "rb") as f:
            data = pickle.load(f)
        return data
