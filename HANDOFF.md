# HANDOFF — game-hub

## 게임 추가 방법
1. `games.json`에 항목 추가:
   `{"id":"repo-name","title":"제목","desc":"설명","genre":["장르"],"icon":"🎮","color":"#hex","url":"https://junsa80.github.io/repo-name/","thumb":"thumbs/repo-name.webp","public":true}`
2. 공개+Pages 게임만 `url`/`thumb` 사용. 썸네일은 480px 폭 webp로 `thumbs/`에 넣기.
3. 비공개 저장소는 `"public":false`, url·thumb 없이(이미지 복사 금지). 그라데이션+이모지 카드로 표시됨.
4. `sw.js`의 `V`와 `index.html`/`app.js`의 `?v=` 올리기. 커밋은 `[GrokBot]`/`[Grok]` 접두어.

## 현재 상태 (v1.0.0, 2026-10-20)
- 플레이 가능 3개: hunt-now, beauty-deck, srpg-prototype. 비공개 9개는 링크 없음.
- 자동 검증: 헤드리스 Chromium 390x844. 실제 폰 터치 테스트는 안 함.

## v1.1.0 (2026-10-20)
- aster-hunt, last-archive, companion-guild, ember-tactics, fogbound-tactics: playable cards linking to ChatGPT-hosted URLs (`*.sajuyoon.chatgpt.site`). They return 401 unless logged into ChatGPT; card shows badge "ChatGPT 로그인 필요" (`login:"chatgpt"` in games.json).
- Playable = has `url` (no longer requires `public`). rose-spire, prism-muse, muse-studio, world-breaker remain greyed (no link).
- SW cache hub-v1.1.0; asset query ?v=1.1.0.

## v1.2.0 (2026-10-20)
- Hosted static builds in this repo under `play/<name>/`: prism-muse (Next export, rebuilt with basePath `/game-hub/play/prism-muse` in /workspace/private-games/build-prism), muse-studio and world-breaker (relative paths, copied as-is). Original private repos untouched. Saves are local to this browser (not shared with ChatGPT versions).
- rose-spire NOT hosted: images need a source check; card shows badge "이미지 출처 확인 중" (`note` field).
- SW hub-v1.2.0 precaches only the hub shell and bypasses `/play/` entirely.

## v1.2.1 fixes (2026-10-20)
- `053b69d` added `.nojekyll` at repo root so GitHub Pages serves `_next/` folders (prism-muse).
- `baec038` fixed prism-muse asset paths under `/game-hub/play/prism-muse/`.

## v1.3.0 (2026-10-20)
- rose-spire hosted at `play/rose-spire/` — static copy of `junsa80/rose-spire` main `6bf8f6f` (`public/`). Image review passed after GPT replaced all art (`cab10a5`): painted fantasy characters, no photo-realistic people, no 0-byte files.
- Hosting-only edits (game code untouched): absolute `/visual.*` paths made relative (index.html, visual.css); `cloud-save.js` removed and its `cloud-pending` script gate replaced by plain `<script>` tags.
- **Saves are local-only** (this browser's localStorage). No account sync, not shared with the ChatGPT-site version. Card desc says so.
- Badge "이미지 출처 확인 중" removed. SW hub-v1.3.0, ?v=1.3.0. rose-spire repo never pushed to.
- To update: re-copy rose-spire `public/` and reapply the edits above.
