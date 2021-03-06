Telegram Quest Bot
==================
Бот для квестов в телеграмме

Установка
---------

```bash
git clone git@bitbucket.org:onequest/quest.git
npm install
cp knexfile.sample.json knexfile.json
cp config/config.sample.json config/config.json
```
Затем вносим необходимые данные в файлы настроек
(токен телеграмма, пароль от СУБД и так далее) и
```bash
npm run migrate-up
npm start
```

Архитектура
-----------
**resolvers** - всякие чёрные ящики, которые в ответ на обстановку могут генерить числа, обозначающие выходные маршруты.

**checkers** - похожая штука, которая занимается тем, что проверяет, доступны ли пользователю возможные на этом этапе действия. Возвращает 0 или 1. Логично было бы сделать boolean, но часто бывает, что нужно добавить какой-то третий статус, и возникает облом... Так что int :)

Всё остальное свалено в кучу в индексном файле без всякой логики (пока что).

СУБД
----

**users** - собственно табличка со всеми доступными данными пользователей.
В том числе там есть текущий квест, на который пользователь попадает
при нажатии /start.

**quests** - табличка квестов из предположения, что их может быть много.
Пока он один.

**stages** - этапы квестов. Грубо говоря - экраны.
У них есть описание и картинка в табличке **stage_image**.

**user_quest** - табличка, которая содержит информацию о том,
 на каком этапе каждого квеста остановился каждый пользователь
 (опять же из предположения о том, что пользователь может проходить
  параллельно множество квестов).

**items** - некие предметы, которые может побирать и использовать
пользователь в квестах.

**user_items** это связка предметов и пользователей.

**stage_actions** - доступные действия на каждом этапе. Они включают в себя resolvers,
 которые выплёвывают некий номер маршрута. Если модуля нет, то маршрут берётся равный полю choice.
  
Так же в stage_actions есть некие checkers, которые проверяют, может ли пользователь это действие свершить
 (если нет - то оно не показывается).
Ещё там есть дополнительные поля resolver_extra_id и checker_extra_id,
 которые могут передаваться модулям и чекерам.

**stage2stage** - собственно описывает логику перехода между экранами,
 руководствуясь значением маршрута, которое было получено из модулей или поля choise в stage_actions.

**resolvers** - имя и описание этих чёрных ящиков, которые реализованы на сервере.

**checkers** - имя и описание алгоритмов проверки, которые реализованы на сервере.

Тесты
-----
Они есть, они работают, их надо делать больше и лучше. Для них есть отдельный нстроечный файл
```bash
cp config/config.sample.json config/config.test.json
```