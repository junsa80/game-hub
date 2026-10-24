# AGENTS.md

Any AI (Grok, ChatGPT/Codex, Grok Bot) working on this repo: read **AI_START.md** first, then HANDOFF.md, README.md and STORY.md if present.

- `main` is the single source of truth. One AI per game at a time; big changes on a branch, then merge.
- Commit prefixes: `[GrokBot]`, `[Grok]`, `[GPT]`. Done = commit confirmed on GitHub.
- Pushing is not deploying: check the live site and service worker version separately.
- Never break existing saves.

이 저장소를 작업하는 AI는 먼저 AI_START.md, 그다음 HANDOFF.md를 읽어 주세요.

- 전체 13개 게임의 개발 방향은 [GAME_DIRECTIONS.md](GAME_DIRECTIONS.md) 참조. 핵심 재미·성장·플레이 방향은 차별화하고 조작·가독성·저장 등 편의성은 서로 참고해 발전시킨다. 미래 방향과 구현 완료를 구분한다.

사용자 공통 원칙(2026-10-24): 기존 리소스는 총 작업·토큰 비용이 줄 때 적극 재활용한다. 검토·이식 비용이 더 커지면 재활용을 고집하지 않는다. 사전 조사는 짧고 목적에 맞게 제한한다.
