# AI_START — game-hub (나만의 게임 선택기)

다른 AI가 이어받을 때 가장 먼저 읽는 문서. Read this first.

- 라이브 / Live: https://junsa80.github.io/game-hub/ · 저장소: https://github.com/junsa80/game-hub (public, Pages = main /)
- 담당 / Owner: Grok 계열. 현재 hub v1.4.6 (`sw.js` `V='hub-v1.4.6'`, `?v=1.4.6`).

## 읽는 순서 / Read order
1. 이 파일 → 2. `HANDOFF.md`(전체 게임 표, 버전 기록) → 3. `docs/BUILD_PLAY_COPIES.md`(play/ 복사본 다시 만드는 정확한 명령) → 4. `games.json`(게임 목록의 유일한 원본) → 5. `app.js`, `index.html`, `sw.js`.
- `docs/game-bookmarks.html`: 브라우저로 가져올 수 있는 즐겨찾기 파일(모든 게임 링크).

## 실행·테스트 / Run & test
- 빌드 없음. `game-hub` 폴더의 **상위** 폴더에서 `python3 -m http.server 8080` → http://127.0.0.1:8080/game-hub/ (prism-muse 복사본이 `/game-hub/play/prism-muse/` 절대경로라 이 경로로 열어야 함).
- 자동 테스트 스크립트는 없음. 확인: `games.json`이 JSON으로 읽히는지 `node -e "JSON.parse(require('fs').readFileSync('games.json'))"`, 라이브에서 카드 클릭 → 게임 열림.

## 협업 규칙 / Collaboration rule (2026-10-20, 사용자 합의)
- GitHub `main` = 유일한 기준(single source of truth). 채팅·작업 상자·ChatGPT Sites에만 있는 건 없는 것으로 본다.
- 한 게임은 한 번에 AI 하나만 작업 (one AI per game at a time). 담당: Grok 계열 = hunt-now, beauty-deck, game-hub / GPT = 나머지(rose-spire, prism-muse, muse-studio, world-breaker, aster-hunt, last-archive, companion-guild, ember-tactics, fogbound-tactics) / SRPG 봇 = srpg-prototype.
- 큰 변경은 브랜치(`grok/...`, `gpt/...`, `grokbot/...`)에서 → 테스트 → main 병합. Big changes on a branch, then merge.
- 커밋 접두어 / commit prefix: `[Grok]`(Grok 채팅), `[GPT]`(ChatGPT/Codex), `[GrokBot]`(Grok Bot).
- 완료 = GitHub에서 커밋이 확인됨 (done = commit confirmed on GitHub, e.g. `https://github.com/junsa80/<repo>/commits/main`).
- 순서 / order: 소스 받기(pull) → 작업 → 테스트 → 커밋 → HANDOFF.md 갱신 → 배포 확인.
- 처음부터 다시 만들지 않는다. Never rebuild from scratch; continue from main.
- 검증 보고는 자동 테스트와 실제 폰 테스트를 나눠 쓰고, 안 한 확인을 했다고 쓰지 않는다. Report automated vs real-phone tests separately; never claim unverified checks.

## 핵심 제약 / Key constraints
- 모든 캐릭터는 성인(20대 이상), 단정한 복장, 성적 콘텐츠 없음. 실존 인물과 닮은 그림 금지. Adults only, fully clothed, no sexual content, no real-person likeness.
- rose-spire의 숙련 문턱 기준 0 / 16 / 40 / 80 / 140 은 rose-spire 전용 메모다. 1·4·9 문턱이나 "18KB 패치"는 적용하지 않는다. 다른 게임에 이 숫자를 옮기지 않는다. (Rose-spire-only note; don't apply elsewhere.)
- 비밀번호·토큰·인증 코드를 요청하거나 출력하지 않는다. Never request or print secrets.
- 저장소 공개/비공개 전환, 권한·앱 설치 변경은 사용자만 한다. Visibility/permission changes are user-only.
- 저장 형식을 바꾸면 이전 저장을 이관(migrate)하고 JSON 백업 내보내기/가져오기를 유지한다.

## 배포 / Deploy (GitHub Pages)
- Pages 소스: `main` 브랜치 루트(`/`). main에 푸시하면 1~2분 뒤 자동 반영. 루트에 `.nojekyll` 유지.
- 코드·자산을 바꾸면 `sw.js`의 캐시 버전 상수와 `index.html`의 `?v=` 쿼리를 올린다 (service worker version bump). 안 올리면 폰에 옛 화면이 남는다.
- 확인: 라이브 URL에서 `sw.js`를 열어 새 버전 문자열이 보이는지 확인 (`curl -s <live>/sw.js | head -3`).

## GPT 게임이 바뀌었을 때 선택기 복사본 갱신 / Updating hub hosted copies
prism-muse, muse-studio, world-breaker, rose-spire 는 비공개 저장소라, 선택기(`junsa80/game-hub`)의 `play/<이름>/` 에 정적 복사본을 둔다. GPT가 원본 main을 바꿔도 복사본은 자동으로 안 바뀐다.
1. 담당 AI(보통 Grok 계열, 셸 있는 환경)가 원본 main을 클론(읽기만, 원본 저장소에는 푸시 금지 — 특히 rose-spire).
2. `game-hub/docs/BUILD_PLAY_COPIES.md` 의 명령대로 다시 만든다 (rose-spire·muse-studio: `tools/make_static_copy.py`, world-breaker: 파일 복사, prism-muse: `tools/patches/prism-muse-static.patch` 적용 후 Next 정적 빌드).
3. `games.json`의 `commit` 값을 복사한 원본 커밋으로 갱신, 허브 `sw.js` 버전과 `?v=` 올림, `[GrokBot]`/`[Grok]` 커밋, 라이브 확인.
4. 새 그림이 들어왔으면 성인·단정한 복장·실사 인물 아님을 먼저 확인하고 올린다.
