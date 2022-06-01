class Player:
    def __init__(self, **kwargs) -> None:
        self.name = kwargs.get("name", "Поркчоп")
        
        strenght = kwargs.get("STR", 0)
        endunace = kwargs.get("END", 0)
        self.chars = {
            "STR": {
                "value": strenght,
                "desc": "Это сила"
            },
            "END": {
                "value": endunace,
                "desc": "Это выносливость, или живучесть, если вам удобно"
            }
        }

        self.params = {
            "hp": {
                "current": 20,
                "max": 20
            }
        }

    @property
    def registry(self) -> dict:
        return {
            "chars": self.chars,
            "params": self.params
        }
