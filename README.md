# Календарь звонков (продолжение)


[![hexlet-check](https://github.com/Zhumadil9/ai-for-developers-project-387/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Zhumadil9/ai-for-developers-project-387/actions)

Интегрируйте работу агентов в GitHub проект

Учебный проект Хекслета: https://ru.hexlet.io/programs/ai-for-developers
Как это должно работать: https://files.hexlet.app/a/2ipc5m
Исходная спецификация первого проекта: https://github.com/Zhumadil9/ai-for-developers-project-386/issues/8
Исходный release PR: https://github.com/Zhumadil9/ai-for-developers-project-386/pull/17
Исходный коммит реализации: https://github.com/Zhumadil9/ai-for-developers-project-386/commit/2df181656a30c94bdc7351f4e58fe7b56969477c

## Стек

- React + TypeScript + Vite
- Express + TypeScript
- TypeSpec + OpenAPI
- Vitest + Playwright
- mise + GitHub Actions

## Установка

```bash
git clone https://github.com/Zhumadil9/ai-for-developers-project-387.git
cd ai-for-developers-project-387
npm ci
```

## Использование

Запустить сервер приложений на `http://localhost:3001/`:

```bash
npm run dev
```

Запустить отдельный Vite-сервер фронтенда:

```bash
npm run dev:frontend
```

Запустить все проверки:

```bash
npm run check
```

Собрать и запустить Docker-контейнер на порту `4321`:

```bash
docker build -t calendar-booking:test .
docker run --rm --env PORT=4321 --publish 4321:4321 calendar-booking:test
```

После запуска приложение доступно на `http://localhost:4321/`.

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
