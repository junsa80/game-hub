# 게임 포트폴리오 감사 — 2026-10-26

## 범위와 증거 수준

계정 연결 21개 저장소, 허브 17개 게임을 전수 목록화했다. 현재 트리·주요 런타임·인계 문서·선택 자동 검사를 조사한 1차 감사다. 모든 게임의 모든 기능을 실전 완주한 최종 인증이 아니다. 미검증은 정상/완료로 간주하지 않는다. 비공개 소스와 개인 세이브는 이 공개 문서에 복사하지 않는다.

코드 확인 / 자동 검증 / 실제 브라우저 / 실물 휴대폰을 구분한다. 전 게임 실물 휴대폰·음향 청취·장기 플레이·두 기기 저장 동기화는 미검증. 로컬 Chromium 설치가 손상 다운로드로 실패하여 요청한 360×800, 390×844, 412×915 일괄 실행은 아직 미검증이다. 공개 허브 브라우저에서는 17개 카드와 Arcana 홈/표지를 확인했다.

## 프로젝트별 현황

|게임·저장소|감사 기준 SHA|현재 구현·검증|구체적 근거|문제/미검증|
|---|---|---|---|---|
|헌트 나우: 정화의 사냥꾼 / `hunt-now`|`76db4f4f8d253417cdd3bc25f333ab4f33c329be`|사냥 Lv·긴급 의뢰·정화 영입·무기 성장 코드 존재|`main.js, data.js, mentor.js, synergy.js`|SW가 다른 게임 캐시 삭제. 3D·터치·동료 성장 실전 회귀 미검증|
|미녀 덱: 밤의 여왕 / `beauty-deck`|`19a913ad25fcb67e3fe12360799852d2ee74634a`|7인 성장·오늘의 원정·승천 코드; 100판 설정 시뮬 종료 통과|`engine.js, ui.js, data.js, test/sim.js`|SW가 다른 게임 캐시 삭제. 인간 승률·실기 손패 가독성 미검증|
|잿빛 왕관: 새벽의 서약 / `srpg-prototype`|`1283d0424ccbbf75648963c61e1687c66ef80567`|캠페인·성장·저장·배포 파일 존재; 최근 장별 난이도 기록 확인|`chapters/chapter_data.gd, tests/, docs/index.pck`|Godot 부재로 이번 실행 미검증. STORY.md의 1~6장 설명은 최신 HANDOFF와 불일치|
|환상 콜라보 / `fantasy-collab-battle`|`b164be59bfb44305a3ede9d60cecf166712daf33`|방 선택·동료 성장·자동장비·의뢰·승천 코드 존재|`js/run-core.js, js/meta.js, js/quest.js (public runtime)`|현재 본편은 fantasy-collab-battle; 구 Godot/fantasy-collab-play는 보존 참고본. 완주·장비 실전 회귀 미검증|
|룬 영토 / `rune-territories`|`eb230403c12af9efd06152097c03790e23afa475`|61개 자동 검사 통과; 성장 인벤토리와 S6 상대 덱 합법성 확인|`src/game.js, src/app.js, tests/, tools/progression-model.mjs`|주사위·내부 스크롤·3개 요청 화면 크기 브라우저 재검증 필요. 공략 덱 paired held-out 비교는 미실행|
|장미의 첨탑 · ROSE SPIRE / `rose-spire`|`73981b146295603d940dabf59a9109228881e336`|덱·보스·영구 성장·클라우드 충돌 검사 코드 존재|`public/engine.js, progression.js, cloud-save.js`|검사 묶음은 로컬 미수신 그림/manifest 등으로 실패. 게임 결함으로 판정하지 않음; 배포/실기 미검증|
|아스터 헌트 · 정화의 사냥 / `aster-hunt`|`1017eddbe9665d3a94e6662161641a9ae4d1984d`|정화 영입·중복 방지·성장·무게감 타이밍 코드 존재|`dist/game.js, rules.js, motion.js, beast-visual.js`|검사 실행은 로컬 vendor/three 미수신으로 중단; 영입 삭제로 단정하지 않음. GL·타격감 실기 미검증|
|종말계승 · LAST ARCHIVE / `last-archive`|`4e1d9f633558955bd4d982e873558d429b72d846`|5스탯·친구·서포터·계승 코드; 기본/UI 대역 검사 통과|`dist/engine.js, app.js, tests/`|전체 검사 중 그림 및 git show 구버전 비교는 로컬 이력 미확보로 실패. 실제 육성 난도 미검증|
|동료 길드 · Companion Guild / `companion-guild`|`265fd2d0ccd63ff34ff6e2b57a02b20b65159a32`|verify 통과: 생산·시설·영입·탐험·저장 충돌·UI 핸들러|`public/engine.mjs, app.js, cloud-save.js`|실제 두 기기 동기화·오프라인 시간·3개 모바일 크기 미검증|
|EMBER TACTICS / `ember-tactics`|`9f5b9fc233a5686511db5387f0d54a41b4622100`|verify 통과: 전투 UI·캠페인·대사·클라우드 충돌|`public/js/, public/cloud-save.js`|실제 모바일 전투 애니메이션·장편 성장 균형 미검증|
|PRISM MUSE / `prism-muse`|`90a10a104d92a4fdba528de616e302bb2e84fa97`|verify 통과: 퍼즐39·게스트3 및 제스처/저장/음악 검사|`lib/game.mjs, gesture.mjs, app/page.tsx`|모든 모드의 실제 손가락 조작·리워드 선택 균형 미검증|
|뮤즈 스튜디오 / `muse-studio`|`1d40d29587c6290e297ab3f70da197c9b419397b`|촬영·성장·관계·저장 모듈 존재|`public/, tests/`|전체 검사 일부는 미수신 이미지 때문에 실패. 장기 오프라인 경제·클라우드 실기 미검증|
|안개를 걷는 자들 / `fogbound-tactics`|`b6a57a0a70ba654794fcfab17b18ac95bcaf98f6`|92개 중 91 통과; 전술·저장·이야기·입력 대역 확인|`dist/engine.mjs, tactics.mjs, storage.mjs`|1개 자산 해시 검사는 감사 환경의 이미지/manifest 미수신. 실제 프레임·PWA·소리 미검증|
|월드 브레이커 / `world-breaker`|`a48859f6489681b14d5f07001a9b502722c60e4c`|작업·성장·엔딩 후 시련 코드 존재|`src/engine.js, trials.js, main.js`|초기 검사 스크립트 누락은 환경 문제. 원본→허브 복사본 동기화와 엔딩 후 흐름 확인 필요|
|경계의 서약 / `chronicle-crossing`|`e7315fa498e914bfe7aff4ada65774ae2ace35a9`|자동장비·연계 던전·유니크 보상 코드 존재; TS 원본 이전 확인|`src/native/NativeGame.ts, systems/EquipmentSystem.ts, content/CompanionQuests.ts`|첫 검사에서 가져오지 않은 의존 소스 누락; 전체 71개 재실행 및 3개 화면 크기 확인 필요|
|무료 싱글 TCG · FREE SOLO TCG / `free-solo-tcg`|`4406028e54d0c67e2c64de467e33ca4f710e23fd`|단위·저장·95규칙·단계별 시뮬 통과; 5단계 진행 덱 승률 단조 감소|`src/game.js, save.js, smartai.js, tests/`|진행중 대전 저장은 미구현(프로필만 저장). Arcana와 별개. 실기·현재 모바일 스모크 미실행|
|아르카나 포켓 / `game-hub`|`177dccb1db86e3bc3f4c7e1df66c8ae03db97a18`|규칙·300판 종료·UI/save 대역 통과; 공개 홈 로드 확인|`play/arcana-pocket/{engine,progression,app,art}.js`|실제 첫 패배→교체→재도전 전체 UI와 손상 battle 상세 검증·3개 크기 미검증|

