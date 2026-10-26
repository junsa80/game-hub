# 2026-10-26 [GrokBot] rose-spire · muse-studio · world-breaker · prism-muse 읽기 전용 점검

원본 저장소에는 아무것도 푸시하지 않음(BUILD_PLAY_COPIES 원칙). 원본은 로컬 읽기 전용 작업 트리에서 테스트만 실행했고, 브라우저 점검은 허브 복사본으로 함.
BUILD_PLAY_COPIES에 "게임 코드는 바꾸지 않고 호스팅에 필요한 수정만"이라고 되어 있어서 복사본도 고치지 않음 → 아래는 발견 사항과 제안만.
브라우저는 헤드리스 Chrome 에뮬레이션(실기기 아님).

| 게임 | 원본 SHA | 브라우저 점검 대상 복사본 |
|---|---|---|
| rose-spire | 73981b1 | game-hub #13 브랜치 play/rose-spire (원본 main에서 새로 만든 것) |
| muse-studio | 1d40d29 | game-hub #13 브랜치 play/muse-studio |
| world-breaker | a48859f | game-hub main play/world-breaker |
| prism-muse | 90a10a1 | game-hub #14 브랜치 play/prism-muse |

## 1. 원본 자체 테스트 (읽기 전용 실행)
- rose-spire `node tools/verify.mjs` 통과 · muse-studio 통과 · prism-muse 통과(48항목) · world-breaker `npm test` 76/76 통과

## 2. 진행 중 새로고침 (`tools/qa/grokbot/reload-mid-run.cjs`, 360/390/412)
- rose-spire: 전투 중(체력·적 체력·손패·에너지) 새로고침 전후 같음 ×3
- muse-studio: 누적 수입·처치·단계 같음 ×3
- world-breaker: 같은 판 이어짐(실시간 게임이라 새로고침 사이 시간만큼 진행) ×3, 오류 0
- prism-muse: game-hub #14에서 확인(진행 중 보드 49칸 복원, 상태 차이 0)

## 3. 두 탭 동시 진행 덮어쓰기 — **진행 손실 재현됨 (네 게임 모두)**
| 게임 | 재현 | 결과 |
|---|---|---|
| rose-spire | 탭 A(타이틀)를 연 채 탭 B에서 원정 시작→패배까지(runs 1, 발견 카드 3, 유물 1) → B 닫기 → A 닫기(pagehide 저장) | 다시 열면 runs 0, 카드 0, 유물 0 → **LOST** (`rose-multitab.cjs`). 원정이 진행 중일 때는 다음 저장 때 일부 다시 채워지지만, 끝난 원정의 기록·해금은 영구 손실 |
| muse-studio | 탭 A를 연 채 탭 B에서 촬영 60번(누적 120, 처치 5) → B 닫기 → A의 5초 주기 저장 | 다시 열면 누적 0, 처치 0 → **LOST** (`muse-multitab.cjs`) |
| world-breaker | 탭 A를 연 채 탭 B에서 강화 '강철 도끼' 구매(B 즉시 저장) → B 닫기 → A로 돌아와 숨김/닫힘(pagehide 저장) | 다시 열면 강화 {} · 나무 34(A의 값) → **LOST** (`world-breaker-multitab.cjs`, 2026-10-26 배치5). B의 값은 `-backup`에 한 단계 남지만 주 저장이 깨졌을 때만 자동으로 읽으므로 사용자가 되찾을 길 없음 |
| prism-muse (허브 main 사본) | 탭 A를 연 채 탭 B에서 도전 시작 + 유효 매치 1회(계정 기록 moves 1) → B 닫기 → A로 돌아와 숨김/닫힘 | 다시 열면 진행 중 도전 없음, moves 0 → **LOST** (`prism-multitab.cjs`). A가 아무것도 안 해도 숨김 때 A 상태를 가짜 서버 저장(`prism-muse-static-save`)에 올리고, 다시 열 때 그 값을 먼저 읽음 |
| prism-muse (#14 사본) | 같은 방식 | A가 아무것도 안 하면 **KEPT**(#14의 가짜 fetch가 변경마다 쓰는 `prism-muse-backup`을 먼저 읽음). A가 무엇이든 바꾸면(예: A에서 도전 시작) A의 상태가 backup을 덮어 moves 1→0 **LOST** (`STALE_ACTION='도전 시작'`) |

원인: 각 탭이 메모리의 전체 상태를 주기/닫힘 때 통째로 저장하고, 다른 탭이 더 새 기록을 썼는지 확인하지 않음.
prism-muse 원본은 이미 버전 충돌 처리를 갖고 있음: 저장 때 `{state,version}`을 보내고 서버가 409를 주면 '서버 기록으로 이어하기 / 이 기기 기록을 서버에 저장 / 다운로드' 선택 창을 띄움. 그런데 허브 사본의 가짜 fetch(빌드 패치 `prism-muse-static.patch`)는 POST 때 버전을 비교하지 않고 항상 +1 → 원본의 충돌 창이 허브에서는 절대 안 뜸. 즉 prism은 게임 코드가 아니라 **호스팅 패치의 차이**로 생긴 손실. 원본 Sites판의 cloud-save.js(계정 저장)도 같은 구조(muse-studio의 cloud-save.js는 companion-guild main과 같은 파일). 허브 복사본은 cloud-save.js를 빼서 순수 localStorage.

### 제안 (사용자 결정 필요, 미적용)
- 원본: companion-guild #5 / ember-tactics #5와 같은 cloud-save.js 수정(기존 선택 창 재사용, `<키>-conflict` 사본)을 muse-studio에 그대로, rose-spire에는 saveKeys 판에 맞춰 적용
- prism-muse 허브 사본(가장 작은 수정 후보): 빌드 패치의 가짜 fetch POST에서 `body.version!==저장된 version`이면 409를 돌려주기(한 줄). 원본이 가진 충돌 선택 창을 그대로 살리는 것이고 게임 코드·tab-guard.js가 아님. 다만 허브 쪽 저장 동작 변경이라 결정 필요(#14 패치에 넣을지)
- 허브 복사본: cloud-save.js가 빠져 있으므로 make_static_copy.py가 작은 `tab-guard.js`(다른 탭이 더 새 기록을 썼으면 쓰지 않고 새로고침 안내)를 넣는 방식이 가능. 단 "게임 코드는 바꾸지 않는다" 원칙과 충돌하므로 결정 필요

## 4. 패배→재도전
- rose-spire: 턴 종료만 반복해 패배 → runs 1 기록, 원정 키 삭제, 새 원정 시작 가능(위 재현 과정)
- 나머지: 원본 테스트(world-breaker progression/balance, prism-muse game.test)에 포함, 별도 브라우저 확인은 안 함(미검증)

## 재현 스크립트
`tools/qa/grokbot/*.cjs` — `PW=<playwright-core 경로> node tools/qa/grokbot/rose-multitab.cjs [URL]`. 로컬 정적 서버에서 허브를 /game-hub/ 경로로 띄워야 함(prism은 basePath 때문에 필수).
