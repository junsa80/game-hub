## v1.5.0 — 9개 표지와 13개 초보 안내 (2026-10-22)
- 이미지 없는 GPT 게임 9개에 장르별 신규 표지 일러스트. 기존 4개 대표 이미지는 유지. thumb 경로는 thumbs/<id>-cover-v1.webp, 제작 프롬프트/출처는 docs/COVER_ART.md.
- 전체 13개: 한 줄 매력 소개, 설명, 첫 3단계/조작/팁을 접힌 안내로 추가. 표지를 눌러 게임 실행, 즐겨찾기와 기존 플레이 버튼 유지.
- 이미지 960×540 WebP, 지연 로드. 생성 이미지는 실제 게임 화면이 아니므로 표지 일러스트 라벨. 카드 320px 화면 폭 넘침 방지.
- 범위는 게임 목록의 표지/안내이며 게임 본체 타이틀/전투/저장·기존 URL은 변경하지 않음. 계정 저장 5/13 상태 유지.
- 검사: app.js/sw.js 문법, mock DOM에서 13카드·13이미지·13안내·9일러스트 라벨 렌더링. 표지 9개 시각 검수(성인/일반 복장/문자·워터마크 없음). 실제 브라우저/폰 QA는 환경 URL 정책 차단으로 미실행.
- 공개 배포 확인은 main의 Pages workflow와 실제 버전/이미지 응답을 별도로 확인. GitHub 푸시만으로 사이트 확인 완료라고 보고하지 말 것.

## v1.4.13 — 중복 로그인 배지 제거
- 사용자 요청: 모든 게임의 공통 조건을 카드마다 반복하지 않음. 카드의 로그인 없이 플레이/로그인 필요 배지 렌더링 제거.
- 상단 공통 플레이/저장 안내, 카드별 실제 저장 지원 상태와 플레이 버튼 유지.
- 게임 본체, 주소, 세이브 변경 없음. app.js 문법 검사. 실제 폰 미검증.

## v1.4.12 — 플레이/저장 공통 안내 (2026-10-22)
- 모든 게임 비로그인 플레이, 기기 저장 기본, ChatGPT 로그인은 선택형 계정 저장이라는 공통 안내 추가. 현재 구현은 5/13임을 표시.
- 서버 저장 미구현 8개는 planned. 게임 본체 저장을 일괄 구현한 변경이 아님.
- 원본/커밋/기술 저장 상세를 접힌 개발 정보로 이동. 중복 빨간 경고 제거.
- 전체 적용의 완료 조건/현재 차이는 docs/OPTIONAL_ACCOUNT_SAVE_ROLLOUT.md. 실제 서버 저장 배포 검증 전 supported 변경 금지.

## v1.4.11 (2026-10-22) — 방문 공개, 편집 권한 유지
- 사용자 목표: 13개 게임을 주소만으로 비로그인 플레이. 편집은 소유자와 소유자가 허용한 AI만. GitHub 원본 공개/비공개 상태는 변경하지 않음.
- 목록의 Sites 8개는 실제로 owner-only custom 설정이었음. 네이티브 Sites 도구로 각각 public으로 변경했고 추가 editor는 없음. public은 방문 권한이지 편집 권한이 아님.
- 기존 URL과 저장 키를 유지. 다른 호스트로 옮기거나 기존 로컬/계정 세이브를 이관하지 않음.
- games.json의 login:chatgpt 제거, playAccess:anonymous 추가. public 필드는 이전 원본 공개 여부 데이터라 그대로 두며 방문 권한과 혼동하지 말 것.
- PRISM MUSE: 익명 API 401 때 준비 화면에 머무는 문제 수정. GitHub PR #2 main 병합 `4bb9341`, Sites 소스 `37d8ea4`, Sites v14 배포 succeeded. 비로그인 로컬 저장, 로그인 계정 저장 유지. 기존 41개+익명 시작·플레이·재접속/로그인 저장/오프라인 백업 3개 검사와 빌드 통과.
- 다른 계정 저장 게임 4개는 API 401 후에도 data-cloud-src 스크립트를 실행하는 구조와 사용자별 API 인증을 소스 확인. 기존 계정 저장 데이터와 권한 유지.
- 검증 범위: GitHub Pages 5개 HTML은 쿠키/인증 없는 GET 200. Sites 8개 public/추가 editor 없음은 네이티브 응답 확인. 외부 자동 GET은 Cloudflare error 1010(403)으로 차단되어 실제 방문·전체 게임 화면·스테이지 클리어는 미검증. 내부 브라우저 미리보기도 URL 정책으로 차단됨. 이를 실제 전체 플레이 통과라고 보고하지 말 것.
- Grok/다른 AI: GitHub main에서 이어서 수정하고 해당 호스트에 배포할 것. GitHub 푸시만으로 Sites가 갱신되지는 않음. .openai/hosting.json project_id와 기존 주소·세이브를 유지. 방문 권한은 공개 상태를 유지하고 임의의 editor를 추가하지 않음.