## 공통 검토 축

- 핵심 루프·보상·성장: 위 코드/시험이 있는 항목만 구현 확인. 아직 설계인 Rune 전술 확장과 Free Solo 추가 카드 제안은 구현 완료로 세지 않음.
- 밸런스: 봇 결과를 인간 승률로 변환하지 않음. Rune S4/S6의 정상 획득 인벤토리 fixture는 검증됐지만 전략 대응 효과는 추가 paired seed 측정 필요.
- 그래픽·애니메이션·음악: 현재 자산 및 타이밍/라이프사이클 코드 확인과 실제 감상 평가는 별개. 기존 그림·스프라이트·합성음 모듈을 유지하며 재활용 후보로 기록. 신규 외부 자산 반입 없음.
- 모바일: 자동 DOM 대역 검사는 레이아웃 검사 아님. 본 세션의 3규격/실기 미검증을 기존 HANDOFF의 과거 성공으로 대체하지 않음.
- 저장: localStorage/IndexedDB/계정 저장 구분 유지. 이번 감사는 개인 저장을 읽지 않음. 세 게임 SW의 공유 CacheStorage 삭제는 localStorage 삭제와 다른 문제.
- 회귀: 아스터 영입/성장과 두 JRPG 장비/퀘스트 코드가 남아 있음을 확인. 과거 기능 전체 동일성은 미검증.
- 미사용/재활용: fantasy-collab 구 Godot, rift, Chronicle 구 Phaser scenes는 참고용으로 보존. 원작 EotF 자료의 권리 확인 전 재사용 금지.
- 계획 누락: Rune TASKS 초기 항목과 최신 코드, Chronicle HANDOFF 과거 “원본 없음”, SRPG STORY의 장 수는 오래된 기록과 최신 상태를 구분해야 함.

