# AGENTS.md

Any AI (Grok, ChatGPT/Codex, Grok Bot) working on this repo: read **AI_START.md** first, then HANDOFF.md, README.md and STORY.md if present.

- `main` is the single source of truth. One AI per game at a time; big changes on a branch, then merge.
- Commit prefixes: `[GrokBot]`, `[Grok]`, `[GPT]`. Done = commit confirmed on GitHub.
- Pushing is not deploying: check the live site and service worker version separately.
- Never break existing saves.

이 저장소를 작업하는 AI는 먼저 AI_START.md, 그다음 HANDOFF.md를 읽어 주세요.

- 전체 13개 게임의 개발 방향은 [GAME_DIRECTIONS.md](GAME_DIRECTIONS.md) 참조. 핵심 재미·성장·플레이 방향은 차별화하고 조작·가독성·저장 등 편의성은 서로 참고해 발전시킨다. 미래 방향과 구현 완료를 구분한다.