# HANDOFF — game-hub

## v1.4.2 (2026-10-21) — 룬 영토 추가
- `games.json`에 공개 플레이 카드 추가. 주소 https://junsa80.github.io/rune-territories-play/
- 원본은 비공개 `junsa80/rune-territories` `8a1f3f5`. 실행본은 공개 `junsa80/rune-territories-play` `48fe0b1`. 선택기 안에 복사하지 않고 링크로 연다.
- 저장 키 `rune-territories.save.v1`은 `junsa80.github.io` 공통이라 선택기에서 열어도 공개 주소와 기록이 같다. JSON 백업 가능.
- 썸네일 `thumbs/rune-territories.webp` (480×270). SW `hub-v1.4.3`, `?v=1.4.3`.
- 2026-10-22 추가 반영: 원본 `5b827cd`, 실행본 `5738e4e` (UI 0.1.47: 타이틀 키아트·칸 글자, GPT 0.1.46 주사위 수정 포함). 표지 `thumbs/rune-territories-cover-v1.webp`. 직전 `4849ec4` / `51723fc` (UI 0.1.45).
- 자동 검증: `games.json` JSON 파싱. 실제 폰에서 카드 탭은 안 함.

## 게임 추가 방법
1. `games.json`에 항목 추가:
   `{"id":"repo-name","title":"제목","desc":"설명","genre":["장르"],"icon":"🎮","color":"#hex","url":"https://junsa80.github.io/repo-name/","thumb":"thumbs/repo-name.webp","public":true}`
2. 공개+Pages 게임만 `url`/`thumb` 사용. 썸네일은 480px 폭 webp로 `thumbs/`에 넣기.
3. 비공개 저장소는 `"public":false`, url·thumb 없이(이미지 복사 금지). 그라데이션+이모지 카드로 표시됨.
4. `src`·`commit`·`commitKind`·`save`(·`saveWarn`)도 채우기. 원본이 바뀌면 `commit`을 갱신.
5. `sw.js`의 `V`와 `index.html`/`app.js`의 `?v=` 올리기. 커밋은 `[GrokBot]`/`[Grok]` 접두어.

## 현재 상태 (v1.0.0, 2026-10-20)
- 플레이 가능 3개: hunt-now, beauty-deck, srpg-prototype. 비공개 9개는 링크 없음.
- 자동 검증: 헤드리스 Chromium 390x844. 실제 폰 터치 테스트는 안 함.

## v1.1.0 (2026-10-20)
- aster-hunt, last-archive, companion-guild, ember-tactics, fogbound-tactics: playable cards linking to ChatGPT-hosted URLs (`*.sajuyoon.chatgpt.site`). They return 401 unless logged into ChatGPT; card shows badge "ChatGPT 로그인 필요" (`login:"chatgpt"` in games.json).
- Playable = has `url`. 장미의 첨탑·프리즘 뮤즈·뮤즈 스튜디오의 바로 플레이는 Sites 주소다. github.io 복사본은 계정 저장이 없어 기록이 따로다.
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

## v1.4.0 (2026-10-20) — 출처·반영 커밋·저장 방식 표시
- `games.json` 각 항목에 `src`(원본 저장소), `commit`(반영 커밋), `commitKind`(링크/복사본), `save`(저장 방식), 필요하면 `saveWarn`(카드 경고) 추가. 카드 아래에 작은 글씨로 원본 저장소·반영 커밋·저장 방식을 보여 주고, `saveWarn`이 있으면 붉은 경고 상자로 보여 줌.
- 링크형 게임의 `commit`은 **확인 시점의 저장소 main HEAD**(배포가 main을 따라가므로 이후 커밋이 생기면 값을 갱신). Sites(*.chatgpt.site) 링크는 로그인이 필요해 실제 배포본 커밋을 확인하지 못했고, 저장소 main 기준으로만 적음.
- 복사본(`play/`)의 `commit`은 복사 원본 커밋. 확인 방법: 원본 저장소를 클론해 `diff -rq`.
  - rose-spire `6bf8f6f`: `public/`이 현재 main(`de7cbf4`)과도 같음(그 뒤 커밋은 docs만). 차이는 호스팅 수정(`cloud-save.js` 제거, 절대경로 → 상대경로)뿐.
  - muse-studio `d400d25`: `public/` 마지막 변경 커밋(main `cd1f379`과 같은 내용). `cloud-save.js` 제거.
  - prism-muse `a479cdd`: `app/`·`public/` 마지막 변경 커밋(main `5f7e28e`과 같은 내용), basePath 넣어 다시 빌드.
  - world-breaker `5bb0b6c`: main HEAD와 index.html·styles.css·src/ 동일.