## 우선 발견

공통 결함: game-hub/sw.js, hunt-now/sw.js, beauty-deck/sw.js activate가 현재 캐시를 제외한 모든 origin 캐시를 삭제한다. 같은 junsa80.github.io의 다른 게임 오프라인 자산까지 제거된다. 사용자 세이브 손실로 확대 해석하지 않는다. 자신의 접두사만 정리하고 다른 게임 캐시를 보존하도록 순차 수정한다.

## 다음 인계

MASTER_BACKLOG와 logs/WORKLOG를 먼저 읽는다. 이번 기준 이후 원격 main 변경을 다시 확인한다. 잔여 Work 사용량은 도구로 조회 불가. 3개 수정 작업 후 잔여량을 사용자에게 확인하고 다음 묶음을 시작한다.

## 후속 수정 및 시점 구분

2026-10-26 재개 시 원격이 갱신되어 hub d783b11, hunt 0213d32(v6.1.0), beauty e3271b9(v1.5.1)를 새 기준으로 사용했다. 위 최초 감사의 밸런스/QA 결과는 각 당시 SHA에만 해당한다. 최근 타 작업자의 동료 레벨·UI/저장 수정은 본 세션의 전체 재감사 완료를 뜻하지 않는다.

CACHE-01/02/03 수정 전 재현 3/3 실패 → 수정 후 3/3 통과. 실제 SW activate 코드를 Node VM에서 실행해 타 게임 캐시 내용, 현재 캐시, 자기 구버전 정리 및 반복 활성화를 확인했다. 실제 브라우저의 오프라인 모드/서비스워커 수명주기는 아직 미검증이다. 미녀 덱 최신 저장 검사 60/60 통과.

공개 진입점 HTTP: Pages 게임9개는 200, Sites8개는 이 실행 환경에서403. 이는 Sites 게임 자체의 장애/비공개 전환 증거가 아니다. 공개 허브와 Arcana 홈 브라우저 확인은 별도 수행했다. 요청한 모바일3규격과 실물폰은 여전히 미검증. 원자료 docs/qa/portfolio-20261026/.

## 2026-10-26 — AP-01 손상 대전 저장 보호 (Alpha 0.3.2 / hub 1.5.24)
- 실제 재현: JSON 파싱은 성공하지만 battle.log가 없으면 battleView의 join에서 부팅 중단. 이전 validate가 통과시켜 시작 시 저장도 수행됨.
- 저장/가져오기 공통 validate에서 대전 기록, 자원, 피로, 턴/승자, 유닛 종류·체력·UID·준비 상태, 전장/손패 상한, 성장 보상을 검사. 잘못된 값은 기존 원본 보존·복구 안내 경로로 처리. 전투 기록은 HTML이 아닌 텍스트로 표시.
- 자동검사: 손상14종 거절/원문 보존, 고정 시드 실제 엔진 활성 대전376개 동일 복원, 기존12장 저장 이관·미완성 덱·보상·재도전 회귀 통과. 규칙/성장 및 AI300판 종료 통과. 사람 승률 자료가 아님.
- 저장 키/버전/카드 능력/보상/정상 데이터는 변경하지 않음. 실물 폰 및 이번 변경의 실제 브라우저 복구 조작은 미검증.

