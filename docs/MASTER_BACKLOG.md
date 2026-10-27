# MASTER_BACKLOG — 2026-10-26

우선순위는 확인된 영향/위험/의존성 기준. P0는 재현한 실행·저장·진행 장애에만 부여한다.

|ID|대상|우선|실제 근거/영향|난도·규모|수정 파일/시스템|완료 기준|상태/커밋|
|---|---|---|---|---|---|---|---|
|CACHE-01|game-hub|P1|sw.js activate가 다른 게임 캐시 삭제; 허브 업데이트가 여러 게임 오프라인 실행에 영향|낮음/소|sw.js, index.html, tools/test-cache-isolation.cjs|자기 구버전만 삭제; 다른 캐시 내용/세이브 불변; 설치 캐시 버전 갱신·라이브 확인|수정·자동검사·라이브 파일 확인 완료 `7b6988d`; 실기 오프라인 미검증|
|CACHE-02|hunt-now|P1|sw.js의 k!==C만으로 전체 캐시 삭제|낮음/소|sw.js, index.html, test/cache-isolation.cjs|자기 구버전 정리·타 게임 보존, 테스트 및 라이브 확인|수정·자동검사·라이브 파일 확인 완료 `4b8f083`; 실기 오프라인 미검증|
|CACHE-03|beauty-deck|P1|sw.js의 k!==CACHE만으로 전체 캐시 삭제|낮음/소|sw.js, index.html, test/cache-isolation.cjs|자기 구버전 정리·타 게임 보존, 캐시 CORE 쿼리 일치·라이브 확인|수정·자동검사·라이브 파일 확인 완료 `81322d5`; 실기 오프라인 미검증|
|AP-01|Arcana Pocket|P0|손상 active battle의 log 누락이 검증 통과 후 부팅 TypeError 발생; 정상 저장 재작성까지 진행됨|중간/소|play/arcana-pocket/app.js, tests/ui-smoke.cjs|손상 active battle 부팅/가져오기 실패를 원본 보존으로 처리; 정상/legacy 세이브 유지|완료: 135adc8; 손상14종/정상376상태/legacy 및 모바일3규격 실제 브라우저 복구 통과; 공개4파일 HTTP200·바이트 일치|
|RT-01|룬 영토|P1|과거 모바일 증거 이후 현 요청 3크기 회귀 미실행|중간/중|tools/mobile-regression.cjs, src/app.js/style.css|360×800/390×844/412×915 주사위·한 화면·자동스크롤·터치·저장 통과|자동 모바일 검증 완료 b7357a3: 요청3+기존2규격 주사위/터치/스크롤/업데이트/2탭 PASS, pageerror0; 실물폰 미검증|
|RT-02|룬 영토|P1|기존 비교는 현재단계 보상 포함 재도전/스타터 기준; 성장 첫 돌파와 구분 필요|중간/중|tools/growth-hints.mjs, hint-deck.mjs, tests/hint-deck.test.mjs|이전단계 보유풀·held-out paired seeds로 S4/S6 일반/어려움 비교|측정·도구 수정 완료 828b8b9; S4 개선, S6 유의미한 개선 근거 없음;62테스트 PASS|
|JR-01|경계의 서약|P1|자동장비·유니크·연계 던전 코드 확인, 최신 통합 실전 미검증|중간/중|src/native/, systems/EquipmentSystem.ts, tools/test-game.ts|실제 전투→보상→자동장비→영입정보 던전→저장 재로드; 유니크 재지급 없음|통합자동71/71 PASS; 인계2092c6c. 실제 엔진 경로 검증, 수동 플레이/실기 미검증|
|ACT-01|아스터/헌트|P1|성장·영입은 코드 존재; 묵직한 전투의 실기 GL/입력 미검증|높음/중|dist/game.js, motion.js, tests/tempo.mjs; hunt main.js|구형 저장→강화/정화 유지, 입력 지연·부위 타격시점/프레임 측정|자동 회귀 통과; Hunt cb919e5 저장손실 수정·공개확인, Aster 통제 전투/저장 PASS; 실기 GL/입력 미검증|
|QA-01|전 게임|P1|일부 검사가 환경 자산/구 git 이력/Godot 부재로 중단|중간/중|각 tools/verify/tests, CI|불완전 소스 수신과 제품 결함 분리; 정확한 원본/의존성으로 재실행|부분 검증|
|DEP-01|복사본/Sites|P1|원본 커밋이 라이브 배포와 동일하다는 보장 없음|중간/중|games.json, build/publish scripts|런타임 해시·누락 자산·HTTP·SW 버전 확인, 401은 게임 오류로 단정 금지|부분 검증|
|DOC-01|SRPG/Rune/Chronicle|P2|STORY 장수·초기 TASKS·과거 소스부재 설명과 최신 코드 불일치|낮음/소|각 STORY/TASKS/HANDOFF|과거 이력 보존, 현재 상태 단일 상단 요약|대기|
|ART-01|전 게임|P2|자산 존재만으로 통일성/가독성 완료 불가|중간/중|게임별 CSS/art/sprites|각 3크기 화면 캡처로 글자/버튼/효과 판단, 적합한 기존 자산 재사용|미검증|
|CONTENT-01|각 게임|P3|Rune 전술 확장, Free Solo 신규 카드 등 제안 단계|높음/중|개별 기획/데이터|상위 안정화 후 독립 실험·균형검사, 기존 정체성 유지|설계 후보|

