# GrokBot 작업 로그 (충돌 방지용 별도 파일)

GPT의 `logs/WORKLOG.md`와 분리. 각 항목: 프로젝트·작업 ID / 수정 / 파일 / 테스트 / PR / 남은 문제 / 다음.
테스트 환경 표기: "브라우저 에뮬레이션" = 로컬 Chromium(Playwright, 모바일 뷰포트·터치 에뮬). 실물 휴대폰 아님.

## 2026-10-26 — Arcana Pocket · AP-01 손상 세이브 가드
- 재현(브라우저 에뮬레이션 390×844): 저장된 진행 대전에 `battle.log`가 없거나 배열이 아니면 `battleView()`의 `b.log.join`이 예외 → `#app`이 빈 화면, 매 부팅 반복(원본은 남지만 게임 진입 불가). `newReward`가 알 수 없는 카드 id면 홈 렌더에서 `G.by[..].name` 예외. `progress`가 깨지면 `undefined / 3` 표시·NaN 누적.
- 수정: `app.js` validate에 `repairBattle()` — 표시용/파생 필드(log, round, uid 중복·누락, mana/max/fatigue, winner)만 보수. 체력이 숫자가 아닌 유닛처럼 추측 불가한 손상은 기존 복구 모드로 보내 원본을 그대로 보존. `progression.js` migrate에서 progress·newReward 정규화. index.html 스크립트 캐시 버전 0.3.2.
- 파일: play/arcana-pocket/{app.js, progression.js, index.html, tests/save-guard.cjs}
- 테스트: `node tests/save-guard.cjs` 10/10, 기존 `ui-smoke.cjs`, `test.cjs`(300판) 통과. 브라우저 에뮬레이션 손상 10종: 수정 전 2종 빈 화면 → 수정 후 0종, 복구 불가 1종은 원본 보존 확인. 360×800/390×844/412×915 전체 루프(허브 진입→표지 로드→대전→카드 사용→AI 턴→새로고침 복원→패배→대응 카드→덱 교체→재도전→항복→승리→팩 개봉→새로고침) 통과, 콘솔 오류·4xx 0.
- 기존 세이브 키·규칙·카드·도감 변경 없음. 정상/Alpha0.1 세이브 동일 로드 테스트 포함.
- 남은 문제: Sites 원본(별도 origin)에는 미반영 — 원본 담당(GPT) 판단 필요. 실물 폰 미검증.

## 2026-10-26 — Arcana Pocket · AP-02 모바일 최소 크기 (#8 위에 쌓음)
- 측정(브라우저 에뮬레이션 360×800/390×844/412×915): 12px 미만 글자 5종(헤더 부제 9–10px, 표지 라벨 9px, eyebrow 11px), 44px 미만 버튼(탭 4개 40px, 항복 48×32, 턴 종료 82×40, 상대 리더 공격 영역 36px, 브랜드 40px).
- 수정: style.css 끝에 최소값 블록 1줄 추가(기존 규칙 삭제 없음), style.css?v=0.3.2.
- 테스트: 3크기 × 5화면(홈·대전·보상 선택·팩·컬렉션) 12px 미만 0, 44px 미만 활성 버튼 0, 가로 넘침 0. 대전 화면은 여전히 한 화면(손패 하단 681px < 800, 문서 높이 = 뷰포트). 전체 루프 회귀 통과. 전후 비교: docs/qa/arcana-0.3.2/.
- 남은 문제: 실물 폰 터치감 미검증.

## 2026-10-26 — Arcana Pocket · AP-03 대전 중 덱 교체 무반응 (#9 위에 쌓음)
- 재현(브라우저 에뮬레이션 390×844): 대전 진행 중 컬렉션 탭 → 대응 카드 선택 → 덱 교체 미리보기 → "이 교체 적용"을 눌러도 `P.apply`가 battle 때문에 false → 모달 그대로, 안내 없음.
- 수정: 대전 중에는 적용 버튼을 비활성화하고 "진행 중인 대전이 끝난 뒤 적용 가능, 해금 카드는 이미 보관됨" 안내. 대전 종료 후 홈에서 같은 흐름으로 적용됨 확인. app.js?v=0.3.3.
- 테스트: save-guard 11/11(applyInBattle 추가), ui-smoke, test.cjs 300판, 3크기 e2e FAILS 0. 전후: docs/qa/arcana-0.3.2/390x844_apply_in_battle_before_after.webp.