## 2026-10-26 — AP-01 / RT-01 / JR-01 후속 검증·인계
- Arcana 실제 수정 커밋 135adc82568c5958bdb5ec9f1196ba5f090ff87f. 이번 후속 커밋에 tests/browser-save.cjs 추가. 360×800/390×844/412×915 Chromium153 터치 에뮬레이션에서 상세창, 활성 대전 재로드, 손상 원본 보존, 잘못된 가져오기 거절, 정상 백업 복구, 가로 넘침 없음, pageerror0 PASS.
- Arcana 손상14종+고정 시드 정상376상태+기존 회귀 PASS. 공개 app.js?v=0.3.2 / Arcana index / hub sw / hub index HTTP200 및 바이트 일치. 초기 CDN 응답은 구버전이었으며 후속 확인 완료(arcana-live.json).
- Rune 테스트 확장/자체3종 문서 커밋 b7357a3c9376eff7f0ad629aec2e582fe5756432. 요청3규격+기존2규격, 주사위/터치/전투스크롤, AI4조건, 명시적 업데이트/2탭 충돌 PASS. 단위61/61. 원본 eb23040 기준 art140파일 Git blob SHA 일치; 로컬 빌드 패키징 성공. 런타임 변경 없으므로 재배포 없음.
- Chronicle 통합검사71/71, 자체 인계2092c6c2d2ef0d61e36e905c8583052582bbcd56. 자동장비/유니크/연계의뢰/저장 보존 통과. 원본e7315fa 제품 코드 수정 없음. 고공격력/직접 fixture 검사를 인간 난도 검증으로 해석하면 안 됨.
- 증거: docs/qa/portfolio-20261026/{arcana-browser,arcana-save,rune-mobile,rune-unit,chronicle-integration}.txt 및 arcana-live.json.
- 환경 보완: 공식 Playwright CDN 바이너리 수신 실패 후 npm @sparticuz/chromium153 패키지 사용. tar 소유권 설정 EINVAL은 임시 검사환경의 소유권 보존 없는 압축해제로 해결. 누락 소스/의존성/cwd 오류는 제품 결함과 분리함.
- 남은 미검증: 실물 스마트폰, 사람 정상성장 클리어율, 모든 Sites 최신 배포 일치, 장시간 음향·전투 감각. 다음 우선순위 RT-02 → ACT-01 → DEP-01. 사용량 확인은 사용자 담당.

## 2026-10-27 — ACT-01 / HN-SAVE-01 / AP-AUDIO-01
- Hunt cb919e538e849ad0598291c830d82019b6d789d5: 손상 저장 원본 보존/복구 UI. 이전 세션 모바일3규격 복구, 기존14/14+첫실행6/6+저장/캐시 회귀 통과. 오늘 공개 main.js/index/sw HTTP200 및 바이트 일치 확인. 실물폰 미검증.
- Aster1017edd: 현재 원본의 node tools/verify.mjs 다시 PASS. 무기6종/차지/적/동료 180초 실제 루프 DPS 차이 -0.77~+1.13%, 공격횟수 감소. 30/60/120FPS 회피 접촉, 영입/파티/강화/보상/저장 회귀 PASS. Node 모형/통제 조건이며 실제 화면 FPS·음향·폰 체감은 미검증.
- Aster 누락 vendor는 Hunt의 동일 Git blob0bcc7a286da2c115853ceec9deea19923e10ddc1로 복원. 코드가 없는 제품 오류가 아니라 임시 체크아웃 누락이었음. 게임 코드 변경 없음.
- Arcana 새 그림·소리144490d 이후 저장14손상/376정상상태·규칙/300판 다시 PASS. 새 소리 모듈에 숨김/pagehide 정지 누락 발견, 자동 검사 실패 재현 후 보완. 진행 중 효과음 정지, 숨김 AI 소리 차단, 복귀 시 이전에 재생 중이던 BGM만 재개, 음소거 유지. 게임 저장 미변경.
- AP-AUDIO-01 Node Audio 대역 검사 PASS. 실제 오디오 청취·모바일 앱 전환은 미검증. sound query0.3.4, 허브 캐시1.5.25. 이전 그림/소리 자산은 그대로 재사용.
- 기록: docs/qa/portfolio-20261027. 다음 DEP-01 배포 일치 확대 → RT-03 S6 선택 효용 → ACT-02 실기 조작감/성능 확인. 사용량 중단 조건 없음.

