# Проектная работа: полноценный веб-сайт

Готовая реализация учебного проекта по ТЗ: HTML/CSS/JavaScript + Node.js/Express + MySQL + GitHub.

## Что реализовано

### Авторизация и пользователи
- POST `/api/auth/register` — регистрация нового пользователя
- POST `/api/auth/login` — вход и получение JWT-токена
- POST `/api/auth/logout` — выход из системы
- GET `/api/users/me` — профиль текущего пользователя

### CRUD основной сущности
- GET `/api/items?page=1&limit=10`
- GET `/api/items/:id`
- POST `/api/items`
- PUT `/api/items/:id`
- DELETE `/api/items/:id`

### Дополнительный функционал
- POST `/api/items/:id/likes`
- DELETE `/api/items/:id/likes`
- POST `/api/items/:id/comments`
- PUT `/api/items/:id/comments/:cid`
- DELETE `/api/items/:id/comments/:cid`
- GET `/api/items?search=...`

## Структура проекта

```text
my-website/
├── frontend/
├── backend/
├── database/
├── .gitignore
├── README.md
└── TODO_TASKS.md
```

## Запуск проекта

### 1. Импорт базы данных
Создайте базу данных `my_website_db` в phpMyAdmin и импортируйте файл `database/schema.sql`.

### 2. Настройка backend
```bash
cd backend
npm install
cp .env.example .env
```

Заполните `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=my_website_db
JWT_SECRET=super_secret_key_change_me
PORT=3001
```

Запуск:
```bash
npm run dev
```

### 3. Настройка frontend
```bash
cd ../frontend
npm install
npm start
```

Фронтенд откроется через локальный статический сервер, бэкенд работает на `http://localhost:3001`.

## Примеры запросов

### Регистрация
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"student","email":"test@mail.ru","password":"12345"}'
```

### Вход
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.ru","password":"12345"}'
```

### Создание записи
```bash
curl -X POST http://localhost:3001/api/items \
  -H "Authorization: Bearer ВАШ_ТОКЕН" \
  -H "Content-Type: application/json" \
  -d '{"title":"Тест","content":"Текст записи","tags":["тест"]}'
```

### Лайк
```bash
curl -X POST http://localhost:3001/api/items/1/likes \
  -H "Authorization: Bearer ВАШ_ТОКЕН"
```

### Удаление записи
```bash
curl -X DELETE http://localhost:3001/api/items/1 \
  -H "Authorization: Bearer ВАШ_ТОКЕН"
```

## Тестирование

```bash
cd backend
npm test
```

Сейчас в проекте добавлен smoke-test раннер. Основная проверка по ТЗ выполняется вручную через curl/Postman и через интерфейс фронтенда.

## Что показать при защите
- структура проекта;
- схема базы данных;
- регистрация и вход;
- получение профиля;
- создание, изменение и удаление записи;
- лайки;
- комментарии;
- поиск;
- фронтенд, работающий через API.
