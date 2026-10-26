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