## 2026-10-27 — DEP-WB-01 월드 브레이커 재생성 시 개선 유실 방지
- 원본 a48859f와 hub a217903 비교: data/engine/trials/styles/game-score 동일. index/main/art/audio4파일 다름; 그림·샘플 소리 등은 hub 전용. 기존 BUILD_PLAY_COPIES의 rm+cp는 이 개선과 game-score를 누락할 수 있음.
- tools/build_world_breaker_copy.py + 명시적 overlay manifest 추가. 원본 편집 없이 새 staging 생성, 기존 출력 거부, 원본4파일 충돌·새 원본 자산 충돌·허브 해시 변경은 출력 전에 중단. 자동으로 최신 원본 변경을 옛 허브 코드로 덮지 않음.
- 원본 Git blob 대조10파일, 최종44파일 전체 바이트 동등 재생성 PASS. test-world-breaker-copy.py: 원본 비변이/기존 출력 보호/4코드 충돌/새 자산 충돌 PASS.
- 게임 런타임 수정·저장 변경·재배포 없음. 실제 브라우저 조작/실기 성능/소리 청취를 이 재생성 검사로 완료 처리하지 않음. 공개 HTTP 결과는 docs/qa/portfolio-20261027/world-breaker-live.json 참조.
- 다음: 다른 허브 복사본/Sites 원본 일치 확인 → RT-03 S6 선택 효용 → ACT-02 실기 입력/성능. Grok 변경이 계속될 수 있으므로 원격 HEAD 확인 후 진행.

## 2026-10-27 — DEP-MUSE-01 모바일 개선 누락 복구
- 원본 muse-studio 1d40d29와 Pages 복사본 비교: 동일249파일, mobile.js/mobile.css/cover 누락 및 CSS/index 차이. 원본의 모바일 개선을 정적 호스팅 변환으로 복구. 기존 표지 재사용; 새 인물/외부 자산 없음.
- 추가 가독성 수정: 밝은 패널에 남은 옅은 진행도/안내/통화 글자색 보완. private PR4 https://github.com/junsa80/muse-studio/pull/4 병합 c30c4fc9351da5d1667a886274e4f636ad1afb68 (수정68d94bed). source public runtime256파일 Git blob 검증 후 재생성. 게임 JS/규칙/저장 키/계정 권한 보존.
- 이전390×844: 문서 높이2568px, nav y1512.5px. 이후 요청3규격: 문서 높이=화면높이, 촬영 버튼53px/하단7버튼44px. 6탭 터치·닫기·촬영·진행 재로드·자산로드·어두운 안내색 PASS, pageerror/HTTP오류0.
- 원본 node tools/verify.mjs 7 suite PASS. 처음 TypeScript 부재/비호환 최신 패키지 실패 후5.9.3으로 PASS. 작업경로 오입력1회 재실행 해결. 임시환경 오류와 제품 결함 구분.
- tools/test-muse-mobile.cjs 및 docs/qa/portfolio-20261027/muse-mobile.txt에 실행 근거. 실물폰·한글 글리프 시각검수(컨테이너 한국어 글꼴 부재)·음향 청취·Sites 계정 동기화 미검증.
- 기본 허브 카드 URL은 기존 Sites 유지. 이번 Pages 사본 갱신은 Sites 재배포가 아님. Pages 설정의 계정저장 오안내를 브라우저 저장/백업으로 정정. 허브 cache1.5.26.
- 다음: Sites CSS 배포 일치/장미·프리즘 복사본 차이 → 룬 RT-03 S6 선택효용 → ACT-02 실기 입력·성능. 사용량 중단 조건 없음.