이번 실행 순서: CACHE-01 → CACHE-02 → CACHE-03. 공유 origin 결함이므로 세 곳 모두 수정해야 재발하지 않는다. 같은 게임의 동시 변경은 원격 HEAD 검사로 충돌 감지하며, 강제 푸시하지 않는다.

다음 3개: ACT-01 아스터/헌트 저장·전투 회귀 → DEP-01 Sites/복사본 배포 일치 확인 → RT-03 S6 선택 효용. 사용자 요청으로 사용량 확인은 작업 중단 조건에서 제외.

|RT-03|룬 영토|P1|S6 자동 공략 교체가 성장 덱을 일관되게 개선하지 못함(RT-02 원시결과)|중간/중|tools/progression-model.mjs, hint-deck.mjs, HARD_HINTS|수입부족/침략실패/영토손실 계측 및 정상성장 수동 흐름 확인 후 선택 효용 개선; 신규 검증 시드 사용|대기; 적 약화/카드 수치 변경은 아직 근거 부족|

|HN-SAVE-01|헌트 나우|P0|손상 JSON catch 후 freshSave 즉시 persist로 원문 삭제 재현|중/소|main.js, 복구 UI, test/save-recovery.mjs|원문 보존/내보내기/정상 백업 복원/기존 이관·전투 회귀|완료 cb919e5; 모바일3규격·14+6회귀 PASS·공개파일 일치|
|AP-AUDIO-01|Arcana|P1|신규 sound.js에 hidden/pagehide 정지 없음|낮음/소|sound.js, tests/sound.cjs|숨김 소리 차단·복귀 BGM만 재개·음소거 유지|완료 fd88c2c; 자동검사 PASS·공개36파일 일치; 실제 청취 미검증|

|DEP-WB-01|월드 브레이커|P1|허브전용 그림·소리 a217903; 기존 단순 복사 절차가 개선 및 BGM 파일 유실 가능|중/소|tools/build_world_breaker_copy.py, overlay manifest, BUILD_PLAY_COPIES|최종44파일 동일 재생성, 원본/기존출력 보존, 코드·자산 충돌시 중단|구현·회귀 PASS; b37fb68|

|DEP-STATIC-01|허브 정적 복사 도구|P1|없는 원본 경로를 입력하면 rmtree(dst) 이후 실패해 기존 공개 폴더 삭제 재현|낮음/소|tools/make_static_copy.py, test-static-copy.py, BUILD_PLAY_COPIES|기존 출력/원본 보존, 변환 실패 시 부분 출력 없음, 정상 변환 유지|구현·회귀 PASS; b37fb68|

|DEP-MUSE-01|뮤즈 스튜디오 Pages 사본|P1|원본 모바일2파일·표지 누락,390×844에서 nav y1512.5/문서2568px; 밝은 패널 옅은 안내색|중/소|play/muse-studio CSS/index/mobile.js/cover, tools/test-muse-mobile.cjs|요청3크기 한 화면·6탭 터치·촬영·진행 재로드·자산로드·가독색; 원본/Pages 구분|원본 PR4 병합 c30c4fc; 사본256파일 재생성·모바일 자동검사 PASS; 허브1086c2e; 공개 결과 WORKLOG 참조|

|ROSE-AUDIO-01|장미의 첨탑 Pages|P1|숨김 후 샘플 실패 콜백이 대체음 시작 재현; 음소거/숨김에 기존 소리 정지 없음|낮음/소|play/rose-spire/game.js, audio/browser 회귀|지연 실패 취소·숨김/음소거 정지·정상 소리 유지·저장 회귀|구현·Node/모바일3규격 자동검사 PASS; 본 커밋, 실제 청취 미검증|
