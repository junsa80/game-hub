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

## 3. 두 탭 동시 진행 덮어쓰기 — **진행 손실 재현됨 (rose-spire, muse-studio)**
| 게임 | 재현 | 결과 |
|---|---|---|
| rose-spire | 탭 A(타이틀)를 연 채 탭 B에서 원정 시작→패배까지(runs 1, 발견 카드 3, 유물 1) → B 닫기 → A 닫기(pagehide 저장) | 다시 열면 runs 0, 카드 0, 유물 0 → **LOST** (`rose-multitab.cjs`). 원정이 진행 중일 때는 다음 저장 때 일부 다시 채워지지만, 끝난 원정의 기록·해금은 영구 손실 |
| muse-studio | 탭 A를 연 채 탭 B에서 촬영 60번(누적 120, 처치 5) → B 닫기 → A의 5초 주기 저장 | 다시 열면 누적 0, 처치 0 → **LOST** (`muse-multitab.cjs`) |
| world-breaker | 같은 방식 | 미검증: 두 탭이 같은 시드로 같이 진행돼 차이가 안 생김. 코드상 save()에 탭 확인 없음, 대신 저장 직전 값을 `-backup`에 한 단계 보관(수동 복구 가능성) |
| prism-muse | B에서 도전 시작, A에서 모드 선택 | 미검증: A 동작이 저장값을 바꾸지 않음. 코드상 상태가 바뀔 때마다 `prism-muse-backup`을 쓰고 탭 확인 없음 |

원인: 각 탭이 메모리의 전체 상태를 주기/닫힘 때 통째로 저장하고, 다른 탭이 더 새 기록을 썼는지 확인하지 않음. 원본 Sites판의 cloud-save.js(계정 저장)도 같은 구조(muse-studio의 cloud-save.js는 companion-guild main과 같은 파일). 허브 복사본은 cloud-save.js를 빼서 순수 localStorage.

### 제안 (사용자 결정 필요, 미적용)
- 원본: companion-guild #5 / ember-tactics #5와 같은 cloud-save.js 수정(기존 선택 창 재사용, `<키>-conflict` 사본)을 muse-studio에 그대로, rose-spire에는 saveKeys 판에 맞춰 적용
- 허브 복사본: cloud-save.js가 빠져 있으므로 make_static_copy.py가 작은 `tab-guard.js`(다른 탭이 더 새 기록을 썼으면 쓰지 않고 새로고침 안내)를 넣는 방식이 가능. 단 "게임 코드는 바꾸지 않는다" 원칙과 충돌하므로 결정 필요

## 4. 패배→재도전
- rose-spire: 턴 종료만 반복해 패배 → runs 1 기록, 원정 키 삭제, 새 원정 시작 가능(위 재현 과정)
- 나머지: 원본 테스트(world-breaker progression/balance, prism-muse game.test)에 포함, 별도 브라우저 확인은 안 함(미검증)

## 재현 스크립트
`tools/qa/grokbot/*.cjs` — `PW=<playwright-core 경로> node tools/qa/grokbot/rose-multitab.cjs [URL]`. 로컬 정적 서버에서 허브를 /game-hub/ 경로로 띄워야 함(prism은 basePath 때문에 필수).