## 2026-10-27 — ROSE-AUDIO-01 Pages 효과음 수명 관리
- hub13c42d2 기준928021b가 도입한 샘플 효과음 검토. tone의 재생 거절 콜백이 hidden 이후 beep를 호출해 대체음을 시작함을 Node VM으로 재현(수정 전 contexts1, 기대0). 재생 중 샘플/대체음도 숨김·음소거에서 정지하지 않았음.
- game.js: 샘플/oscillator 추적·종료 정리, hidden/pagehide 정지, AudioContext suspend, 음소거 즉시 정지. 세대 번호로 정지 이전 재생 실패 콜백을 무효화. pageshow는 잠금만 풀며 지난 효과음을 재생하지 않음. 새 사용자 행동에서만 소리 재생.
- 기존 sfx5종 그대로 사용. 덱·카드·성장·보상·저장 코드 미변경. Pages 전용 개선이므로 private 원본/Sites에 적용했다고 주장하지 않음.
- tools/test-rose-audio.cjs: 수정 전 FAIL → 후 PASS. hidden 지연 실패, 재생 중 정지, pagehide/pageshow, 음소거, 정상 실패 fallback, ended 정리. node --check와 허브 캐시격리 PASS.
- tools/test-rose-browser.cjs: Chromium153 360×800/390×844/412×915에서 새 원정·음소거·합성 pagehide·재접속 시 starter/hp/deck 유지, pageerror0 PASS. Audio 대역 사용; 실제 음향 청취·폰 앱전환·기기성능 미검증. 원시 결과 docs/qa/portfolio-20261027/rose-*.txt.
- 캐시 hub1.5.27 / Rose game.js?v=20261027-audio2. 공개 확인은 후속 로그 참조.
- 다음 우선순위: RT-03 룬 S6 선택 효용 계측 → DEP-01 남은 Sites/원본 배포 차이 → ACT-02 실제 기기 입력/성능. 장미 그림/효과음은 재생성 시 보존 필요.

## 2026-10-27 — RT-03 진단 구현 및 Rose 공개 반영 확인
- Rune private main `1b65af3d95780e6f86fbdb23407b62e70f9a6322`: 실제 autoTurn 전후 영토/침략/통행료 계측 도구 구현. 기존 play와100판 결과 동등·입력 불변 테스트. 전체63/63 통과. 최초 부분 체크아웃 CSS 누락 실패는 원본 복원 후 해소.
- 별도 평가 시드6400000,5보유풀×2난도×2덱×200=4,000판. 원시결과 재실행4,000판도 바이트 동일. 성장→과거 강제 공략 평균 일반47.8→42.2%, 어려움38.3→36.6%. 보유풀별 유닛 부재·영토손실 차이가 달라 원인 단정 금지. 현재 성장 덱 유지 후보 정책 유지, 제품 카드/난도/세이브 불변.
- Chromium153 모바일5규격(필수3개 포함) 주사위·터치·전투 스크롤·AI 복귀·업데이트 저장 보존·2탭 충돌 PASS, pageerror0. 실제 폰/사람 승률 아님. Rune docs/qa/S6_DIAGNOSTICS_20261027.md, s6-diagnostics-20261027.json, s6-mobile-20261027.txt 참조. 런타임 UI0.1.53, 도구만 변경하여 재배포 불필요.
- Rose: 2f7af73의 최초 Pages run40517359874는 cancelled, 이를 포함한 e68ee8d 후속 run40517580203 success. 공개 index/sw/Rose index/game 및 WAV5개 총9개 바이트 동일. 증거 docs/qa/portfolio-20261027/rose-live-confirmed.json. hub1.5.27, Rose game.js?v=20261027-audio2 반영 확인. 청취/실기기 미검증.
- 다음 순서: RT-04 유닛 수·비용·방어 가중치 단일요인 공략 비교(학습과 새 평가 분리, 개선 없으면 성장 덱 유지) → DEP-01 Prism 및 Sites/Pages 재생성 시 자산 보존 → ACT-02 기기 확보 전 자동 입력/성능 검증 범위 확대. RT-03 계측만 완료이며 S6 선택 효용 개선/인간 플레이는 미완료.

