Telegtam Quest Bot
==================
Бот для квестов в телеграмме

Установка
----------------------------------

```bash
git init
git remote add origin git@bitbucket.org:onequest/quest.git
git pull origin master
npm install
npm install -g knex
cp knexfile.sample.json knexfile.json
cp config/config.sample.json config/config.json
```
Затем вносим необходимые данные в файлы настроек
(токен телеграмма, пароль от СУБД и так далее) и
```bash
npm run migrate-up
npm start
```