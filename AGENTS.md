# Правила проекта

- Установка: `mise run install`.
- Запуск бекенда: `mise run dev`; фронтенда: `mise run dev-frontend`.
- Проверки: `mise run check` (контракт, SDK, линтер, типы, API-тесты и Playwright с настоящими серверами).
- Коммиты оформлять по Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- Коммиты реализации ссылаться на закрываемый тикет, например `feat: запись на свободный слот (#12)`.
- Код лежит в `backend/`, `frontend/` и `contract/`; сгенерированный SDK не редактировать вручную.
- Контрактные артефакты находятся в `contract/openapi/` и `frontend/src/api/generated/`; править их вручную запрещено.
- Фронтенд обращается к API только через сгенерированный SDK.

## Agent skills

### Issue tracker

GitHub Issues в `Zhumadil9/ai-for-developers-project-387`. See `docs/agents/issue-tracker.md`.

### Triage labels

Используется стандартный набор `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Одноконтекстная структура: `GLOSSARY.md` и `docs/adr/` в корне. See `docs/agents/domain.md`.