## 2026-10-27 — RT-04 S6 공략 평가 개선 완료
- 비공개 Rune main bed45dc8fa74b91320b3e2cb29e1bdd91ff7fca5. growth-factors/compare-growth-factors 신규, 기존 growth-hints S6 탐색을 단일요인8변형+기준덱 유지로 교체. 유닛 수/비용/체력 비중만 분리 변경. S4 정책 유지.
- 학습200/평가400판,5보유풀·2난도. 첫 평가 선택정책 일반48.50→60.40%,어려움38.30→46.15%. 같은 선택의 두 번째 미사용 평가에서48.35→57.80%,37.15→44.10%. 총80,000대전 실행(중복 학습 포함). 카드·적 약화 없이 자동 공략 후보 개선. 모든 풀의 유의한 개선이나 인간 승률을 주장하지 않음.
- 전체65검사/모바일5규격 PASS,pageerror0. 실제 폰·인간 조작 미검증. 근거 Rune docs/qa/GROWTH_FACTORS_20261027.md 및 원시2JSON/rt04-tests/rt04-mobile. 런타임·저장·UI0.1.53 불변, 재배포 불필요. 게임 내 추천 UI는 미구현.
- 다음 우선순위: DEP-01 프리즘 복사본 재생성 시 추가 자산/기능 보존 → RT-05 S6 실제 덱 편성·저장·재도전 흐름 확인 → ACT-02 액션 자동 입력/성능. 도구의 수치 개선과 실제 플레이 체감은 구분한다.

## 2026-10-29 — DEP-PRISM-01 배포 개선 유실 방지
- 확인 기준 hub8f5bb77 / private prism90a10a1. private AGENTS 및 docs/CURRENT_STATE/HANDOFF/ROADMAP/DECISIONS 확인. private 소스·Sites·사용자 세이브 수정 없음.
- huba155dc9가 Next 번들 JS/CSS에 효과음과 배경 연결을 직접 수정했고 WAV3/JPG3 추가. e508195는 index 자산 쿼리 갱신. 기존 BUILD_PLAY_COPIES의 폴더삭제+out복사는9개 변경을 잃을 수 있음.
- tools/stage_prism_copy.py 및 manifest 구현: 검토된 export 전체38파일과 현재44파일의 경로/해시 확인 후 새 staging에9개 변경 보존. 기존 출력/누락/새 빌드 또는 허브 변경/자산 충돌/심볼릭 링크 거절. 소스와 공개 폴더 읽기 전용, staging 전체44파일이 현재 공개 저장소와 동일한지 최종 확인.
- test-prism-copy.py 9/9 PASS:44파일 재구성·입력 비변이·기존출력보호·원본누락·번들변경·자산충돌·허브변경·내부출력·심볼릭링크 경로 검증(일부 한 테스트 내 복수 assertion). 원시 docs/qa/portfolio-20261029/prism-copy-tests.txt.
- 중요한 범위: 과거 정적 export에서 현재 복사본 재구성 검증이다. 최신 private source의 새 Next 빌드 재현/모바일 브라우저/실물폰/음향 청취/Sites 동기화는 미검증. 새 빌드 해시가 다르면 거절하고 소스 수준 통합 검토 필요. 기존 번들을 새 코드에 강제 덮지 않는다.
- runtime44파일은 변경하지 않았고 재배포 불필요. BUILD_PLAY_COPIES의 파괴적 게시 예시를 staging/충돌 검토 절차로 교체. 루트 캐시/주소/게임목록/저장 키 그대로.
- 다음: DEP-PRISM-02 최신 private 소스의 별도 임시 빌드와 허브 개선 소스 이식 검토 → RT-05 실제 덱 편성·저장·재도전 → ACT-02 입력·성능. Rune main 확인은 bed45dc8; 이전 시뮬 결과는 그 코드 기준임.
- 후속: 복사 중 예외를 주입해 부분 staging 정리/기존공개본 보존도 PASS. 공개 URL44개 HTTP200·SHA256 일치, 오류0(prism-live.json). 게임 실행/청취를 HTTP 검사로 대체하지 않음.
