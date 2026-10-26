# 통합 작업 로그

## 2026-10-26 — 최초 감사 기록 (GPT)
- 연결 저장소 21개/허브 게임17개 조사. 공개 원본 clone, 비공개 원본은 GitHub connector의 고정 SHA 파일 조회. 계정/권한/공개 범위 변경 없음.
- 48개 협업 문서와 주요 런타임/시험 코드 수신. 초기 검사 실패 중 의존 소스/그림/git 이력 부재는 환경 제약으로 별도 표기.
- Rune 61, Arcana 규칙/300판/UI-save 대역 통과. Free Solo 단위/저장/규칙95/시뮬 통과. Companion/Ember/Prism verify 재실행 통과. Beauty 시뮬100 설정 no crashes/softlocks/invariant violations.
- Fog 91/92; 남은 자산 검사 환경 부족. Aster vendor, Last Archive 구버전 git 비교, Rose/Muse 이미지 등은 전체 통과로 보고하지 않음.
- 공개 허브17카드와 Arcana 홈 브라우저 확인. 로컬 Chromium 다운로드가 ZIP 손상으로 실패; 요청3크기·실물폰 미검증.
- 실제 코드 변경 전 PORTFOLIO_AUDIT / MASTER_BACKLOG 저장. 다음: 세 SW의 다른 게임 캐시 삭제를 재현→격리→회귀→작은 커밋/라이브 확인.
- 사용량 조회 도구 없음. 3개 수정 완료 후 사용자 잔여량 확인. 리셋/추가 크레딧 사용 없음.

## 2026-10-26 — GPT 캐시 격리 수정 (game-hub, cache 1.5.23)
- 수정 전 activate 이벤트가 현재 버전 외 모든 origin 캐시를 삭제함을 재현. 같은 junsa80.github.io의 다른 게임 오프라인 자산이 지워질 수 있음.
- sw.js는 자기 게임 접두사의 구버전만 정리. index.html 자산 쿼리/캐시 버전 갱신. 게임 규칙·저장 키·영입·성장 변경 없음.
- `node tools/test-cache-isolation.cjs`: 수정 전 FAIL → 수정 후 PASS. 타 게임 캐시 내용·현재 캐시 보존, 자기 구버전 삭제, 반복 활성화 검증. Node VM 대역 검사이며 실제 폰 오프라인 검사는 미검증.
- 공개본 확인은 game-hub/logs/WORKLOG.md의 통합 결과 참조.

## 2026-10-26 — 3개 수정 종료·배포 확인·인계
- CACHE-01 game-hub: 7b6988dc614e7c911ab76b6ee280957af6b7cc99 / hub-v1.5.23.
- CACHE-02 hunt-now: 4b8f08395d2a8b9cc510ce503500698f418d9b13 / hunt-now-v6.1.1.
- CACHE-03 beauty-deck: 81322d56a6b518a3673287fe6eee99f64a02832a / beautydeck-v1.5.2.
- 세 저장소 모두 원격 HEAD 일치 확인 후 non-force main 갱신. 변경: sw.js/index.html, 캐시 회귀 테스트, 해당 HANDOFF/WORKLOG만.
- 수정 전3/3 FAIL→수정 후3/3 PASS. 타 캐시 내용 유지·자기 구버전 정리·현재 버전 보존·반복 활성화. 미녀 덱 저장60/60 PASS. 모든 precache 경로 실제 파일 존재, diff --check 통과.
- Pages 3곳의 sw.js/index.html 총6파일 HTTP200 및 수정본 바이트 일치. 첫 조회 hunt SW는 배포 진행 중 구버전이었고 후속 조회에서 일치. 원자료 docs/qa/portfolio-20261026/cache-live.json.
- 실제 스마트폰/오프라인 브라우저 수명주기 검사는 미실행. 배포 파일 일치를 실기 검증으로 표현하지 않음. 기존 게임 규칙/저장/성장 코드 수정 없음.
- 최초 감사 커밋95ca39fc0ea3b84e782968ef6c416a29d5cec583, 이번 원격 기준 hub d783b11/hunt0213d32/beautye3271b9. 중간 타 작업자의 개선을 과거 감사 결과와 혼합하지 않음.
- 다음: AP-01 → RT-01 → JR-01. AP는 아직 결함 영향 재현 전 후보. 전체17게임 실전 완주와3규격 QA는 미완료.
- 3개 작업 완료로 사용량 점검 시점. 조회 불가, 수치 추측 없음. 사용자가 잔여량 확인 후30% 보존 목표에 맞춰 다음 묶음 진행.

## 2026-10-26 — AP-01 손상 대전 저장 보호 (Alpha 0.3.2 / hub 1.5.24)
- 실제 재현: JSON 파싱은 성공하지만 battle.log가 없으면 battleView의 join에서 부팅 중단. 이전 validate가 통과시켜 시작 시 저장도 수행됨.
- 저장/가져오기 공통 validate에서 대전 기록, 자원, 피로, 턴/승자, 유닛 종류·체력·UID·준비 상태, 전장/손패 상한, 성장 보상을 검사. 잘못된 값은 기존 원본 보존·복구 안내 경로로 처리. 전투 기록은 HTML이 아닌 텍스트로 표시.
- 자동검사: 손상14종 거절/원문 보존, 고정 시드 실제 엔진 활성 대전376개 동일 복원, 기존12장 저장 이관·미완성 덱·보상·재도전 회귀 통과. 규칙/성장 및 AI300판 종료 통과. 사람 승률 자료가 아님.
- 저장 키/버전/카드 능력/보상/정상 데이터는 변경하지 않음. 실물 폰 및 이번 변경의 실제 브라우저 복구 조작은 미검증.

- SW 회귀 첫 호출은 저장소 밖 cwd로 실행하여 ENOENT 발생(제품 실패 아님). 저장소 루트에서 재실행 PASS.
- 사용자가 잔여 사용량 확인을 직접 담당한다고 명시. 사용량 확인을 이유로 작업을 중단하지 않음.
