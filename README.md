### Предметная область:

Существует некоторая крупная организация.
Физически эта организация располагается в нескольких зданиях, каждое здание состоит из комнат.
В каждой комнате может располагаться некоторое оборудование.


### Задача:

Необходимо создать клиент приложения, для просмотра редактирования оборудования в зданиях компании.
Приложение состоит из двух панелей - в левой части можно будет просмотреть иерархию зданий/комнат, а в
правой части – просмотреть имеющееся в этом здании или комнате оборудование. При выборе комнаты
справа отображается оборудование комнаты, при выборе здания – оборудование всех его комнат. Комнаты
здания описаны в виде иерархической структуры, где есть этажи, крылья и т.д. (см. пример тестовых данных).
Возле каждого здания и комнаты в левой части следует располагать индикатор, находится ли в нем/ней
оборудование.
Оборудование характеризуется наименованием и количеством. Должна быть возможность работать с
оборудованием в выбранной комнате: добавлять, редактировать, удалять.


### Подзадачи: 
+ **Отображение иерархии зданий и комнат.** Загрузить с сервера и отобразить дерево зданий и комнат.
Обеспечить возможность выбора зданий и комнат щелчком мышью.

+ **Отображение оборудования.** При выборе комнаты показывать оборудование для этой комнаты в
правой панели. Показывать значок рядом с именем здания/комнаты, есть ли оборудование именно в
выбранной комнате.

+ **Отображение оборудования в зданиях, этажах и т.д.** При выборе здания, этажа, крыла - показывать
оборудование, которое есть в выбранном узле, так в дочерних.

+ **Редактирование оборудования.** Если выбрана комната, которая не имеет дочерних узлов (не этаж, не
крыло), то обеспечить возможность добавлять, редактировать и удалять оборудование.


### Решение: 
[Публикация результата в сервисе Github Pages](https://ivanpeleshok.github.io/docsvision-db-task/database)
