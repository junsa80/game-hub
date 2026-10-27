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

## 2026-10-26 — AP-01 / RT-01 / JR-01 후속 검증·인계
- Arcana 실제 수정 커밋 135adc82568c5958bdb5ec9f1196ba5f090ff87f. 이번 후속 커밋에 tests/browser-save.cjs 추가. 360×800/390×844/412×915 Chromium153 터치 에뮬레이션에서 상세창, 활성 대전 재로드, 손상 원본 보존, 잘못된 가져오기 거절, 정상 백업 복구, 가로 넘침 없음, pageerror0 PASS.
- Arcana 손상14종+고정 시드 정상376상태+기존 회귀 PASS. 공개 app.js?v=0.3.2 / Arcana index / hub sw / hub index HTTP200 및 바이트 일치. 초기 CDN 응답은 구버전이었으며 후속 확인 완료(arcana-live.json).
- Rune 테스트 확장/자체3종 문서 커밋 b7357a3c9376eff7f0ad629aec2e582fe5756432. 요청3규격+기존2규격, 주사위/터치/전투스크롤, AI4조건, 명시적 업데이트/2탭 충돌 PASS. 단위61/61. 원본 eb23040 기준 art140파일 Git blob SHA 일치; 로컬 빌드 패키징 성공. 런타임 변경 없으므로 재배포 없음.
- Chronicle 통합검사71/71, 자체 인계2092c6c2d2ef0d61e36e905c8583052582bbcd56. 자동장비/유니크/연계의뢰/저장 보존 통과. 원본e7315fa 제품 코드 수정 없음. 고공격력/직접 fixture 검사를 인간 난도 검증으로 해석하면 안 됨.
- 증거: docs/qa/portfolio-20261026/{arcana-browser,arcana-save,rune-mobile,rune-unit,chronicle-integration}.txt 및 arcana-live.json.
- 환경 보완: 공식 Playwright CDN 바이너리 수신 실패 후 npm @sparticuz/chromium153 패키지 사용. tar 소유권 설정 EINVAL은 임시 검사환경의 소유권 보존 없는 압축해제로 해결. 누락 소스/의존성/cwd 오류는 제품 결함과 분리함.
- 남은 미검증: 실물 스마트폰, 사람 정상성장 클리어율, 모든 Sites 최신 배포 일치, 장시간 음향·전투 감각. 다음 우선순위 RT-02 → ACT-01 → DEP-01. 사용량 확인은 사용자 담당.

## 2026-10-26 RT-02 — 성장 보유풀의 실제 공략 효과
- 룬 원본 커밋 `828b8b929d471245cf3bf429c2d8435492684106`: 비교 도구 개선·단위검사·원시 결과·자체 로그 반영. 현재 스테이지 보상 제외, 보유풀5종, S4/S6 일반·어려움, 학습/평가 분리.
- 기존 탐색에서는 S6 교체가 오히려 약화됨. 현재 성장 덱 유지 후보를 추가해 잘못된 교체 강제를 제거. 새 held-out400판×5보유풀: S4 일반57.05→78.60%, 어려움49.35→73.50%; S6 일반46.20→45.50%, 어려움36.55→36.80%. S6 각 난도4/5는 유지 선택. S6 개선을 입증하지 못했음.
- 전체62 단위 PASS, 두 탐색 학습+평가98,000대전 종료. 실제 autoTurn 엔진이며 인간 승률이 아님. 각 보유풀 paired CI/덱/수집량/턴수는 룬 docs/qa/GROWTH_HINTS_20261026.md 및 JSON2개 참조.
- 게임 런타임·저장·난도·카드 변경 없음, 재배포 없음. 다음 ACT-01 액션 회귀 → DEP-01 배포 일치 → RT-03 S6 선택 효용/수입·침략 실패 원인. 실물폰/정상 성장 수동 클리어 미검증.