- **rose-spire 저장 방식 (코드로 확인)**: 원본 `public/index.html`은 `cloud-save.js`를 불러 `rose-spire.run.v2`/`rose-spire.meta.v2` localStorage 쓰기를 가로채 `/api/cloud-save`(app/api/cloud-save/route.ts, ChatGPT 로그인 사용자별 DB 저장)로 올림. 선택기 복사본은 `cloud-save.js`가 없고 네트워크 저장 코드도 없어서 이 브라우저 localStorage만 씀. 출처(origin)도 달라 같은 브라우저라도 Sites판 기록을 읽지 못함 → **진행이 자동으로 이어지지 않음**. Sites판(https://rose-spire-deck.sajuyoon.chatgpt.site)은 로그인 없이 401이라 실제 배포본은 직접 열어 보지 못했고, 저장소 코드 기준으로 판단함.
- prism-muse 복사본은 Next 빌드 안에 `/api/save` 호출이 남아 있지만 GitHub Pages에는 API가 없어 실패하고, 브라우저 백업(`prism-muse-backup`)만 남음.
- last-archive, fogbound-tactics 저장 방식은 미확인(저장소 트리에 서버 저장 경로가 없지만 코드를 직접 보지 못함). aster-hunt는 서버 저장 경로 없음 + localStorage 사용 확인.

| id | 원본 저장소 | 반영 커밋 | 종류 | 저장 방식 |
|---|---|---|---|---|
| hunt-now | junsa80/hunt-now | `040e11e` | 링크(확인 시점 main) | 로컬 저장(이 브라우저 localStorage) |
| beauty-deck | junsa80/beauty-deck | `d185d9d` | 링크(확인 시점 main) | 로컬 저장(localStorage) · 계정 동기화 없음, JSON 백업 가능 |
| srpg-prototype | junsa80/srpg-prototype | `394a6d6` | 링크(확인 시점 main) | 로컬 저장(브라우저 IndexedDB) · 클라우드 미지원 |
| rose-spire | junsa80/rose-spire | `6bf8f6f` | 선택기 안 복사본(public/) | 로컬 전용(이 브라우저 localStorage) · 계정 저장 없음 |
| aster-hunt | junsa80/aster-hunt | `25836fb` | 링크(Sites 배포본 · 배포 커밋 미확인, 저장소 main 기준) | 로컬 저장(저장소에 서버 저장 코드 없음) |
| last-archive | junsa80/last-archive | `5f24ceb` | 링크(Sites 배포본 · 배포 커밋 미확인, 저장소 main 기준) | 미확인 |
| companion-guild | junsa80/companion-guild | `32a8aff` | 링크(Sites 배포본 · 배포 커밋 미확인, 저장소 main 기준) | 계정 저장(ChatGPT 로그인, cloud-save) + 로컬 |
| ember-tactics | junsa80/ember-tactics | `9ad14cd` | 링크(Sites 배포본 · 배포 커밋 미확인, 저장소 main 기준) | 계정 저장(ChatGPT 로그인, cloud-save) + 로컬 |
| prism-muse | junsa80/prism-muse | `a479cdd` | 선택기 안 복사본(정적 빌드) | 로컬 전용(이 브라우저 백업) · 서버 저장은 여기선 동작 안 함 |
| muse-studio | junsa80/muse-studio | `d400d25` | 선택기 안 복사본(public/) | 로컬 전용(localStorage) · 계정 저장 제거됨 |
| fogbound-tactics | junsa80/fogbound-tactics | `5de3a77` | 링크(Sites 배포본 · 배포 커밋 미확인, 저장소 main 기준) | 미확인 |
| world-breaker | junsa80/world-breaker | `5bb0b6c` | 선택기 안 복사본 | 로컬 저장(localStorage) |

## v1.4.1 (2026-10-21) — 인수인계 정리 (문서만, 화면 변경 없음)
- `AI_START.md`(읽는 순서·협업 규칙·배포·제약), `docs/BUILD_PLAY_COPIES.md`(play/ 복사본 재생성 명령), `tools/make_static_copy.py`, `tools/patches/prism-muse-static.patch`, `docs/game-bookmarks.html`(즐겨찾기 가져오기 파일) 추가.
- 이유: 이 저장소의 play/ 복사본은 Grok Bot 작업 상자에서 만들었고, 그 상자는 2026-10-28쯤 사라짐. 이제 빌드 절차가 전부 저장소 안에 있음.

## 전체 게임 표 (2026-10-21 기준, main HEAD는 이날 GitHub API로 확인)
| 게임 | 저장소 (공개 여부) | 담당 AI | 플레이 링크 | 호스팅 방식 | 저장 방식 |
|---|---|---|---|---|---|
| 나만의 게임 선택기 | junsa80/game-hub (공개) | Grok 계열 | https://junsa80.github.io/game-hub/ | GitHub Pages (main /) | 즐겨찾기·최근 플레이 localStorage |
| 헌트 나우 | junsa80/hunt-now (공개) | Grok 계열 | https://junsa80.github.io/hunt-now/ | GitHub Pages (main /) | localStorage + JSON 백업 |
| 미녀 덱 | junsa80/beauty-deck (공개) | Grok 계열 | https://junsa80.github.io/beauty-deck/ | GitHub Pages (main /) | localStorage + JSON 백업/복원 |
| SRPG 프로토타입 | junsa80/srpg-prototype (공개) | SRPG 개발봇 | https://junsa80.github.io/srpg-prototype/ | GitHub Pages | IndexedDB(브라우저) |
| 룬 영토 | junsa80/rune-territories (비공개) | Grok 계열 | https://junsa80.github.io/rune-territories-play/ | 공개 실행본 Pages (`5738e4e`) | localStorage (github.io 공통) + JSON 백업 |
| 장미의 첨탑 | junsa80/rose-spire (비공개) | GPT | https://junsa80.github.io/game-hub/play/rose-spire/ (원본 Sites: https://rose-spire-deck.sajuyoon.chatgpt.site) | 선택기 안 복사본(원본 `6bf8f6f`) / ChatGPT Sites | 복사본: localStorage만 · Sites: ChatGPT 계정 저장 |
| PRISM MUSE | junsa80/prism-muse (비공개) | GPT | https://junsa80.github.io/game-hub/play/prism-muse/ | 선택기 안 정적 빌드(원본 `a479cdd`=`5f7e28e`) | 복사본: localStorage만 |
| 뮤즈 스튜디오 | junsa80/muse-studio (비공개) | GPT | https://junsa80.github.io/game-hub/play/muse-studio/ | 선택기 안 복사본(원본 `d400d25`=`cd1f379`) | 복사본: localStorage + 백업 파일 |
| 월드 브레이커 | junsa80/world-breaker (비공개) | GPT | https://junsa80.github.io/game-hub/play/world-breaker/ | 선택기 안 복사본(원본 `5bb0b6c`) | localStorage |
| 아스터 헌트 | junsa80/aster-hunt (비공개) | GPT | https://aster-hunt.sajuyoon.chatgpt.site | ChatGPT Sites (로그인 필요) | localStorage |
| 종말계승 | junsa80/last-archive (비공개) | GPT | https://last-archive-alpha.sajuyoon.chatgpt.site | ChatGPT Sites (로그인 필요) | 미확인 |
| 동료 길드 | junsa80/companion-guild (비공개) | GPT | https://companion-guild.sajuyoon.chatgpt.site | ChatGPT Sites (로그인 필요) | ChatGPT 계정 저장 + 로컬 |
| EMBER TACTICS | junsa80/ember-tactics (비공개) | GPT | https://ember-tactics.sajuyoon.chatgpt.site | ChatGPT Sites (로그인 필요) | ChatGPT 계정 저장 + 로컬 |
| 안개를 걷는 자들 | junsa80/fogbound-tactics (비공개) | GPT (Grok Bot 모바일 화면 수정 `grokbot/mobile-fit`은 main에 병합 완료) | https://fogbound-tactics-remake.sajuyoon.chatgpt.site | ChatGPT Sites (로그인 필요) | 미확인 |

- 복사본 4개는 원본 main과 내용이 같은 상태(2026-10-21 확인: rose-spire main `de7cbf4`는 `6bf8f6f` 이후 문서만 바뀜).
- GPT 게임이 GitHub Pages로 옮겨 가는 건 저장 내보내기/가져오기가 생긴 뒤(사용자 규칙).

