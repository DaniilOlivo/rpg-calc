from matplotlib import pyplot as plt
import random as rand
from skills import Skill

levels = range(50)

xp = [Skill("Навык", level=i+1).xp_require for i in levels]
learning_book = [xp[i] / rand.randint(1, 4) / 2 for i in levels]
learning_book_boost = [xp[i] / (rand.randint(1, 4) + 5) / 2 for i in levels]

learning_teacher = [xp[i] / (rand.randint(1, 4) + 3) for i in levels]
learning_teacher_pro = [xp[i] / (rand.randint(1, 4) + 7) for i in levels]
learning_teacher_master = [xp[i] / (rand.randint(1, 4) + 14) for i in levels]

def create_plot(id: int, title: str, xlabel: str, ylabel: str, data: list[tuple]):
    plt.subplot(1, 2, id)
    plt.title(title)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)

    for axis_x, axis_y in data:
        plt.plot(axis_x, axis_y)

create_plot(1, "Зависимость опыта от уровня", "Уровень", "Опыт", [(levels, xp)])
create_plot(2, "Опыт по книгам", "Уровень", "Дней", [
    (levels, learning_book),
    (levels, learning_book_boost),
    (levels, learning_teacher),
    (levels, learning_teacher_pro),
    (levels, learning_teacher_master)
])


plt.show()