## 2026-10-27 — ACT-01 / HN-SAVE-01 / AP-AUDIO-01
- Hunt cb919e538e849ad0598291c830d82019b6d789d5: 손상 저장 원본 보존/복구 UI. 이전 세션 모바일3규격 복구, 기존14/14+첫실행6/6+저장/캐시 회귀 통과. 오늘 공개 main.js/index/sw HTTP200 및 바이트 일치 확인. 실물폰 미검증.
- Aster1017edd: 현재 원본의 node tools/verify.mjs 다시 PASS. 무기6종/차지/적/동료 180초 실제 루프 DPS 차이 -0.77~+1.13%, 공격횟수 감소. 30/60/120FPS 회피 접촉, 영입/파티/강화/보상/저장 회귀 PASS. Node 모형/통제 조건이며 실제 화면 FPS·음향·폰 체감은 미검증.
- Aster 누락 vendor는 Hunt의 동일 Git blob0bcc7a286da2c115853ceec9deea19923e10ddc1로 복원. 코드가 없는 제품 오류가 아니라 임시 체크아웃 누락이었음. 게임 코드 변경 없음.
- Arcana 새 그림·소리144490d 이후 저장14손상/376정상상태·규칙/300판 다시 PASS. 새 소리 모듈에 숨김/pagehide 정지 누락 발견, 자동 검사 실패 재현 후 보완. 진행 중 효과음 정지, 숨김 AI 소리 차단, 복귀 시 이전에 재생 중이던 BGM만 재개, 음소거 유지. 게임 저장 미변경.
- AP-AUDIO-01 Node Audio 대역 검사 PASS. 실제 오디오 청취·모바일 앱 전환은 미검증. sound query0.3.4, 허브 캐시1.5.25. 이전 그림/소리 자산은 그대로 재사용.
- 기록: docs/qa/portfolio-20261027. 다음 DEP-01 배포 일치 확대 → RT-03 S6 선택 효용 → ACT-02 실기 조작감/성능 확인. 사용량 중단 조건 없음.

## 2026-10-27 — 공개 반영 및 다음 세션
- AP-AUDIO-01 수정 fd88c2c4197bd51400cb56907121deb401462172. 후속 Grok a217903은 world-breaker만 변경하며 이 수정을 포함. Pages run40450865167 success. 초기36중32일치→배포 후36/36 HTTP200·바이트 일치. docs/qa/portfolio-20261027/arcana-live.json(초기 응답은 initial 파일).
- Hunt 저장 보호 cb919e5 공개3파일 일치; 자체 배포 기록5f5a599. Aster 실제 엔진 회귀 인계3fd2670. 실물폰 청취/조작/성능 미검증.
- 다음 우선순위: DEP-01 Sites/원본·허브복사본 일치(최근 World Breaker 변경도 포함) → RT-03 S6 선택 효용 → ACT-02 실기 조작감/성능. 최신 원격 HEAD를 다시 읽고 다른 AI 변경을 보존할 것.

## 2026-10-27 — DEP-WB-01 월드 브레이커 재생성 시 개선 유실 방지
- 원본 a48859f와 hub a217903 비교: data/engine/trials/styles/game-score 동일. index/main/art/audio4파일 다름; 그림·샘플 소리 등은 hub 전용. 기존 BUILD_PLAY_COPIES의 rm+cp는 이 개선과 game-score를 누락할 수 있음.
- tools/build_world_breaker_copy.py + 명시적 overlay manifest 추가. 원본 편집 없이 새 staging 생성, 기존 출력 거부, 원본4파일 충돌·새 원본 자산 충돌·허브 해시 변경은 출력 전에 중단. 자동으로 최신 원본 변경을 옛 허브 코드로 덮지 않음.
- 원본 Git blob 대조10파일, 최종44파일 전체 바이트 동등 재생성 PASS. test-world-breaker-copy.py: 원본 비변이/기존 출력 보호/4코드 충돌/새 자산 충돌 PASS.
- 게임 런타임 수정·저장 변경·재배포 없음. 실제 브라우저 조작/실기 성능/소리 청취를 이 재생성 검사로 완료 처리하지 않음. 공개 HTTP 결과는 docs/qa/portfolio-20261027/world-breaker-live.json 참조.
- 다음: 다른 허브 복사본/Sites 원본 일치 확인 → RT-03 S6 선택 효용 → ACT-02 실기 입력/성능. Grok 변경이 계속될 수 있으므로 원격 HEAD 확인 후 진행.

