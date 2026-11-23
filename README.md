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

## GitHub Agent (OpenCode)

В репозитории настроен интерактивный воркфлоу
[`.github/workflows/opencode.yml`](./.github/workflows/opencode.yml).

- События: `issue_comment` и `pull_request_review_comment`, только
  `types: [created]`.
- Команды вызова: `/opencode` и `/oc`.
- Модель: `openai/gpt-5.4-mini-fast`.
- Назначение: объяснение issue и PR, обсуждение спецификации, подготовка
  изменений и ответа в комментарии. Решения о мерже остаются за человеком.
- Результаты появляются в комментарии к issue/PR и в секции Actions
  репозитория.
- Воркфлоу доступен владельцам репозитория, участникам организации и
  явным collaborators. Сообщения ботов игнорируются.
- Тайм-аут задания: 20 минут. Параллельные запуски ограничены номером issue
  или pull request; в рамках одного issue новый запуск не отменяет старый.
- Используется альтернативная авторизация GitHub Actions через встроенный
  `GITHUB_TOKEN`: `contents: write`, `pull-requests: write`,
  `issues: write`. Checkout сохраняет credentials для операций с ветками и PR.
  Это снимает зависимость от нестабильного OIDC exchange OpenCode GitHub App.
- Ключ модели хранится только в GitHub Actions Secrets как
  `OPENAI_API_KEY` и не передаётся событиям pull request из fork.

Перед запуском человек должен установить
[OpenCode GitHub App](https://github.com/apps/opencode-agent) на этот
репозиторий и добавить `OPENAI_API_KEY` в **Settings → Secrets and
variables → Actions**. При другой модели и другом провайдере замените
значение `model`, переменную провайдера и имя секрета вместе.
Для выбранной модели на аккаунте OpenAI должен быть доступный API-биллинг:
баланс не должен быть исчерпан. Подписка ChatGPT не заменяет API credits.

На свежем runner проверка доступна после checkout репозитория: проектные
наборы скиллов находятся в `.agents/skills/`, правила — в `AGENTS.md`, а
настройки трекера и меток — в `docs/agents/`. Агент должен читать
GitHub Issues этого репозитория и иметь доступ к скиллам `to-spec`,
`to-tickets` и `implement-spec`.

Для проверки создайте issue и оставьте комментарий:

```text
/oc explain this issue
```

Прогон можно открыть во вкладке
[Actions](https://github.com/Zhumadil9/ai-for-developers-project-387/actions)
репозитория.

### Автотриаж новых обращений

Воркфлоу [`.github/workflows/opencode-triage.yml`](./.github/workflows/opencode-triage.yml)
запускается при открытии нового issue и передает агенту инструкцию из
`prompt`. Тайм-аут — 15 минут; запуск ограничен номером issue.

Он пропускает только обращения владельца, участника организации или
explicit collaborator. Сообщения ботов игнорируются. Issues с меткой
`ready-for-agent` не триажируются повторно, а агент не меняет код и не
создает implementation tickets на этом этапе.

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
