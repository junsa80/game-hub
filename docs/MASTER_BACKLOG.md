# MASTER_BACKLOG — 2026-10-26

우선순위는 확인된 영향/위험/의존성 기준. P0 실행·저장 손실은 아직 확정하지 않았으며 가정으로 만들지 않는다.

|ID|대상|우선|실제 근거/영향|난도·규모|수정 파일/시스템|완료 기준|상태/커밋|
|---|---|---|---|---|---|---|---|
|CACHE-01|game-hub|P1|sw.js activate가 다른 게임 캐시 삭제; 허브 업데이트가 여러 게임 오프라인 실행에 영향|낮음/소|sw.js, index.html, tools/test-cache-isolation.cjs|자기 구버전만 삭제; 다른 캐시 내용/세이브 불변; 설치 캐시 버전 갱신·라이브 확인|수정·자동검사·라이브 파일 확인 완료 `7b6988d`; 실기 오프라인 미검증|
|CACHE-02|hunt-now|P1|sw.js의 k!==C만으로 전체 캐시 삭제|낮음/소|sw.js, index.html, test/cache-isolation.cjs|자기 구버전 정리·타 게임 보존, 테스트 및 라이브 확인|수정·자동검사·라이브 파일 확인 완료 `4b8f083`; 실기 오프라인 미검증|
|CACHE-03|beauty-deck|P1|sw.js의 k!==CACHE만으로 전체 캐시 삭제|낮음/소|sw.js, index.html, test/cache-isolation.cjs|자기 구버전 정리·타 게임 보존, 캐시 CORE 쿼리 일치·라이브 확인|수정·자동검사·라이브 파일 확인 완료 `81322d5`; 실기 오프라인 미검증|
|AP-01|Arcana Pocket|P1|validate가 battle.log/uid/board 최대수 등을 검사하지 않음; 손상 JSON 상세 재현 필요|중간/소|play/arcana-pocket/app.js, tests/ui-smoke.cjs|손상 active battle 부팅/가져오기 실패를 원본 보존으로 처리; 정상/legacy 세이브 유지|코드 확인, 결함 영향 재현 미검증|
|RT-01|룬 영토|P1|과거 모바일 증거 이후 현 요청 3크기 회귀 미실행|중간/중|tools/mobile-regression.cjs, src/app.js/style.css|360×800/390×844/412×915 주사위·한 화면·자동스크롤·터치·저장 통과|61개 단위 통과; 브라우저 미검증|
|RT-02|룬 영토|P1|성장 fixture는 검증되나 공략 덱 효과 재측정 필요|중간/중|tools/compare-hints.mjs, progression-model.mjs|동일 소유 카드/held-out paired seeds로 S4/S6 일반·어려움 비교; 사람 승률로 오인 금지|대기|
|JR-01|경계의 서약|P1|자동장비·유니크·연계 던전 코드 확인, 최신 통합 실전 미검증|중간/중|src/native/, systems/EquipmentSystem.ts, tools/test-game.ts|실제 전투→보상→자동장비→영입정보 던전→저장 재로드; 유니크 재지급 없음|자동검사 환경 보완 중|
|ACT-01|아스터/헌트|P1|성장·영입은 코드 존재; 묵직한 전투의 실기 GL/입력 미검증|높음/중|dist/game.js, motion.js, tests/tempo.mjs; hunt main.js|구형 저장→강화/정화 유지, 입력 지연·부위 타격시점/프레임 측정|대기|
|QA-01|전 게임|P1|일부 검사가 환경 자산/구 git 이력/Godot 부재로 중단|중간/중|각 tools/verify/tests, CI|불완전 소스 수신과 제품 결함 분리; 정확한 원본/의존성으로 재실행|부분 검증|
|DEP-01|복사본/Sites|P1|원본 커밋이 라이브 배포와 동일하다는 보장 없음|중간/중|games.json, build/publish scripts|런타임 해시·누락 자산·HTTP·SW 버전 확인, 401은 게임 오류로 단정 금지|부분 검증|
|DOC-01|SRPG/Rune/Chronicle|P2|STORY 장수·초기 TASKS·과거 소스부재 설명과 최신 코드 불일치|낮음/소|각 STORY/TASKS/HANDOFF|과거 이력 보존, 현재 상태 단일 상단 요약|대기|
|ART-01|전 게임|P2|자산 존재만으로 통일성/가독성 완료 불가|중간/중|게임별 CSS/art/sprites|각 3크기 화면 캡처로 글자/버튼/효과 판단, 적합한 기존 자산 재사용|미검증|
|CONTENT-01|각 게임|P3|Rune 전술 확장, Free Solo 신규 카드 등 제안 단계|높음/중|개별 기획/데이터|상위 안정화 후 독립 실험·균형검사, 기존 정체성 유지|설계 후보|

이번 실행 순서: CACHE-01 → CACHE-02 → CACHE-03. 공유 origin 결함이므로 세 곳 모두 수정해야 재발하지 않는다. 같은 게임의 동시 변경은 원격 HEAD 검사로 충돌 감지하며, 강제 푸시하지 않는다.

다음 3개: AP-01 손상 대전 저장 재현/보호 → RT-01 모바일 3규격 → JR-01 장비/연계던전 통합 회귀. 사용량 확인 전 새 개발 작업은 시작하지 않음.