- 공개 실행본44/44파일 HTTP200·바이트 일치 확인(2026-10-27); 게임 규칙 변경 없음. 다음 원본 갱신 시 새 재생성 도구로 충돌 검토 후 게시.

## 2026-10-27 DEP-STATIC-01 — 재생성 실패 시 기존 게임 보존
- 수정 전 임시 fixture: 없는 원본 경로 → exit1, 기존 game.js 보존 False. 운영 파일에는 재현하지 않았음.
- 수정 후 새 staging만 허용; 기존 출력/원본 내부 경로 거부, 원본 index 확인, 변환은 임시 폴더에서 완료 후 이동. UTF-8 실패 시 임시 결과 정리.
- test-static-copy.py PASS: 기존 출력·원본 보존/원본 부재/중첩 경로/해석 실패/게임 JS 바이트 유지/호스팅 변환/Pages 저장 안내. 실제 게임 실행본 변경은 다음 DEP-MUSE-01 커밋에서 별도 반영.

## 2026-10-27 — DEP-MUSE-01 모바일 개선 누락 복구
- 원본 muse-studio 1d40d29와 Pages 복사본 비교: 동일249파일, mobile.js/mobile.css/cover 누락 및 CSS/index 차이. 원본의 모바일 개선을 정적 호스팅 변환으로 복구. 기존 표지 재사용; 새 인물/외부 자산 없음.
- 추가 가독성 수정: 밝은 패널에 남은 옅은 진행도/안내/통화 글자색 보완. private PR4 https://github.com/junsa80/muse-studio/pull/4 병합 c30c4fc9351da5d1667a886274e4f636ad1afb68 (수정68d94bed). source public runtime256파일 Git blob 검증 후 재생성. 게임 JS/규칙/저장 키/계정 권한 보존.
- 이전390×844: 문서 높이2568px, nav y1512.5px. 이후 요청3규격: 문서 높이=화면높이, 촬영 버튼53px/하단7버튼44px. 6탭 터치·닫기·촬영·진행 재로드·자산로드·어두운 안내색 PASS, pageerror/HTTP오류0.
- 원본 node tools/verify.mjs 7 suite PASS. 처음 TypeScript 부재/비호환 최신 패키지 실패 후5.9.3으로 PASS. 작업경로 오입력1회 재실행 해결. 임시환경 오류와 제품 결함 구분.
- tools/test-muse-mobile.cjs 및 docs/qa/portfolio-20261027/muse-mobile.txt에 실행 근거. 실물폰·한글 글리프 시각검수(컨테이너 한국어 글꼴 부재)·음향 청취·Sites 계정 동기화 미검증.
- 기본 허브 카드 URL은 기존 Sites 유지. 이번 Pages 사본 갱신은 Sites 재배포가 아님. Pages 설정의 계정저장 오안내를 브라우저 저장/백업으로 정정. 허브 cache1.5.26.
- 다음: Sites CSS 배포 일치/장미·프리즘 복사본 차이 → 룬 RT-03 S6 선택효용 → ACT-02 실기 입력·성능. 사용량 중단 조건 없음.

