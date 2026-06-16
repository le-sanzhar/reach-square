# Reach² — Music Review Platform

> Real feedback for independent music. / Настоящий фидбек для независимой музыки.

![Reach²](public/screenshot.png)

---

## English

**Reach²** is a community-driven music review platform built for independent artists and honest listeners. Find albums, leave a quick rating or a full-length review, and follow what your friends are listening to.

### Features

- Curated album catalog powered by the iTunes Search API (no key required)
- Rate albums with 1–5 stars — no word count minimum, quick ratings welcome
- Write full reviews with prompt hints and a character progress indicator
- Real authentication — register, login, logout with bcrypt-hashed passwords
- Personal profile with review history and listening stats
- Global activity feed showing what the community is rating
- 30-second track previews via iTunes (legally licensed)
- Auto-generated DiceBear avatars per user
- Mobile-ready with a bottom navigation bar

### Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 · App Router |
| Auth | NextAuth.js v4 · Credentials · JWT |
| Storage | JSON flat-file `data/db.json` |
| Music data | iTunes Search API (free, no key) |
| Styling | Custom CSS · Liquid glass · Syne + Inter |
| Avatars | DiceBear API |
| Passwords | bcryptjs |

### Quick Start

```bash
npm install
npm run seed   # pulls real albums from iTunes → data/db.json
npm run dev    # → http://localhost:3000
```

**Demo login** (after seed):
```
email:    aidar@demo.reach2
password: demo123
```

### Environment

Create `.env.local` in the project root:

```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### Deployment

Vercel won't work — the app writes to a local JSON file. Use **Railway** or **Render** (Node server) for hosting.

---

## Русский

**Reach²** — платформа для рецензий на музыку, созданная для независимых артистов и честных слушателей. Находи альбомы, ставь быстрые оценки или пиши полноценные рецензии, следи за тем, что слушает сообщество.

### Возможности

- Каталог альбомов через iTunes Search API (без ключей и регистрации)
- Оценки от 1 до 5 звёзд — текст необязателен, быстрая оценка тоже считается
- Полноценные рецензии с подсказками и индикатором прогресса
- Настоящая авторизация — регистрация, вход, выход, пароли через bcrypt
- Личный профиль с историей оценок и статистикой прослушиваний
- Лента активности сообщества
- 30-секундные превью треков через iTunes (легально)
- Автоаватары DiceBear для каждого пользователя
- Мобильная версия с нижней навигацией

### Стек

| Слой | Технология |
|---|---|
| Фреймворк | Next.js 14 · App Router |
| Авторизация | NextAuth.js v4 · Credentials · JWT |
| Хранение данных | JSON-файл `data/db.json` |
| Музыкальные данные | iTunes Search API (бесплатно, без ключей) |
| Стили | Custom CSS · Liquid glass · Syne + Inter |
| Аватары | DiceBear API |
| Пароли | bcryptjs |

### Запуск

```bash
npm install
npm run seed   # загружает реальные альбомы из iTunes → data/db.json
npm run dev    # → http://localhost:3000
```

**Демо-вход** (после сида):
```
email:    aidar@demo.reach2
пароль:   demo123
```

### Переменные окружения

Создай `.env.local` в корне проекта:

```env
NEXTAUTH_SECRET=твой-секрет
NEXTAUTH_URL=http://localhost:3000
```

### Хостинг

Vercel не подойдёт — приложение пишет в локальный JSON-файл. Используй **Railway** или **Render** (Node-сервер).
