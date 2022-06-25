# Части проекта
* Фротенд, клиентская часть
* Бэкенд, серверная часть
* Ядро

Общение между фронтом и бэком происходит за счет системы пакетов *(package system)*, за счет технологии *веб сокетов*.

Бэк вызывает ядро как свою сопрограмму, или по-другому, как скрипт, возращающий определенный результат

# Redux
На клиенте работает Redux, который хранит в себе игровый данные и некторые технические тонкости. Есть два хранилища:
1. Юзверьский
2. Админский

Второе хранилище является надстройкой к первому и содержит доплнительную информцию, которая, как понятно из названия, предназаначается админу.

Каждое хранилище состоит из *разделов (partition)*. Каждый раздел хранит свою часть информации. Нужно это для банального удобства взаимодействия с хранилищем.

**Разделы пользовательского хранилища:**
* globalController - хранит глобальный объект и все связанные с ним объекты
* character - хранит персонажа игрока, а точнее его копию из контроллера
* colors - хэш-таблица с цветами игроков для чатика
* user - хэш-таблица с данными пользователя, вроде его имени и прав доступа (user или admin)

**Разделы админского хранилища:**
* currentCharacter - выбранный персонаж для отображения его данных

# Сокет
Интерфейс, или же объект, отвечающий за передачу пакетов между клиентом и сервером. По сути это объект, выступающий надстройкой поверх веб сокета, добавляющий логику обработки пакетов. Сокет имеется на двух концах: на *клиенте* и *сервере*. У каждого из сокетов есть метод *dispathcer (диспетчер)*, который, в зависимости от сигнала, вызывает необходимый обработчик.

# Система пакетов (package system)
*Пакет* - это JSON сообщение, передаваемое по веб сокету, между клиентом и сервером. Каждый пакет должен иметь поле *signal*, которое говорит, что это за пакет и как его надо обрабатывать. Другими полями указывается дополнительная информация, необходимая для обработки данного пакета.

Таблица сигналов:
Сигнал | Описание | Доп. данные
--- | --- | ---
PING | Небольшой пакет для поддержания соединения веб сокета. Отправлется автоматически | - 
REGISTER | Регистрация пользователя в журнале | Имя пользователя
GET | Получить данные | -
SET | Изменить данные | Пакет изменений
SET_COLOR | Изменить цвет | Новый цвет
MESSAGE | Сообщение в чат | Сообщение

# Ядро
Логика ядра описывается в отдельной доке. Ядро представлено в виде *глобального объекта (global controller)*, содержащий в себе все игровые объекты. Глобальный контроллер сохраняется в простой таблице базы данных в байтовом формате, конвертируемого посредством pickle библиотеки python. Также в таблице сохраняется *тень объекта (JSON-shandow)* - JSON формат объекта, содержащий все его данные. Это нужно для миграций, когда код объекта изменяется, поэтому байтовый объект надо перезаписать. Данные объекта преобразуются в JSON формат и загружаются уже в новый объект.

Глобальный контроллер содержит все игровые объекты в хэш-таблице, именуемой *пространство объектов (objects space)*, где ключом каждого объекта выступает его уникальный id, уникальность которого предварительно проверяется самим контроллером. Пакеты изменений, поступащие в ядро, находят в пространстве объектов объект, к которому пришли изменения и вызывают его метод *set_change*.

Каждый объект имеет два элемента, обеспечивающие ввод и вывод данных: метод **set_change** и свойство **registry**. Метод *set_change* принимает пакет изменений (без объекта) и проводит свои операции по изменению. Результатом скрипта будет изменненый объект в глобальном контроллере, который будет разослан всем текущем юзверям. Свойство *registry* возращает хэш-таблицу, которая, гарантировано, должна будет преобразовано в JSON формат для отправки. Глобальный контроллер вызывает регистр каждого объекта и проверяет его валидность. После чего отправляет список объектов, дополненный своей технической информацией при необходимости. Таким образом получается, глобальный контроллер в отличие от других объектов не имеет своего регистра. Вместо этого он использует специальный метод *get_objects*, возращающий валидный JSON формат всех объектов. При этом контроллер имеет свой *set_change*, который ищет нужный объект и делегирует ему остаток пакета изменений.

**Формат пакета изменений:**
```
{
    game_object: {
        action: {
            *данные для действия*

            *для табличных изменений*
            id_element: {
                parameter: {
                    ...
                }
            }
        },

        ...
    },

    ...
}
```

# Админка
Не совсем корректное название, но лучше я не придумал. Ведь не только админ имеет возможность изменять данные. У пользователя есть также права на определенные действия. В любом случае результатом любого изменения является пакет изменений, формат которого прдеставлен выше. Пакет отправляется на сервер с сигналом *SET*, где попадает в ядро. Ядро проводит необходимые модификации, после чего сервер рассылает новую версию глобального контроллера.

## Game Component (GC)
На стороне клиента за формирование пакета отвечает *Game Component*. Он состовляет пакет, проверяет его валидность и шлет серверу. Кроме этого, GC предоставляет API для извлечения необходимых данных из контроллера (объекта по его id) и функции для сборки пакетов изменений. GC как и сокет глобален и существует в единсвтенном экземпляре.

## Интерфейсы
Некоторые объекты можно изменить посредством нажатия кнопок, как например, треккер времени. Другие, объекты, вроде табличных значений, преобразуются через ряд модальных окон и сложный *редактор*. *Редактор* принимает схему и элемент с которым будет работать. После валидации всех изменений, редактор вызывает API GC, чтобы тот составил пакет.