## 2026-10-27 — DEP-MUSE-01 공개 확인/다음 인계
- 원본 가독성 수정68d94bed → PR4 병합 c30c4fc. 허브 복사 도구 b37fb68, 모바일 복사본1086c2e. 동시 Grok928021b의 장미 효과음/games.json은 보존함.
- Pages run40492205416 success. 첫 확인24중21일치(CSS2구버전/새 CSS404) → 배포 후24/24 HTTP200·바이트 일치. muse-live-initial.json/muse-live.json에 둘 다 기록. 확인 범위는 루트 실행파일21개+cover+hub index/sw이며 사진 자산 전체 HTTP 검사는 아님.
- 최종 사본 모바일3규격 자동검사 다시 PASS(muse-mobile.txt), static-copy 실패 보존 및 hub1.5.26 캐시격리 PASS. GitHub 소스256개 blob 동일 복원 확인. 임시 작업환경 자동정리 후 GitHub 원본에서 재구성했으며 사용자 데이터는 읽거나 옮기지 않음.
- 미검증: 실제 폰/한글 글리프 시각검수/청취, Sites에 새 CSS 배포. 기본 카드 URL은 기존 Sites이므로 Pages 수정과 구분할 것.
- 다음 우선순위 1) Sites/남은 복사본의 배포 차이(장미 최신928021b, 프리즘a155dc9)와 재생성 시 보존 검증 2) 룬 RT-03 S6 선택 효용 계측 3) ACT-02 액션 실제 스마트폰 조작감/성능. 실물폰이 없으면 자동검증 범위만 진행/기록.

## 2026-10-27 — ROSE-AUDIO-01 Pages 효과음 수명 관리
- hub13c42d2 기준928021b가 도입한 샘플 효과음 검토. tone의 재생 거절 콜백이 hidden 이후 beep를 호출해 대체음을 시작함을 Node VM으로 재현(수정 전 contexts1, 기대0). 재생 중 샘플/대체음도 숨김·음소거에서 정지하지 않았음.
- game.js: 샘플/oscillator 추적·종료 정리, hidden/pagehide 정지, AudioContext suspend, 음소거 즉시 정지. 세대 번호로 정지 이전 재생 실패 콜백을 무효화. pageshow는 잠금만 풀며 지난 효과음을 재생하지 않음. 새 사용자 행동에서만 소리 재생.
- 기존 sfx5종 그대로 사용. 덱·카드·성장·보상·저장 코드 미변경. Pages 전용 개선이므로 private 원본/Sites에 적용했다고 주장하지 않음.
- tools/test-rose-audio.cjs: 수정 전 FAIL → 후 PASS. hidden 지연 실패, 재생 중 정지, pagehide/pageshow, 음소거, 정상 실패 fallback, ended 정리. node --check와 허브 캐시격리 PASS.
- tools/test-rose-browser.cjs: Chromium153 360×800/390×844/412×915에서 새 원정·음소거·합성 pagehide·재접속 시 starter/hp/deck 유지, pageerror0 PASS. Audio 대역 사용; 실제 음향 청취·폰 앱전환·기기성능 미검증. 원시 결과 docs/qa/portfolio-20261027/rose-*.txt.
- 캐시 hub1.5.27 / Rose game.js?v=20261027-audio2. 공개 확인은 후속 로그 참조.
- 다음 우선순위: RT-03 룬 S6 선택 효용 계측 → DEP-01 남은 Sites/원본 배포 차이 → ACT-02 실제 기기 입력/성능. 장미 그림/효과음은 재생성 시 보존 필요.

## 2026-10-27 — ROSE-AUDIO-01 게시·인계
- 수정 커밋 2f7af734aa702fc435fbd52675e0341877dca967 main 반영 확인. 카드/성장/저장 로직과 기존5개 WAV 자산 보존.
- Pages run40517359874는 마지막 확인에서 queued. 첫 공개 조회9개 모두 HTTP200이나 새 코드4개는 구버전, 효과음5개만 바이트 동일. rose-live-initial.json/rose-live.json에 결과 기록. 배포 완료 또는 공개 수정 반영 완료로 처리하지 않음.
- 다음 시작 시 해당 커밋을 포함한 최신 Pages 배포와 game.js?v=20261027-audio2/hub-v1.5.27을 다시 확인. 이후 RT-03 룬 S6 경제/침략/영토손실 계측 → 남은 배포 차이 → 액션 실기 입력 순서. 실제 폰/음향 청취 미검증.
