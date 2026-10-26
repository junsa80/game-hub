# GrokBot 열린 PR 색인 — 2026-10-26 (GPT Astra 인계용)

기준 시각: 2026-10-26 13:55 (Europe/Berlin). 대상: `grokbot/` 브랜치의 열린 PR, 7개 저장소 37개 + 이 색인 이후 추가 3개(fogbound #16, aster-hunt #8, ember-tactics #8) = 40개, 그리고 이 색인 PR(game-hub #22).
(game-hub #11·#12·#15·#17·#19·#20은 이미 병합됨, 제외.) GrokBot은 병합하지 않음 — 병합·sw.js·CACHE는 GPT 담당.

확인 방법
- 충돌: `git merge-tree --write-tree`로 PR 쌍별·main 대비 확인 + 아래 권장 순서대로 임시 작업트리에서 실제 순차 병합 후 테스트(푸시 안 함).
- 순차 병합 후 테스트: fogbound `npm test` 98/98 + verify, last-archive verify, companion-guild verify, ember-tactics verify, aster-hunt verify, rune-territories `npm test` 61/61 — 모두 통과(충돌 3곳은 아래 해결법으로 풀고 실행).
- 시뮬 수치는 전부 봇 정책 기준(사람 승률 아님). 화면 수치는 브라우저 에뮬레이션(실기기 아님).

---

## fogbound-tactics (6)
| PR | base | 한 줄 목적 | 런타임 파일 |
|---|---|---|---|
| #10 | main | 오래된 탭이 새 저장을 되돌리지 못하게(FB-TABS) | dist/app.mjs, dist/index.html |
| #11 | main | sw.js 프리캐시 `?v=` 불일치 수정(오프라인·배포 직후 깨짐) + combat-fx 중복 | dist/sw.js, dist/combat-fx.mjs |
| #12 | main | 밸런스 시뮬 도구·결과만(데이터 변경 없음) | — |
| #13 | #12 | 약한 유물 6종 틈새(작은 수치) | dist/tactics.mjs |
| #14 | #12 | 밀도 5 적 체력 보정 +10→+8 | dist/engine.mjs |
| #15 | main | 휴대폰 터치 44px(거점·전투) | dist/mobile-fit.css |

| #16 | main | 후반 화면 점검: 상단 제목 링크 `a.brand` 31→44px | dist/mobile-fit.css(맨 위) |

- 권장 순서: #11 → #10 → #12 → (#13, #14 base를 main으로 바꾼 뒤) #13 → #14 → #15 → #16. 충돌 없음(#16은 파일 맨 위, #15는 끝).
- 캐시(병합 후 한 번에, GPT): `dist/sw.js`의 `CACHE` 이름 올리기(#11이 `fogbound-v0.9.4-swsync-20261026`로 올림). #10이 index의 `app.mjs?v=0.9.0-tabs`로 바꾸므로 sw `FILES`의 `./app.mjs?v=0.9.0`도 맞춰야 함(#11의 sw-sync 테스트는 ignoreSearch 폴백이라 통과하지만 정확히 맞추는 게 안전). tactics.mjs·engine.mjs는 `?v` 없는 import라 CACHE 이름 변경으로만 갱신됨. `mobile-fit.css?v=0.7.4` → 새 값(index·sw 둘 다, #15·#16).

## last-archive (7)
| PR | base | 한 줄 목적 | 런타임 파일 |
|---|---|---|---|
| #4 | main | 옛 세이브 이전 테스트 다시 실행 가능하게(fixture) | — |
| #5 | main | 핵심 루프 퍼즈 테스트 | — |
| #6 | main | 오래된 탭 덮어쓰기 방지(LA-TABS) | dist/app.js, dist/index.html |
| #7 | main | 밸런스 시뮬 도구·결과(데이터 변경 없음) | — |
| #8 | #7 | 보스 2·3 상향(보스 곡선·준비 선택이 결과를 바꾸게) | dist/engine.js |
| #9 | #8 | 카린·클로에(주인공), 클로에·나디아·아이리스(서포터) 상향 | dist/engine.js |
| #10 | main | 휴대폰 터치 44px(설정 > 저장 파일 불러오기) | dist/style.css |

- 권장 순서: #4 → #5 → #6 → #7 → #8 → #9 → #10 (#8·#9는 앞 PR 병합 후 base를 main으로). 충돌 없음.
- 캐시: sw.js 없음. `dist/index.html`(한 줄 파일)에서 `engine.js?v=0.3`(#8·#9), `style.css?v=0.3`(#10) 올려야 함. #6은 `app.js?v=20261026-tabs`로 이미 올림. 한 줄 파일이라 다른 PR들이 건드리지 않았음 — 마지막에 한 번에.

## companion-guild (4)
| PR | base | 한 줄 목적 | 런타임 파일 |
|---|---|---|---|
| #5 | main | 두 탭 동시 진행 덮어쓰기 방지(기존 저장 충돌 창 재사용) | public/cloud-save.js, public/index.html |
| #6 | main | 핵심 루프 퍼즈 + 진행 속도 시뮬 표 | — |
| #7 | #6 | 5~8지역 완화 + 방어는 다음 강타까지 유지 | public/engine.mjs, public/app.js |
| #8 | main | 휴대폰 터치 44px | public/mobile.css |

- 권장 순서: #5 → #6 → #7 → #8.
- **충돌**: #5 × #6 (#7은 #6 포함) — `tools/verify.mjs`의 테스트 목록 한 줄. 해결: 두 쪽 항목 합치기 → `tests/cloud-tabs.test.cjs`와 `tests/core-loop-fuzz.test.mjs` 둘 다 목록에 둠. 이렇게 풀고 #7·#8까지 병합 후 verify 통과 확인.
- 캐시: #5가 `cloud-save.js?v=4`, #7이 app.js 안의 `engine.mjs?v=0.5.2-pace`로 올림. `app.js?v=20261025-audio`(#7이 app.js 수정)와 `mobile.css?v=20261022`(#8)는 index.html에서 올려야 함(#5와 같은 한 줄이라 일부러 안 건드림).

## ember-tactics (3)
| PR | base | 한 줄 목적 | 런타임 파일 |
|---|---|---|---|
| #5 | main | 두 탭 동시 진행 덮어쓰기 방지 | public/cloud-save.js, public/index.html |
| #6 | main | 원정 핵심 루프 퍼즈(패배→재도전·기록·새로고침) | — |
| #7 | main | 휴대폰 터치 44px | public/css/style.css |

| #8 | main | 중·후반 화면: 전투·결과 펼침(summary) 34~38→44px | public/css/style.css(맨 위) |

- 권장 순서: #5 → #6 → #7 → #8. #8은 #7과 충돌 없음.
- **충돌**: #5 × #6 — `tools/verify.mjs` 테스트 목록. 해결: 합치기(`tests/cloud-tabs.test.cjs` + `tests/core-loop-fuzz.test.cjs`). 풀고 verify 통과 확인.
- 캐시: #5가 `cloud-save.js?v=5`로 올림. `css/style.css?v=0.17.1`(#7·#8) 올려야 함.

## aster-hunt (3)
| PR | base | 한 줄 목적 | 런타임 파일 |
|---|---|---|---|
| #5 | main | v1 세이브가 강화·정화 유지하는지 테스트(ACT-01) | — |
| #6 | main | 오래된 탭 덮어쓰기 방지(AH-TABS) | dist/game.js, dist/index.html |
| #7 | main | 휴대폰 터치 44px(선택 상자·전투 HUD) | dist/style.css |

| #8 | main | 중·후반 화면: 전투 HUD 체력 줄 10px·결과 동료 안내 10.8px → 12px | dist/style.css(맨 위) |

- 권장 순서: #5 → #6 → #7 → #8. 충돌 없음. 동료 중복 병합 동작은 어느 PR도 바꾸지 않음.
- 캐시: #6이 `game.js?v=20261026-tabs`로 올림. `style.css?v=5`(#7·#8) 올려야 함.

## rune-territories (7)
| PR | base | 한 줄 목적 | 런타임 파일 |
|---|---|---|---|
| #4 | main | 0.1.54 AI 턴 중 버튼 탭 누락·도크 25px 점프 수정 | index.html, src/app.js, game.js, data.js, style.css |
| #5 | main(#4 커밋 포함 = 스택) | 0.1.55 S5 성장 덱 난이도 역전 해소 | 위와 같음 + src/data.js S5 덱 |
| #6 | main | AI 공격 아이템 사용 검증 도구(코드 변경 불필요 결론) | — |
| #7 | main | S3 성장 덱 난이도 역전 해소 | src/data.js |
| #8 | main | 대전 중 손패 가로 스와이프(휴대폰) | index.html, src/style.css |
| #9 | main | 브라우저 테스트를 이 컨테이너에서도 안정적으로 | — |
| #10 | main | 휴대폰 터치 44px(메뉴·필터·펼침·대전 상단) | src/style.css |

- 권장 순서: #4 → #5 → #7 → #8 → #10 → #6 → #9.
- **충돌**: #8 × #4/#5 — `index.html`의 `style.css?v=` 한 줄(#4 `0.1.54`, #5 `0.1.55`, #8 `0.1.53-hand`). 해결: 셋보다 높은 새 값 하나(예: `0.1.56`)로. src/style.css 자체는 자동 병합됨(#10은 블록을 파일 맨 위에 둬서 충돌 없음).
- 캐시: 마지막에 index.html의 `style.css`·`app.js`와 import 안의 `data.js`·`game.js` `?v`를 한 값으로(#7·#10은 일부러 안 올림). progression-audit/model 도구의 data.js 버전도 game.js와 같게(#5 참고 — 다르면 덱 덮어쓰기 무효).

## game-hub (7)
| PR | base | 한 줄 목적 |
|---|---|---|
| #8 | main | Arcana Pocket AP-01 손상 대전 세이브 빈 화면 방지 |
| #9 | main(#8 위 스택) | AP-02 모바일 글자 12px·터치 44px |
| #10 | main(#9 위 스택) | AP-03 대전 중 덱 교체 버튼 무반응 수정 |
| #13 | main | muse-studio·rose-spire 플레이 사본을 원본 main으로 갱신 |
| #14 | main | prism-muse 플레이 사본 원본 90a10a1로 재빌드 |
| #16 | #14 | prism-muse 사본 PNG→WebP(첫 화면 4.0MB→1.6MB) |
| #18 | main | 원본 4개 게임 읽기 전용 QA 기록(두 탭 진행 손실 재현) |

- 권장 순서: #8 → #9 → #10 → #13 → #14 → #16 → #18 → (이 색인 PR). 충돌 없음.
- 캐시: 허브 `sw.js`(`hub-v1.5.22`)는 허브 루트 파일만 캐시 — play/ 사본은 각자 `?v`. Arcana는 #8~#10이 `app.js?v=0.3.3`·`style.css?v=0.3.2`까지 올림. #13은 muse `game.js?v=20261025`로. #14/#16의 Next 빌드 청크는 해시 파일명이라 bump 불필요.
- #18 후속 제안(미적용, tab-guard.js 아님): `prism-muse-static.patch`의 /api/save 대체 shim이 버전 비교 없이 덮어씀 → 버전 다르면 409를 돌려 원래 충돌 흐름을 살리기.

---

## 밸런스 PR 시뮬 전/후 수치

### fogbound #12 (도구만) — 기준 측정
- 전투는 결정적, 시드는 전장 배치 2종만 고름 → 시드 2 × 전장 크기 4 = 8배치로 측정.
- 유물(32회): ward 13% > supply 3%; lens/grove/breaker/rescue/reach 0%. 파티(Lv3·밀도2): axe+archer+cleric 63% 독보적. 밀도 5는 Lv8 0%, 밀도 4는 Lv8 63%.

### fogbound #13 유물 틈새 — `NO_D5=1 node tools/balance-relics.mjs 305 2`, 조건당 24회, 승률 %
| 유물 | d3Lv3 | d3Lv5 | d4Lv5 | d4Lv8 | 합계 전 → 후 |
|---|---|---|---|---|---|
| lens | 13→29 | 54→75 | 13→25 | 33→67 | 28 → 49 |
| grove | 4→21 | 58→79 | 0→13 | 46→71 | 27 → 46 |
| spring | 0→4 | 71→71 | 8→13 | 58→63 | 34 → 38 |
| breaker | 13→13 | 58→67 | 13→13 | 50→50 | 33 → 35 |
| rescue | 0→0 | 71→75 | 0→0 | 46→67 | 29 → 35 |
| reach | 4→4 | 33→67 | 0→8 | 29→67 | 17 → 36 |
| (기준) supply / ward | — | — | — | — | 40 / 48 (변화 없음) |
- 새 지배 선택 없음(lens 49·grove 46 ≈ ward 48). trail 33·edge 26은 손대지 않음.

### fogbound #14 밀도 5 — `node tools/balance-density5.mjs 403 2`, 칸당 8회, Lv8 승률
| 파티 | 보급만 전 → 후 | ward 우선 전 → 후 |
|---|---|---|
| lian+yuna+mira | 0 → 25 | 50 → 63 |
| ember_axe+archer+cleric | 75 → 75 | 63 → 100 |
| lian+ember_archer+ember_mage | 13 → 38 | 25 → 38 |
| ember_artillery+lance+healer | 0 → 0 | 0 → 0 |
| **평균** | **22 → 34** | **34 → 50** |
- 밀도 4 Lv8(53/66)보다는 여전히 어려움. Lv5 0~25%, Lv10 50~100%. artillery+lance+healer는 파티 문제(밀도 4도 0~25%).

### last-archive #7 (도구만) — 시드 11~110, 72,800회
- 전부 클리어(최소 남은 체력 70), 성장 안 써도 100%. 주인공 남은 체력 nadia 368 / sera 351 vs karin 158 / chloe 164. 서포터 delta sera +21.5 · veronica +21.0 / chloe −13.4 · nadia −9.4 · iris −8.6. 보스 2 후 남은 체력이 보스 1보다 많음.

### last-archive #8 보스 곡선 — `tools/balance-seeds.cjs 111 100`, 72,800회
| 지표 | 전 | 후 |
|---|---|---|
| 기본 정책 클리어 | 100% | 100% |
| 출격 1회 / 출격 0·연구 2 / 연구 2 / 성장 안 씀 | 100 / 100 / 100 / 100% | 96.3 / 37.4 / 23.8 / 92.1% |
| 방어 안 함 / 공격력 위주 | 0 / 0% | 0 / 0% |
| 보스 1→2→3 남은 체력 | 273 → 314 → 228 | 273 → 238 → 161 |
| 보스 라운드 | 8.5 → 12.0 → 14.2 | 8.5 → 14.1 → 14.6 |
| 최종 보스 후 최저 체력 | 70 | 1 |

### last-archive #9 주인공·서포터 — `tools/balance-seeds.cjs 211 100`, 72,800회, #8 적용 상태 기준
| 주인공 남은 체력 | karin | chloe | iris | rachel | elena | veronica | sera | nadia |
|---|---|---|---|---|---|---|---|---|
| 전 | 92 | 97 | 118 | 124 | 130 | 136 | 286 | 303 |
| 후 | 137 | 132 | 134 | 146 | 149 | 157 | 314 | 319 |

| 서포터 delta | chloe | nadia | iris | veronica | sera | mira | karin |
|---|---|---|---|---|---|---|---|
| 전 | −13.4 | −9.9 | −10.1 | +22.3 | +22.1 | +10.2 | −7.1 |
| 후 | +2.1 | −2.7 | −3.4 | +22.6 | +6.9 | +3.4 | −10.6 |

| 정책 클리어(#8 → #9) | 출격 1회 | 출격 0·연구 2 | 연구 2 | 성장 안 씀 |
|---|---|---|---|---|
| | 96.2 → 99.8 | 37.2 → 57.7 | 25.3 → 52.6 | 92.1 → 95.1 |
- 주의: #9가 #8의 난도 상향을 일부 되돌림(둘 다 병합 시 #9 표가 최종). 남은 격차: sera·nadia 주인공 약 315 vs 나머지 130~160, karin 서포트 −10.6(다음 후보).

### companion-guild #7 진행 완화 — `node tools/pace-sim.mjs 8 72`, 시드 8개 중앙값, 지역 첫 돌파
| 변형 | 5지역 | 6지역 | 7지역 | 8지역 | 72h 패배 |
|---|---|---|---|---|---|
| base(자동) 전 → 후 | 23.1h → 16.2h | 38.9h → 27.0h | 51.2h → 30.7h | 못 감 → 48.5h | 389 → 263 |
| manual_tap(자동 스킬 끔) 전 → 후 | 54.6h → 42.6h | 못 감 → 49.8h | 못 감 → 53.0h | 못 감 → 65.8h | 398 → 360 |
| no_auto_skills(방치형) | 5지역 1/8 → 6/8 시드 | 1/8 | 1/8 | — → 1/8 | 401 → 391 |
- 5~8지역 체력 4000/6200/9200/13500 → 3400/4800/6400/8400, 공격 46/58/72/88 → 42/49/57/66. 1~4지역 그대로. 방어는 다음 강타까지 유지.

### rune-territories #5 S5 덱 — 5컬렉션×1000판, autoTurn
| | S3 | S4 | S5 전 → 후 | S6 |
|---|---|---|---|---|
| 성장 일반 | 80.3 | 61.4 | 83.5 → 55.2 | 47.4 |
| 성장 어려움 | 75.8 | 54.1 | 79.8 → 49.2 | 37.5 |
| 시작 덱 일반 | 25.9 | 25.8 | 17.1 → 21.2 | 7.3 |

### rune-territories #7 S3 덱 — 새 시드 9900000, 5컬렉션×1000판
| | S2 | S3 전 → 후 | S4 |
|---|---|---|---|
| 성장 일반 | 62.9 | 80.2 → 63.9 | 60.4 |
| 성장 어려움 | 54.8 | 75.8 → 57.0 | 54.1 |
| 시작 덱 | 50.8 | 29.2 → 31.3 | 26.8 |
- 역전 해소, S2~S4가 60~64% 평지(엄격한 단조는 설계 판단으로 남김).

---

## 중·후반 화면 점검 (배치 6, 브라우저 에뮬레이션 360×800 / 390×844 / 412×915)
기준: 44px 미만 터치, 12px 미만 글자, 가로 넘침, 한 화면 맞춤. 각 게임의 터치 PR(fogbound #15, aster #7, ember #7, rune #10) 적용 상태에서 측정.

| 게임 | 본 화면 | 새로 찾은 것 | 조치 |
|---|---|---|---|
| fogbound | 봇 진행 저장으로 전투 1·2·3 진행 중, 보상, 경로, 승리, 패배 + 동료 선택·도움말·설정·전투 기록 창 | `a.brand` 31px | #16. 글자·넘침 0. 전투 지도+턴 종료는 첫 화면 안(360×800: 721px까지). 미검증: 적 선택 후 공격 예측 창 |
| aster-hunt | 후반 저장(Lv30·12개 해금·동료 3)으로 메뉴 4개, 사냥 준비, 전투, 일시정지, 결과 | HUD 체력 줄 10px, 결과 안내 10.8px | #8. 터치 남은 것은 #7 범위. 넘침·잘린 버튼 0 |
| ember-tactics | 연습 원정 → 편성 → 첫 전투 → 야영지 → 결과 | 펼침 34~38px | #8. **한 화면 맞춤 미달(수정 안 함)**: 전투 지도가 671px부터 시작 → 360×800 첫 화면에 지도 약 130px, 412×915 약 290px. 상단 제목 카드(0~207)와 명령 패널이 위에 있음. 전투 중 상단 카드 접기/지도·명령 순서 변경은 설계 판단이라 제안만 |
| rune-territories | 일반 대전 자동 진행(최대 300단계): 주사위 후 판, 배치, 수비·공격 대결 창, 결과 시트, 강화, 보급 시트 | 대결 창 위 축소 판 타일 33×33(탭 = 칸 정보), 판 타일 글자 10px | 수정 안 함: 타일 10px는 CSS에 의도적으로 따로 지정됨(12px 규칙 뒤 예외). 축소 판 타일을 44px로 키우면 대결 창이 360×800 밖으로 밀림 — 설계 판단. 손패가 화면 오른쪽 밖(644~671px)으로 나가 닿지 않음 → #8(손패 스와이프)이 해결 대상 |

## 라이브 플레이 사이트 회귀 점검
읽기 전용, 클릭 없음. 390×844 브라우저 에뮬레이션, 로드 후 6초 대기, 콘솔 오류·페이지 오류·4xx/5xx·빈 화면 확인. 2026-10-26 오후(Europe/Berlin).

| 사이트 | 결과 |
|---|---|
| game-hub, hunt-now, beauty-deck, srpg-prototype(캔버스 화면, 정상 표시), fantasy-collab-battle-play, aster-hunt, last-archive, fogbound-tactics, hub play/world-breaker·chronicle-crossing·free-solo-tcg·arcana-pocket | 오류 0, 요청 실패 0, 가로 넘침 0 |
| rune-territories-play | 콘솔 404 1건 = `/favicon.ico`(github.io 루트). 기능 영향 없음. 배포 버전 = 원본 main(`app.js?v=0.1.53`, `style.css?v=0.1.52`) |
| rose-spire, companion-guild, ember-tactics, prism-muse, muse-studio (chatgpt.site) | 로그인 안 한 상태라 `/api/cloud-save`(prism은 `/api/save`) 401 — 예상 동작. rose-spire·companion-guild는 `/favicon.ico` 404도 |

- 페이지 오류(JS 예외) 0, 빈 화면 0.
- 배포본과 원본 main의 `?v=` 비교: fogbound, last-archive, aster-hunt, companion-guild, ember-tactics, rune 모두 같음 — 열린 PR은 아직 배포 안 됨(병합 후 배포 필요).
- fogbound 라이브는 #11 이전 sw.js라 프리캐시 `?v` 불일치가 그대로(#11 병합·배포로 해결).
- 사소: favicon 404 3곳(rune-play, rose-spire, companion-guild) — 원하면 favicon 링크 추가로 콘솔 정리.
