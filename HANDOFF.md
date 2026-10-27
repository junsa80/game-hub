## 2026-10-25 — 아르카나 포켓 목록 표시 검증 (hub-v1.5.20)
- Prior Pages deployment dba9175 succeeded. Live browser catalog search found Arcana Pocket; direct /play/arcana-pocket/ showed Alpha0.2 and20-card rules.
- Corrected none cloudSave labels to explicitly unsupported instead of planned. Account-save count now computed from catalog instead of stale5/15. App games.json query/cache/index all1.5.20. No game code/save changes.

## 2026-10-25 — 아르카나 포켓 α0.2 신규 등록 (hub-v1.5.19)
- User requested this conversation's TCG in the game list. Dist copied byte-for-byte from Sites source67d8d3b to play/arcana-pocket; same files plus runnable tests/HANDOFF persisted in GitHub. Existing free-solo-tcg is unrelated and preserved. New native SVG cover, no external assets.
- 20-card decks, 2 copies, 10-card hand, 5-unit board; both AI decks obey limits. Existing12-card saves migrate without resetting currency/collection/records/battle. First actual defeat: choose2 nova/knight/oracle → exact deck-swap preview → apply → same-opponent retry. Old losses qualify once. Every3 non-conceded defeats grants pack; defeat5P remains. Concede only5P.
- Combat + migration/rewards/claim-once/deck-swap/concede tests and300 full AI games pass. Actual browser old game → defeat → reward choice → nova2 replacing study2 → new20-card same-opponent battle verified. Not human-win-rate/physical phone validation.
- Save key arcana-pocket-v1 unchanged; Sites/Pages are different origins. Import backup to continue Sites progress. No cloud sync.
- games.json append only; other16 entries preserved. Hub cache/query1.5.19. Source sync docs below. Pages/live verification after push.

## 2026-10-25 — 무료 싱글 TCG 등록·games.json 복구 (GrokBot)
- `6e8c1be`/`ae10646`([Grok])에서 games.json 전체가 `PLACEHOLDER…` 문자열로 덮여 허브 목록이 비었음 → `748106b`에서 `41f4ebb` 기준 15개 복원 + `free-solo-tcg` 추가. games.json은 항상 기존 목록 위에 엔트리만 추가할 것.
- private `junsa80/free-solo-tcg` @ `8df769b` 실행본(index.html + src/*.js, style.css)을 `play/free-solo-tcg/`에 복사. `public: false`, 저장 키 `freeSoloTcg.save.v1`. 갱신 절차는 그 레포 HANDOFF.md "허브 배포".

## 2026-10-25 — 룬 영토 UI0.1.53·경계의 서약 원본 이관 완료 (GPT)
- 룬 원본1d7546a/public eb245ac: S4~S6 실제 보상 성장 덱 추가. 난도별5000판에서 S6 일반47.42%/어려움37.54%, 시작 덱 S3 25.9%/S4 25.8%. 61검사·390×844 배치/AI/재접속 유지 확인. S5 성장 재상승은 후속, 전체 곡선 완료 아님.
- 경계의 서약 private 원본 e7315fa: Sites dfed4b7의125경로 원본·도구·설정·출처 이관. 71검사/빌드, 기존dist9개바이트 동일. 이후 GitHub main 기준. 실행본·주소·권한·저장 변화 없음.
- 기존 담당 유지, 다른 담당 게임에 커밋하지 않음. 사냥2종의 확정 방향을 GAME_DIRECTIONS.md에도 일치시킴. docs/QUALITY_PLAN.md에 1차 결과/후속 과제 반영. 허브 캐시1.5.18.

## 2026-10-25 — 경계의 서약 비공개 원본 저장소 신설 (GrokBot)
- 사용자 승인으로 private `junsa80/chronicle-crossing` 생성 @ `92cacce`. 이제 GitHub main이 기준. 1차 보관은 최신 배포 실행본(`play/chronicle-crossing/` @ 331b7d9 = Sites dfed4b7 + game-score.js, 바이트 동일)과 표지·HANDOFF·저장 키 목록. Sites TS 원본(src/tools/tests)은 Sites 로그인 필요로 미이관 → 담당 GPT가 저장소 루트에 커밋할 것.
- games.json `src`/`commit`/`commitKind`만 갱신. 플레이 주소·Sites 주소·접근 권한·저장 키(`chronicle-crossing.v1_*`) 변경 없음. 담당 GPT 유지.

## 2026-10-25 — 전 게임 퀄리티 업그레이드 설계안 (GrokBot)
- 난이도 곡선·성장·반복 동기 P0/P1/P2 설계안: docs/QUALITY_PLAN.md (GrokBot Page 사본). 문서만 추가, 게임·허브 동작 변경 없음.

## 2026-10-25 — 게임별 사운드 보강 (hub-v1.5.17)
- 8개 기존 Sites 배포, 잿빛 왕관·룬 영토 Pages, 월드 브레이커/경계의 서약 허브 복사본 갱신. 게임별 원본 main 병합 완료. 기존 저장·주소·권한 보존.
- 새 BGM: 멜로디/화음/저음과 별도 켜기·음량. 기존 좋은 음원·효과음은 유지. 숨김 재생/타이머 중복/캐시된 구 음악 중첩 보강. 허브도 숨김 시 정지.
- 실제 결과·배포 경로·테스트·권한 제한·청취 미검증 범위: docs/AUDIO_ROLLOUT_20261025.md. 환상 콜라보 비공개 원본은 연결 허용 목록 누락으로 이번 변경 제외.

## 2026-10-24 — 경계의 서약 α0.10 장비45종 확장 (hub-v1.5.15)
- Source016177fcb4df4228bef42ad5f0cda095415f6456. Total equipment57→102: five growth bands×8gear families (spear/axe/bow/staff/circlet/coat/shield/boots)=40rare plus5cave uniques. Same weapon slot/battle rules, distinct stat tradeoffs; no range/action-mechanics claim. Four new shop pieces per band; all40 in regional random bonuses. Icons distinguish families/slots.
- New one-per-journey cave uniques from elf/treant/beast/merfolk/undead guardian flags; old completions qualify for book claims. Bonus trigger15/60/30% retained, conditional gear75%/relic25%, uniformly within selected category. Each region10gear+2relics. Saved target slot narrows gear only; bag/shop/book display filters independent. Existing auto-equip, unique protection, relic rules, saves/cover/URLs/access unchanged.
- 71checks/build pass (5new all-region shop/targets/copy/save/cave grant checks). Actual360×640 book→boots display filter→boots loot target→new unique claim/no second claim; no horizontal overflow350px. Not full campaign/drop-pacing/physical-phone validation.
- Dist from matching source build, root asset paths made relative only. Catalog/cache updated; concurrent other-game changes preserved. Main/Pages verification after publish.

## 2026-10-24 — 경계의 서약 α0.9 유물·랜덤 보수·유니크 도감 (hub-v1.5.14)
- Sourcebf6eb1ba99aafb864a0c9ea37a2a7038b6527391. Added13items (relic4/equipment9), five guaranteed unique rewards: first hero seal sword, Karin signal lantern, Veronica return shield, Chloe cinder seed, Sera last lamp weapon. One per saved journey, protected from selling/excluded from RNG. Old completed records can claim in book.
- Bonus independent roll normal15%/guardian60%/unopened chest30%, uniform one of regional gear2 + common relic2; compass+5percentage points. Duplicate relic60G, duplicate gear usable across party. Relics2 party-wide active slots: victoryHP2/3%, MP2 or improved bonus chance, living only, combined gear+relicHP cap10%. Existing random drops unchanged. Battle result lists drops/recovery; chest/terminal result guards prevent re-grants.
- Bag and Journal link to filtered book with rarity/effects/sources/conditions/claim states. Unique/found/active flags use unchanged save schema/namespace. Cover, URLs, audiences and other games preserved. New gear works with existing auto-equip.
- 66 checks and build pass (9 new probability/duplicates/unique/all sources/activation/effects/save/actual reward tests). Actual cloud browser360×640: unique retroactive claim → claimed/no second claim, relic2/2 with third disabled; victory loot+HP+MP displayed with client=scroll360×587. Empowered synthetic battle, not full campaign/drop-pacing/physical-phone proof.
- Dist copied from matching source build; only root assets paths changed to relative. Catalog/cache updated. Public deployment/live files checked after commit.

## 2026-10-24 — 경계의 서약 α0.8 회복 장비·파티 자동 장착 (hub-v1.5.13)
- Source5c5668ce436adacceeecbf85fbfc598f5d8dd5af. Three existing-slot recovery items: sprout wrap90G/3%, hearth guard480G/4%, lamp robe980G/5%; shop progression. Victory heals living wearers only (sum cap10%, minimum2, capped at missingHP), named result display and synchronized HP. No flee/defeat/KO equipment heal. Existing victory1HP revival retained. Terminal battle checks cannot duplicate rewards.
- One-tap Party/Bag equipment button distributes top scored owned copies across active party; reserves untouched, quantity conservation, selected existing pieces retained. General weighted stat+recovery score (not role/boss optimization), remaining gear follows party order. No continuous manual-gear override, no free HP/MP from swapping.
- 57 checks/build pass. Actual browser360×640 auto-equip3slots, ATK20→30, HP40/120→40/126; attack/defend victory produced40→43 and Karin144→148, named recovery shown. Synthetic empowered combat, not full-campaign balance/physical-phone proof. Same save namespace/schema/cover/URLs/access. Dist copied with only root assets paths made relative.

## 2026-10-24 — 경계의 서약 동료 연계 던전 α0.7 (hub-v1.5.12)
- Source 6070e5f851904c6d9a85e1364096d9b8b5f1a577. Four optional 3-room dungeons, each with information dialogue, clue investigation, guardian combat and epilogue. Karin → 돌아오지 않은 신호 → Veronica → 이름 없는 귀환자들; Chloe → 꺼지지 않는 재의 우물 → Sera → 마지막 진료소의 등불. Existing owners qualify; briefing completion and prior dungeon completion gate routes; informants need not be in party. Home/party/journal expose paths and requirements.
- Unchanged save schema/namespace/cover/URLs/audience. Additive flags retain route discoveries/checkpoints/clues/defeated guardians/claimed endings; interrupted epilogues resume without duplicate combat or reward. Main campaign seals are separate.
- 52 checks/build passed (9 new chain/real-combat/reload/reward/defeat checks). Actual cloud browser360×640: info → discovery → intro → room; 16px prose, no overflow360×582 dialogue/360×516room. Empowered battle tests prove flow, not difficulty. No physical-phone/full campaign balance claim.
- Dist copied from same source build; only root /assets/ paths changed to relative. Catalog/guide/cache updated; other concurrent changes preserved. Main/Pages live verification follows commit.

## 2026-10-24 — 경계의 서약 새 일러스트 표지 (hub-v1.5.11)
- Source ee64b2ff9eda8a43fae4e784ef4ceaf76a1e31eb. New original built-in imagegen cover: adult Elena/Karin/Veronica/Chloe at fractured-world gateway. Thumb thumbs/chronicle-crossing-cover-v3.svg (embedded WebP + Korean typography); title play/chronicle-crossing/cover-art-v3.webp (1600×900 / 357890 bytes). Prior cover retained. Label remains illustration, not gameplay screenshot. In-game SVG portraits/scenery remain unchanged.
- 43 checks/build passed. Actual browser 360×640 title image loaded, screen client=scroll360×640, no overflow; wide card inspected for Korean title/characters. Save/gameplay/URLs/audience unchanged. Same current stage 2–5 content, no new battle synergy implemented in this cover task.

## 2026-10-24 — 경계의 서약 Stage 5 / α0.6 (hub-v1.5.10)
- Source a275c6abbf8afb1135ec2f3c90d0d7cf88b02c3c. Stage 5 canal rooms/art, sluice and relief choices, Sera reunion with Chloe-specific conversation. Costs 2 potions or 80 G, deferred choices/reload safe, party healed. Stages 2–5 now have 7 choice events, regional synthesized music, original scenery/guardian SVGs and 4 fixed recruitment stories. Existing saves/cover/URLs preserved. Other 8 regions/cave layouts still use initial content.
- 43 automated checks pass. Browser actual 360×640, 16px prose, no overflow on choice screen (360×582), 80 G choice → replies → currency 200→120/event disabled. Five-target room scrolls vertically, no horizontal overflow. Earlier 390×844 stage 2–4 checks below. Chapter combat tests use empowered stats, not campaign balance/physical phone/audio listening proof.
- Each stage was individually tested and published before next: source 20d3c69 → 1553fe5 → 348d926 → a275c6a. Earlier 3 Pages releases completed successfully and live hashes matched. Catalog source commit/description/tips updated; native runtime still no Phaser/canvas.

## 2026-10-24 — 경계의 서약 Stage 4 (hub-v1.5.9)
- Source 348d92661da869382d6dd85809ff0968da200f3c. Ash-town art, vent/resonance choices, Chloe story with Veronica-dependent dialogue. Recruitment additionally requires underground guardian. Chapter-specific guardian SVGs/names added to stages 2–4. 38 automated checks; actual 390×844 Chloe choices/reply/ash visual check. Empowered combat in story tests, not balance proof.
- Same URL/save/cover; stage 3 release verified live before stage 4 edits.

## 2026-10-24 — 경계의 서약 Stage 3 (hub-v1.5.8)
- Source 1553fe5f7fe521fda4b6c1ff9cefed56d717a82a. Frost four-room art, two protection/hearth choice events, Veronica story and Karin-dependent conversation. Opt-in regional music. 33 automated checks pass; actual 390×844 dialogue → choices → selected reply visually verified. Empowered stats in story tests; balance/physical phone/audio listening not verified.
- Same URL/save/cover; stage 2 release was verified live before stage 3 edits.

## 2026-10-24 — 경계의 서약 Stage 2 (hub-v1.5.7)
- Source 20d3c692bf46e6738d97ef008dfc8455c87b23fa. Forest rooms/art, signal tower choices, Karin reunion, original opt-in synthesized BGM. 31 automated checks pass, actual 390×844 introduction/music-toggle/exploration visual check. Combat story test uses empowered stats, not balance proof; physical phone/audio listening not tested. Old completed-save recruitment preserved, quest reactivation fixed.
- Same URLs/save namespace/cover. Stage-by-stage releases continue next.

## 2026-10-24 — 경계의 서약 모바일 오리지널 α0.4 + 표지 (hub-v1.5.6)
- Source efff38a0266617b3d97a39c3731d1e28b7668b8e. Existing /play/chronicle-crossing/ and save namespace unchanged. Old generated assets removed from active tree; prior commits remain in Git history. Other games/data unchanged.
- New native HTML/CSS/SVG app replaces the Phaser scene wrapper. Dist has one 157.62 KB JS / 53.82 KB gzip +31.06 KB CSS /7.73 KB gzip, no Phaser/WebGL chunk or key-event bridge. No canvas exists in actual UI. Headless data/calculation/save modules retained with MIT attribution.
- Illustrated title/home/characters/scenery, native touch travel, battle commands/targets/rewards, party/gear, inventory/use/sell/shop/rest, quest/save journal, dialogue and ending. Fixed recruitment requirements kept. Current 4+2 room templates remain shared; full campaign not playtested.
- Catalog cover thumbs/chronicle-crossing-cover-v2.svg (original native SVG art, Elena/Karin/scenery/title) with coverType=illustration. Reproduce from Site source via tools/export-native-cover.mjs; same asset also shipped as native-cover.svg. It is not a screenshot. No external image assets used.
- Source 29 checks passed (7 new native state/controller checks). Actual 360×640 room screen fits with no overflow, old QA autosave resume/home/party and 390×844 attack/HP change verified. Not physical phone/full campaign proof. Source README/AGENTS point future work to src/native, not archived scenes.
- JSON backup and per-name auto+3 manual slots retained. New-game name collision cannot overwrite an older record silently. Sites/Pages remain separate origins with manual backup transfer.

## 2026-10-24 — 경계의 서약 모바일 진화 α0.3 (hub-v1.5.5)
- Sites source 40d455513054f892c9637d7d7e624954d213d77a 실행본 갱신, 기존 /play/chronicle-crossing/ 주소와 로컬 저장 키 유지. 다른 게임 카드는 그대로.
- 가상패드/합성 키 이벤트 제거. native 방 지도/목적지, 마을 시설, 전투 대상/계속 버튼. 360×640, 20px 입구 화면에서 가로·세로 넘침 없음 확인. 실제 공격→대상 선택→피해와 베로니카 첫 대화→카린 반응 확인. physical phone/full campaign not validated.
- 기존 7명 지역별 고정 조우, 만남 대화+기록 회수+봉인 복구 후 수락 영입. 보스 자동 영입 제거, 이미 영입한 기록 유지. 같은 원작 출신 반응은 새 각색 대사이며 특정 원작 친분은 미확인.
- 원본 22 검사와 빌드 통과. 초기 GameState/원본 게임·서버 저장 구현을 바꾼 것이 아님. Sites와 Pages판 자동 동기화 없음/JSON 백업 유지.
- 사용자 재활용 비용 원칙을 AGENTS에 기록. 원본 설계/참조 이력 docs/MOBILE_EVOLUTION.md (Sites source).

## 2026-10-24 — 경계의 서약 α0.2 목록·실행본 추가 (hub-v1.5.4)
- 사용자 요청: 현재 대화에서 만든 게임을 게임 목록에도 배포. 기존 fantasy-collab와 별도 chronicle-crossing 카드 추가. 다른 게임/저장 키/원본 저장소 공개 여부와 Sites 방문 권한 유지.
- 실행본: play/chronicle-crossing, https://junsa80.github.io/game-hub/play/chronicle-crossing/ . 원본 Sites source commit 088c581ff6bdc806fff55e237669512b96cd0b3f, 기존 URL https://chronicle-crossing.sajuyoon.chatgpt.site . Sites 소스는 아직 별도 junsa80 저장소에 미러링되지 않음.
- 원본 /workspace/sites/chronicle-crossing에서 pnpm build 후 dist/ 전체 복사. 호스팅 수정은 index.html의 /assets/ → ./assets/뿐. 새 업데이트도 동일하게 재생성. Phaser/게임 JS, CSS, LICENSE, credits 함께 보관. 기반 osisdie/phaser-rpg-game MIT; AI 자산 미포함.
- 목적지 선택형 필드 4방+동굴 2방 공통 초안. 거리별 조우→기존 턴제 전투→남은 이동 재개. 마을 주민/시설 직접 선택. 게임 전체 완주와 실제 폰 검증 완료를 주장하지 않음.
- GitHub Pages판은 해당 origin의 로컬 저장; Sites판 진행과 자동 공유되지 않음. 원본 JSON 백업/복원으로 수동 이전 가능, 클라우드 저장 미지원. 기존 Sites 이용자는 이전 백업을 보관할 것.
- 목록/캐시 버전 1.5.4. 계정 저장 지원 수는 실제 games.json에서 계산. 공개 main 배포/라이브 응답 확인은 아래 작업 결과를 따름.

## 2026-10-23 — 대형 멧돼지 부위 애니메이션·공격 타이밍
- 기존 field-preview.html의 가시 멧돼지 1종에 먼저 적용. 몸통·머리·다리·꼬리 + 먼지 타일 5종을 최초 한 번 일반/피격 2세트로 그려 캐시하고 매 프레임 재사용. 외부 이미지 요청 없음.
- 진입→대기→공격 준비→돌진/내려찍기→회복→다음 패턴. 준비 동작과 피해 발생은 같은 상태 머신. 각 공격은 정확히 1회 판정. 회복 중 피해 24, 보통 12, 공격 준비/공격 중 4. 체력 144, 처치 정수 18(이 시제품 멧돼지만).
- 피격 hitstop·반동·점멸·타격 선·카메라 진동, 쓰러짐 후 보상. 선택형 합성 효과음(버튼으로 켬, 기본 꺼짐), 발성 수 최대 4, 종료 시 오디오 노드 연결 해제.
- 검사: node tools/test-field-preview.mjs 및 node tools/test-boar-motion.mjs PASS. 준비/반격 피해 차이·시간 정지·단일 충격·패턴 교대·회피·사망 지연·중복보상 방지·120회 그리기 중 캔버스 최초 10개만 생성 검사.
- 로컬 브라우저에서 필드→확인창→등장, 돌진 후 반격, HP 144→120, 다음 내려찍기 예고를 실제 조작/화면으로 확인. docs/qa/boar-motion-v2.jpg. 휴대폰 프레임/입력 지연·체감 효과음은 실기기 미검증.
- 본편과 다른 몬스터의 전투·세이브는 유지. 프리뷰는 새로고침 초기화. main/배포 확인은 별도 단계. shell hub-v1.5.3, 프리뷰 JS v2.

## 2026-10-23 — 채집·사냥 필드 동작 시제품
- 실제 조작 페이지: play/world-breaker/field-preview.html. 본편 index/main 및 세이브는 변경하지 않음. 새 페이지는 본편 적용 전의 별도 동작 테스트이며 새로고침 초기화.
- 원본 코드: src/field-scene-preview.js. 외부 그림/라이브러리 없이 Canvas 픽셀 그림을 코드로 그린다. 동료 3명(벌목/채광/약초)이 걷기→작업→짐 운반→야영지 납품으로 자원을 실제 획득한다.
- 멧돼지/늑대/수호자 3종 실루엣. 필드 탭 또는 버튼→확인 모달→전투. 취소, 공격, 예고 후 회피, 승리 보상, 패배/후퇴 후 필드 복귀, 재등장 대기 구현.
- 화면 숨김 시 진행 정지. 확인 모달/전투 중 채집 정지. 로그인·오프라인 보상·클라우드 저장 구현을 주장하지 않음.
- 검증: JavaScript 실행기로 상태 전이(채집/확인 정지·취소/쿨다운/승리·중복보상 방지/재등장/패배 복귀/회피) 및 mock DOM/Canvas 렌더링·버튼 연결 smoke 검사 통과. 재실행: node tools/test-field-preview.mjs.
- 실제 브라우저/폰 검증 및 기존 본편과의 밸런스·저장 연동은 별도. 기존 본편의 자동화/시간제한/업그레이드 규칙을 바꾼 것이 아님.
- 원본 junsa80/world-breaker에는 아직 통합하지 않음. 후속 구현 시 이 파일을 원본으로 가져간 뒤 실제 자원 이벤트에 동료 상태를 연결하고 몬스터 진입 규칙을 검증할 것.
- 새 시제품 파일은 hub SW의 /play/ 우회 경로. shell 버전 hub-v1.5.2로 갱신.

## 2026-10-23 — 13개 게임 차별화·공통 편의성 기준
- 사용자 지시를 GAME_DIRECTIONS.md에 기록하고 AI_START/AGENTS에서 연결. games.json의 13개 목록을 기준으로 중심 재미, 비슷한 장르 간 구분, 다음 개발 우선순위와 공통 편의성 적용 절차를 정리.
- 새 방향을 이번에 구현한 것은 아님. 개별 게임의 원본 main·규칙·세이브·배포·방문/편집 권한은 유지. 이번 변경은 인수인계 문서 4개뿐이며 앱/캐시/게임 목록/게임 코드는 변경하지 않음.
- 확인: 13개 id 누락·중복 없음, 내부 문서 연결과 변경 파일 범위 확인. 문서 변경이라 게임 실행/실기기 검사는 수행하지 않음.

## v1.5.1 — GPT 8개 화면 개선 반영 (2026-10-22)
- 8개 원본 main과 기존 Sites 주소에 UI 개선 배포 succeeded 확인. docs/UI_REFRESH_20261022.md를 각 원본에 남김.
- world-breaker만 게임 선택기 안 play/world-breaker를 계속 사용하므로, 기존 URL과 로컬 저장 키를 유지하며 최신 0.7 원본의 index/styles/src/visual을 복사. 0.7 연구 도전은 기존 Sites에 있던 구현이며 이번에 새로 만든 규칙이 아님. 76개 검사 및 단일/정적 빌드 통과.
- 월드 브레이커 Sites 방문 권한은 기존 owner-private 유지. 선택기 방문자는 기존 공개 복사본에서 플레이. 다른 게임 URL·권한·개인 세이브 변경 없음.
- 8개 카드의 commit은 GitHub 최신 main으로 갱신. 선택기 캐시 hub-v1.5.1. 복사 경로 문서에 visual/ 포함.
- 브라우저 미리보기 연결 거부로 실제 390×844 높이·폰 터치 검증은 미완료. Pages 반영은 workflow/live GET으로 별도 확인할 것.

## v1.5.0 — 9개 표지와 13개 초보 안내 (2026-10-22)
- 이미지 없는 GPT 게임 9개에 장르별 신규 표지 일러스트. 기존 대표 이미지 중 hunt-now·beauty-deck는 유지. srpg-prototype은 이후 일러스트 표지로 교체됨(아래 2026-10-23). thumb 경로는 thumbs/<id>-cover-v1.webp, 제작 프롬프트/출처는 docs/COVER_ART.md.
- 전체 13개: 한 줄 매력 소개, 설명, 첫 3단계/조작/팁을 접힌 안내로 추가. 표지를 눌러 게임 실행, 즐겨찾기와 기존 플레이 버튼 유지.
- 이미지 960×540 WebP, 지연 로드. 생성 이미지는 실제 게임 화면이 아니므로 표지 일러스트 라벨. 카드 320px 화면 폭 넘침 방지.
- 범위는 게임 목록의 표지/안내이며 게임 본체 타이틀/전투/저장·기존 URL은 변경하지 않음. 계정 저장 5/13 상태 유지.
- 검사: app.js/sw.js 문법, mock DOM에서 13카드·13이미지·13안내·9일러스트 라벨 렌더링. 표지 9개 시각 검수(성인/일반 복장/문자·워터마크 없음). 실제 브라우저/폰 QA는 환경 URL 정책 차단으로 미실행.
- 공개 배포 확인은 main의 Pages workflow와 실제 버전/이미지 응답을 별도로 확인. GitHub 푸시만으로 사이트 확인 완료라고 보고하지 말 것.

## v1.4.13 — 중복 로그인 배지 제거
- 사용자 요청: 모든 게임의 공통 조건을 카드마다 반복하지 않음. 카드의 로그인 없이 플레이/로그인 필요 배지 렌더링 제거.
- 상단 공통 플레이/저장 안내, 카드별 실제 저장 지원 상태와 플레이 버튼 유지.
- 게임 본체, 주소, 세이브 변경 없음. app.js 문법 검사. 실제 폰 미검증.

## v1.4.12 — 플레이/저장 공통 안내 (2026-10-22)
- 모든 게임 비로그인 플레이, 기기 저장 기본, ChatGPT 로그인은 선택형 계정 저장이라는 공통 안내 추가. 현재 구현은 5/13임을 표시.
- 서버 저장 미구현 8개는 planned. 게임 본체 저장을 일괄 구현한 변경이 아님.
- 원본/커밋/기술 저장 상세를 접힌 개발 정보로 이동. 중복 빨간 경고 제거.
- 전체 적용의 완료 조건/현재 차이는 docs/OPTIONAL_ACCOUNT_SAVE_ROLLOUT.md. 실제 서버 저장 배포 검증 전 supported 변경 금지.

## v1.4.11 (2026-10-22) — 방문 공개, 편집 권한 유지
- 사용자 목표: 13개 게임을 주소만으로 비로그인 플레이. 편집은 소유자와 소유자가 허용한 AI만. GitHub 원본 공개/비공개 상태는 변경하지 않음.
- 목록의 Sites 8개는 실제로 owner-only custom 설정이었음. 네이티브 Sites 도구로 각각 public으로 변경했고 추가 editor는 없음. public은 방문 권한이지 편집 권한이 아님.
- 기존 URL과 저장 키를 유지. 다른 호스트로 옮기거나 기존 로컬/계정 세이브를 이관하지 않음.
- games.json의 login:chatgpt 제거, playAccess:anonymous 추가. public 필드는 이전 원본 공개 여부 데이터라 그대로 두며 방문 권한과 혼동하지 말 것.
- PRISM MUSE: 익명 API 401 때 준비 화면에 머무는 문제 수정. GitHub PR #2 main 병합 `4bb9341`, Sites 소스 `37d8ea4`, Sites v14 배포 succeeded. 비로그인 로컬 저장, 로그인 계정 저장 유지. 기존 41개+익명 시작·플레이·재접속/로그인 저장/오프라인 백업 3개 검사와 빌드 통과.
- 다른 계정 저장 게임 4개는 API 401 후에도 data-cloud-src 스크립트를 실행하는 구조와 사용자별 API 인증을 소스 확인. 기존 계정 저장 데이터와 권한 유지.
- 검증 범위: GitHub Pages 5개 HTML은 쿠키/인증 없는 GET 200. Sites 8개 public/추가 editor 없음은 네이티브 응답 확인. 외부 자동 GET은 Cloudflare error 1010(403)으로 차단되어 실제 방문·전체 게임 화면·스테이지 클리어는 미검증. 내부 브라우저 미리보기도 URL 정책으로 차단됨. 이를 실제 전체 플레이 통과라고 보고하지 말 것.
- Grok/다른 AI: GitHub main에서 이어서 수정하고 해당 호스트에 배포할 것. GitHub 푸시만으로 Sites가 갱신되지는 않음. .openai/hosting.json project_id와 기존 주소·세이브를 유지. 방문 권한은 공개 상태를 유지하고 임의의 editor를 추가하지 않음.

# HANDOFF — game-hub

## v1.4.2 (2026-10-21) — 룬 영토 추가
- `games.json`에 공개 플레이 카드 추가. 주소 https://junsa80.github.io/rune-territories-play/
- 원본은 비공개 `junsa80/rune-territories` `8a1f3f5`. 실행본은 공개 `junsa80/rune-territories-play` `48fe0b1`. 선택기 안에 복사하지 않고 링크로 연다.
- 저장 키 `rune-territories.save.v1`은 `junsa80.github.io` 공통이라 선택기에서 열어도 공개 주소와 기록이 같다. JSON 백업 가능.
- 썸네일 `thumbs/rune-territories.webp` (480×270). SW `hub-v1.4.3`, `?v=1.4.3`.
- 2026-10-22 추가 반영: 원본 `5b827cd`, 실행본 `5738e4e` (UI 0.1.47: 타이틀 키아트·칸 글자, GPT 0.1.46 주사위 수정 포함). 표지 `thumbs/rune-territories-cover-v1.webp`. 직전 `4849ec4` / `51723fc` (UI 0.1.45).
- 2026-10-22 추가 반영: 원본 `37a660d`, 실행본 `760d68e` (UI 0.1.48: 칸 질감·문양, 판 가운데 그림, 카드 틀, 배치/점령/전투 연출).
- 2026-10-22 추가 반영: 원본 `f3356f7`, 실행본 `15e448a` (UI 0.1.49: 대전 한 화면 844).
- 2026-10-22 추가 반영: 원본 `62c0c17`, 실행본 `94fdadc` (UI 0.1.50: 모바일 기준 v2 — 전투 중 작은 판, 12px, 펼침). 선택기 카드 정보·표지 라벨 12px(hub-v1.5.1).
- 자동 검증: `games.json` JSON 파싱. 실제 폰에서 카드 탭은 안 함.

## 게임 추가 방법
1. `games.json`에 항목 추가:
   `{"id":"repo-name","title":"제목","desc":"설명","genre":["장르"],"icon":"🎮","color":"#hex","url":"https://junsa80.github.io/repo-name/","thumb":"thumbs/repo-name.webp","public":true}`
2. 공개+Pages 게임만 `url`/`thumb` 사용. 썸네일은 480px 폭 webp로 `thumbs/`에 넣기.
3. 비공개 저장소는 `"public":false`, url·thumb 없이(이미지 복사 금지). 그라데이션+이모지 카드로 표시됨.
4. `src`·`commit`·`commitKind`·`save`(·`saveWarn`)도 채우기. 원본이 바뀌면 `commit`을 갱신.
5. `sw.js`의 `V`와 `index.html`/`app.js`의 `?v=` 올리기. 커밋은 `[GrokBot]`/`[Grok]` 접두어.

## 현재 상태 (v1.0.0, 2026-10-20)
- 플레이 가능 3개: hunt-now, beauty-deck, srpg-prototype. 비공개 9개는 링크 없음.
- 자동 검증: 헤드리스 Chromium 390x844. 실제 폰 터치 테스트는 안 함.

## v1.1.0 (2026-10-20)
- aster-hunt, last-archive, companion-guild, ember-tactics, fogbound-tactics: playable cards linking to ChatGPT-hosted URLs (`*.sajuyoon.chatgpt.site`). They return 401 unless logged into ChatGPT; card shows badge "ChatGPT 로그인 필요" (`login:"chatgpt"` in games.json).
- Playable = has `url`. 장미의 첨탑·프리즘 뮤즈·뮤즈 스튜디오의 바로 플레이는 Sites 주소다. github.io 복사본은 계정 저장이 없어 기록이 따로다.
- SW cache hub-v1.1.0; asset query ?v=1.1.0.

## v1.2.0 (2026-10-20)
- Hosted static builds in this repo under `play/<name>/`: prism-muse (Next export, rebuilt with basePath `/game-hub/play/prism-muse` in /workspace/private-games/build-prism), muse-studio and world-breaker (relative paths, copied as-is). Original private repos untouched. Saves are local to this browser (not shared with ChatGPT versions).
- rose-spire NOT hosted: images need a source check; card shows badge "이미지 출처 확인 중" (`note` field).
- SW hub-v1.2.0 precaches only the hub shell and bypasses `/play/` entirely.

## v1.2.1 fixes (2026-10-20)
- `053b69d` added `.nojekyll` at repo root so GitHub Pages serves `_next/` folders (prism-muse).
- `baec038` fixed prism-muse asset paths under `/game-hub/play/prism-muse/`.

## v1.3.0 (2026-10-20)
- rose-spire hosted at `play/rose-spire/` — static copy of `junsa80/rose-spire` main `6bf8f6f` (`public/`). Image review passed after GPT replaced all art (`cab10a5`): painted fantasy characters, no photo-realistic people, no 0-byte files.
- Hosting-only edits (game code untouched): absolute `/visual.*` paths made relative (index.html, visual.css); `cloud-save.js` removed and its `cloud-pending` script gate replaced by plain `<script>` tags.
- **Saves are local-only** (this browser's localStorage). No account sync, not shared with the ChatGPT-site version. Card desc says so.
- Badge "이미지 출처 확인 중" removed. SW hub-v1.3.0, ?v=1.3.0. rose-spire repo never pushed to.
- To update: re-copy rose-spire `public/` and reapply the edits above.

## v1.4.0 (2026-10-20) — 출처·반영 커밋·저장 방식 표시
- `games.json` 각 항목에 `src`(원본 저장소), `commit`(반영 커밋), `commitKind`(링크/복사본), `save`(저장 방식), 필요하면 `saveWarn`(카드 경고) 추가. 카드 아래에 작은 글씨로 원본 저장소·반영 커밋·저장 방식을 보여 주고, `saveWarn`이 있으면 붉은 경고 상자로 보여 줌.
- 링크형 게임의 `commit`은 **확인 시점의 저장소 main HEAD**(배포가 main을 따라가므로 이후 커밋이 생기면 값을 갱신). Sites(*.chatgpt.site) 링크는 로그인이 필요해 실제 배포본 커밋을 확인하지 못했고, 저장소 main 기준으로만 적음.
- 복사본(`play/`)의 `commit`은 복사 원본 커밋. 확인 방법: 원본 저장소를 클론해 `diff -rq`.
  - rose-spire `6bf8f6f`: `public/`이 현재 main(`de7cbf4`)과도 같음(그 뒤 커밋은 docs만). 차이는 호스팅 수정(`cloud-save.js` 제거, 절대경로 → 상대경로)뿐.
  - muse-studio `d400d25`: `public/` 마지막 변경 커밋(main `cd1f379`과 같은 내용). `cloud-save.js` 제거.
  - prism-muse `a479cdd`: `app/`·`public/` 마지막 변경 커밋(main `5f7e28e`과 같은 내용), basePath 넣어 다시 빌드.
  - world-breaker `5bb0b6c`: main HEAD와 index.html·styles.css·src/ 동일.
- **rose-spire 저장 방식 (코드로 확인)**: 원본 `public/index.html`은 `cloud-save.js`를 불러 `rose-spire.run.v2`/`rose-spire.meta.v2` localStorage 쓰기를 가로채 `/api/cloud-save`(app/api/cloud-save/route.ts, ChatGPT 로그인 사용자별 DB 저장)로 올림. 선택기 복사본은 `cloud-save.js`가 없고 네트워크 저장 코드도 없어서 이 브라우저 localStorage만 씀. 출처(origin)도 달라 같은 브라우저라도 Sites판 기록을 읽지 못함 → **진행이 자동으로 이어지지 않음**. Sites판(https://rose-spire-deck.sajuyoon.chatgpt.site)은 로그인 없이 401이라 실제 배포본은 직접 열어 보지 못했고, 저장소 코드 기준으로 판단함.
- prism-muse 복사본은 Next 빌드 안에 `/api/save` 호출이 남아 있지만 GitHub Pages에는 API가 없어 실패하고, 브라우저 백업(`prism-muse-backup`)만 남음.
- last-archive, fogbound-tactics 저장 방식은 미확인(저장소 트리에 서버 저장 경로가 없지만 코드를 직접 보지 못함). aster-hunt는 서버 저장 경로 없음 + localStorage 사용 확인.

| id | 원본 저장소 | 반영 커밋 | 종류 | 저장 방식 |
|---|---|---|---|---|
| hunt-now | junsa80/hunt-now | `0213d32` | GrokBot v6.1.0 (PR #4) | 로컬 저장(이 브라우저 localStorage) |
| beauty-deck | junsa80/beauty-deck | `e3271b9` | GrokBot v1.5.1 · 링크 | 로컬 저장(localStorage) · 계정 동기화 없음, JSON 백업 가능 |
| srpg-prototype | junsa80/srpg-prototype | `9afee37` | GrokBot 허브 표기(잿빛 왕관) | 로컬 저장(브라우저 IndexedDB) · 클라우드 미지원 |
| rose-spire | junsa80/rose-spire | `6bf8f6f` | 선택기 안 복사본(public/) | 로컬 전용(이 브라우저 localStorage) · 계정 저장 없음 |
| aster-hunt | junsa80/aster-hunt | `25836fb` | 링크(Sites 배포본 · 배포 커밋 미확인, 저장소 main 기준) | 로컬 저장(저장소에 서버 저장 코드 없음) |
| last-archive | junsa80/last-archive | `5f24ceb` | 링크(Sites 배포본 · 배포 커밋 미확인, 저장소 main 기준) | 미확인 |
| companion-guild | junsa80/companion-guild | `32a8aff` | 링크(Sites 배포본 · 배포 커밋 미확인, 저장소 main 기준) | 계정 저장(ChatGPT 로그인, cloud-save) + 로컬 |
| ember-tactics | junsa80/ember-tactics | `9ad14cd` | 링크(Sites 배포본 · 배포 커밋 미확인, 저장소 main 기준) | 계정 저장(ChatGPT 로그인, cloud-save) + 로컬 |
| prism-muse | junsa80/prism-muse | `a479cdd` | 선택기 안 복사본(정적 빌드) | 로컬 전용(이 브라우저 백업) · 서버 저장은 여기선 동작 안 함 |
| muse-studio | junsa80/muse-studio | `d400d25` | 선택기 안 복사본(public/) | 로컬 전용(localStorage) · 계정 저장 제거됨 |
| fogbound-tactics | junsa80/fogbound-tactics | `5de3a77` | 링크(Sites 배포본 · 배포 커밋 미확인, 저장소 main 기준) | 미확인 |
| world-breaker | junsa80/world-breaker | `5bb0b6c` | 선택기 안 복사본 | 로컬 저장(localStorage) |

## v1.4.1 (2026-10-21) — 인수인계 정리 (문서만, 화면 변경 없음)
- `AI_START.md`(읽는 순서·협업 규칙·배포·제약), `docs/BUILD_PLAY_COPIES.md`(play/ 복사본 재생성 명령), `tools/make_static_copy.py`, `tools/patches/prism-muse-static.patch`, `docs/game-bookmarks.html`(즐겨찾기 가져오기 파일) 추가.
- 이유: 이 저장소의 play/ 복사본은 Grok Bot 작업 상자에서 만들었고, 그 상자는 2026-10-28쯤 사라짐. 이제 빌드 절차가 전부 저장소 안에 있음.

## 전체 게임 표 (2026-10-21 기준, main HEAD는 이날 GitHub API로 확인)
| 게임 | 저장소 (공개 여부) | 담당 AI | 플레이 링크 | 호스팅 방식 | 저장 방식 |
|---|---|---|---|---|---|
| 나만의 게임 선택기 | junsa80/game-hub (공개) | Grok 계열 | https://junsa80.github.io/game-hub/ | GitHub Pages (main /) | 즐겨찾기·최근 플레이 localStorage |
| 헌트 나우 | junsa80/hunt-now (공개) | Grok 계열 | https://junsa80.github.io/hunt-now/ | GitHub Pages (main /) | localStorage + JSON 백업 |
| 미녀 덱 | junsa80/beauty-deck (공개) | Grok 계열 | https://junsa80.github.io/beauty-deck/ | GitHub Pages (main /) | localStorage + JSON 백업/복원 |
| 잿빛 왕관: 새벽의 서약 | junsa80/srpg-prototype (공개) | SRPG 개발봇 | https://junsa80.github.io/srpg-prototype/ | GitHub Pages | IndexedDB(브라우저) |
| 룬 영토 | junsa80/rune-territories (비공개) | Grok 계열 | https://junsa80.github.io/rune-territories-play/ | 공개 실행본 Pages (`94fdadc`) | localStorage (github.io 공통) + JSON 백업 |
| 장미의 첨탑 | junsa80/rose-spire (비공개) | GPT | https://junsa80.github.io/game-hub/play/rose-spire/ (원본 Sites: https://rose-spire-deck.sajuyoon.chatgpt.site) | 선택기 안 복사본(원본 `6bf8f6f`) / ChatGPT Sites | 복사본: localStorage만 · Sites: ChatGPT 계정 저장 |
| PRISM MUSE | junsa80/prism-muse (비공개) | GPT | https://junsa80.github.io/game-hub/play/prism-muse/ | 선택기 안 정적 빌드(원본 `a479cdd`=`5f7e28e`) | 복사본: localStorage만 |
| 뮤즈 스튜디오 | junsa80/muse-studio (비공개) | GPT | https://junsa80.github.io/game-hub/play/muse-studio/ | 선택기 안 복사본(원본 `d400d25`=`cd1f379`) | 복사본: localStorage + 백업 파일 |
| 월드 브레이커 | junsa80/world-breaker (비공개) | GPT | https://junsa80.github.io/game-hub/play/world-breaker/ | 선택기 안 복사본(원본 `5bb0b6c`) | localStorage |
| 아스터 헌트 | junsa80/aster-hunt (비공개) | GPT | https://aster-hunt.sajuyoon.chatgpt.site | ChatGPT Sites (로그인 필요) | localStorage |
| 종말계승 | junsa80/last-archive (비공개) | GPT | https://last-archive-alpha.sajuyoon.chatgpt.site | ChatGPT Sites (로그인 필요) | 미확인 |
| 동료 길드 | junsa80/companion-guild (비공개) | GPT | https://companion-guild.sajuyoon.chatgpt.site | ChatGPT Sites (로그인 필요) | ChatGPT 계정 저장 + 로컬 |
| EMBER TACTICS | junsa80/ember-tactics (비공개) | GPT | https://ember-tactics.sajuyoon.chatgpt.site | ChatGPT Sites (로그인 필요) | ChatGPT 계정 저장 + 로컬 |
| 안개를 걷는 자들 | junsa80/fogbound-tactics (비공개) | GPT (Grok Bot 모바일 화면 수정 `grokbot/mobile-fit`은 main에 병합 완료) | https://fogbound-tactics-remake.sajuyoon.chatgpt.site | ChatGPT Sites (로그인 필요) | 미확인 |

- 복사본 4개는 원본 main과 내용이 같은 상태(2026-10-21 확인: rose-spire main `de7cbf4`는 `6bf8f6f` 이후 문서만 바뀜).
- GPT 게임이 GitHub Pages로 옮겨 가는 건 저장 내보내기/가져오기가 생긴 뒤(사용자 규칙).


- 2026-10-23: hunt-now `82cedb4` (v5.6 몬스터 아이콘·동료 HUD). GrokBot only touched the hunt-now entry.

- 2026-10-23: hunt-now `82cedb4` (v5.7 정화 동료 2D 초상). GrokBot only touched the hunt-now entry.
- 2026-10-23: beauty-deck `27cb3aa` (v1.4.2 손패 겹침 잔선). GrokBot only touched the beauty-deck entry.
- 2026-10-23: hunt-now `2d4e264` (v5.8 전투 3D·타격감). GrokBot only touched the hunt-now entry.
- 2026-10-23: hub srpg-prototype 표기 「잿빛 왕관: 새벽의 서약」 + commit `9afee37`.
- 2026-10-23: SRPG 개발봇이 표지를 `thumbs/srpg-prototype-cover-v1.webp`(960×540, coverType=illustration)로 교체. 커밋 `c0c44a5`. 제목/커밋 라벨은 그대로.
- 2026-10-23: rune-territories `6e8b5ac` / play `d08b178` (UI 0.1.52 판 안 그림). GrokBot only touched the rune-territories entry.

## fantasy-collab
- 2026-10-24 표지 v2: thumbs/fantasy-collab-cover-v2.webp (960×540). 게임 실제 아트 재사용 합성 — 배경 img/cover.jpg(균열 왕좌 홀) 가로 크롭, 카드 초상 아린·세레나·아리아·레오·가렌(img/), 제목 Black Han Sans·부제 Noto Serif CJK KR. 생성 이미지 없음. v1(구 godot-jrpg 텍스트 슬라이드)은 파일만 보존.
- 2026-10-24 모바일 배틀로 선회: source `junsa80/fantasy-collab-battle` 2db7f24 · play `https://junsa80.github.io/fantasy-collab-battle-play/` (511d430). 구 fantasy-collab-play는 레거시
- 2026-10-24 실험판 방 이동+조우를 본편에 통합(사용자 확정, 담당 SRPG봇): source 87a0ec1(게임 26b428e) · play 9f282d9. 6층 방 선택→조우→전투→보스 런
- 2026-10-24 스테이지 2 뒤집힌 홀 (GrokBot, 이슈 #4): source 47011ac · play afcc5bc. 타이틀 스테이지 목록(1·2 열림), 미녀 덱 동료·BGM·배경, 소리 토글
- 2026-10-24 스테이지 3 룬 밭 (GrokBot): source c0570ec · play b2c7add. 룬 영토 동료(레오·노엘·린)·BGM·배경
- 2026-10-24 스테이지 4 성문 잔해 (GrokBot): source a3cf17e · play ea89d9e. 잿빛 왕관 동료(가렌·아서·카엘)·BGM·배경
- 2026-10-24 스테이지 5 왕좌 너머 (GrokBot): source 51534e4 · play 0ef5040. 보스 아르, 표식 동료(가렌·마리엘·레오)·BGM·배경. 스테이지 2~5 모두 열림
- 2026-10-24 표지 한 줄·커버·스테이지 1 층 한 줄 (GrokBot, STORY.md): source d060f57 · play d00bd85
- 2026-10-24 하드 모드 (GrokBot): 타이틀 보통/하드, 적 HP×1.25·공격×1.1만. source 2f57c34 · play 25267f7
- 2026-10-24 승패 한 줄 다듬기 (GrokBot): 스테이지 1 STORY.md, 2~5 인물 대사. source a072b71 · play be93f4f
- 2026-10-24 스테이지 1 방 한 줄 STORY.md (GrokBot): source 73c8c6c · play 52e6d9b
- 2026-10-24 영구 동료 명단 + 출전 고르기 (GrokBot, fcb-meta-v1): source 1cbd7e9 · play feedfc2. 새 저장은 이전과 동일
- 2026-10-24 동료 성장 (GrokBot): 경험치(져도)·Lv1~8·Lv3/Lv6 갈림길·결과 화면 전후 비교. source 58bf921 · play 0e93149
- 2026-10-24 컨텐츠 (GrokBot): 모닥불 대화·유물 4·강적 변종 5·균열 거울 (성장 저장일 때만). source ba007cc · play 7570b09
- 2026-10-24 동료 조합 12 (GrokBot, SYNERGY.md): 출전 고르기 미리보기·전투 🔗 배지. 시작 셋은 조합 없음. source b586da5 · play db82ba3
- 2026-10-24 세라 없는 회복 (GrokBot, SYNERGY.md 13·14): 조합 군영의 붕대·생명의 칸(세라 없을 때) + 가렌·오데트·노엘 Lv6 회복 갈래. 시작 셋 시뮬 그대로. source 981278d · play 3c65f48
- 2026-10-24 동료 의뢰 (GrokBot, QUESTS.md): 영입 동료 단서로 열리는 연계 퀘스트 던전 4 (오데트→마리엘, 노엘→노엘·카엘), fcb-quest-v1. 본편 시뮬 그대로. source 1826d2b · play a3b8d2c
- 2026-10-24 장비·유물·도감 (GrokBot, GEAR.md): 장비 21(일반·희귀·영웅·◆유니크 6) 자동 장착 · 랜덤 전리품 · 유니크 한 번 · 셋째 칸 유물 7(회복 5) · 📖 도감. 시작 셋 시뮬 그대로. source f8269be · play a955147
- 2026-10-24 자동 장착 = 실제 값 기준 (GrokBot, GEAR.md): 유니크 우선 제거, 역할·파티·난이도·대가로 값 계산. 하드 Lv4 아린·세라·아리아 50→78%. 시작 셋 시뮬 그대로. source 620abc8 · play 45b4cd7
- 2026-10-25 자동 장착 값 표 · 권장 레벨 표지 (GrokBot, GEAR.md · STAGES.md): 시뮬로 맞춘 장비 값 표(보통 세라 없는 셋 7.4→10.9%), 스테이지 1~5 · 의뢰 ①~④ · 출전 고르기에 「권장 Lv N」(평균 레벨 비교 색). 시작 셋 시뮬 그대로. source 3400593 · play 5fa0884
- 2026-10-25 난이도 곡선 · 승천 1–10 · 반복 동기 (GrokBot, STAGES.md · GROWTH.md ⑤): 스테이지별 적 배율(1 그대로, 시작 셋 보통 58·35·16·10·9%) · 권장 Lv 다시 잼 · 승천 10단계(단계마다 규칙 하나) · 조각(져도)→제작/강화 · 오늘의 런 · 업적 15/칭호. 이슈 #1 보류는 이 배율 둘만 해제. source dba95eb · play 946e648
- 2026-10-25 미녀 덱 v1.5.0 (GrokBot, beauty-deck HANDOFF): 아리아 우위 축소(Lv1 승천0 58→36%, 7명 34~37%) · 오늘의 원정(날짜 시드·최고 기록·+40/+80 XP) · 승천 4단계 절벽·8~9 평탄 보정 + 권장 레벨 힌트. 링크라 허브 복사본 없음. source 19a913a
- 2026-10-26 미녀 덱 v1.5.1 QA (GrokBot, PR #1, beauty-deck WORKLOG BD-QA-01): 360px·물약 5칸·승천에서 상단 줄 덱·물약이 화면 밖이던 것 수정 · 물약·유물 누르는 범위 · 백업 이관 보강. source 426496a. GrokBot only touched the beauty-deck entry.
- 2026-10-25 헌트 나우 v6.0 (GrokBot, hunt-now HANDOFF): 사냥 Lv 직접 선택(HR은 상한)·장비 적정 표시 · 긴급 의뢰 보스 사다리 4단계(HR 3/6/9/10)+종장 · 적 체력 Lv당 +40→22%, 공격 +20→16% (봇 표: 장비 +5가 Lv7 6/6). 링크라 허브 복사본 없음. source 76db4f4
- 환상 콜라보 1차 허브 카드 추가 (GrokBot)
- 2026-10-26 헌트 나우 v6.0.1 QA (GrokBot, PR #1, hunt-now WORKLOG HN-QA-01): 360px 사냥 탭 넘침 수정 · 앞에서 머리 부위 맞음(마녀·비룡) · 여우 귀 앵커 · 옛 저장 이관 보완. source debb582
- 2026-10-26 환상 콜라보 QA 1차 (GrokBot, PR #5, WORKLOG FCB-QA-01·02·FX-01): 타격감(히트스톱·넉백) · 스모크 360×800·412×915 · 저장 엣지 테스트. source 7a5f01f · play 7576952
- 2026-10-26 헌트 나우 v6.0.2 (GrokBot, PR #2, WORKLOG HN-QA-02): 첫 실행 마무리 콤보 오류 수정 · three.js 압축본(gzip 263→166KB) · perf 테스트. source 15df7e2
- 2026-10-26 환상 콜라보 성능·에셋 (GrokBot, PR #7, WORKLOG FCB-PERF-01·ASSET-01): 표지 webp(첫 로드 1241→842KB), 안 쓰는 에셋 없음. source 8dcc65e · play ddddb4c

## 2026-10-25 — 아르카나 포켓 Alpha 0.3 (hub-v1.5.21)
- Source Sites f7f0c8a2f121baef0a82699be511512ba354db3d. Compact mobile battle, horizontal hand/details/explicit use, 16 original vector card illustrations, HP/mana/target states, collection filters. New generated knight/oracle cover and thumb v2; illustration label retained.
- Actual deck count/incomplete-deck CTA; retry on results/home and collection after editing; already-decked reward retry; pack-result shortcut. Corrupt stored JSON preserved rather than silently overwritten; original can be exported. Same key/rules/economy.
- Rules/progression +300 AI games, UI/save regression suite pass. Actual 360x640 iframe viewport: title, detail/use/summon/mana, AI turn, leader attack. Physical phone and human balance untested. See play/arcana-pocket/HANDOFF.md.
- Hub catalog only Arcana entry edited; other games preserved. Cache/query1.5.21. Sites and Pages publication checked separately; save origins remain separate.

- Publication state: Sites Alpha0.3 deployed; GitHub main merge/push blocked by automatic approval review pending explicit user confirmation. Local review branch gpt/arcana-ui-cover-alpha03. Narrow-board stat wrapping fixed after 360x640 QA; screenshot docs/qa/arcana-mobile-alpha03.jpg.

- User approved main publication. Published via GitHub connector (shell push had no credentials); final source tree verified byte-for-byte. Bumped Pages asset queries0.3.1/hub1.5.22 to bypass cached incomplete first upload. Sites remains Alpha0.3; Pages query-only changes do not affect saves/rules.
- 2026-10-26 13:40 CET (GrokBot): hunt-now `0213d32` v6.1.0 동료 레벨 체감 · beauty-deck `e3271b9` dist 단일 파일 경로 · fantasy-collab source `7ae8500` play `a884c03` (사냥꾼 부적 · 하르트만 · 승천 6+ · 붕대 14%). GrokBot only touched these three entries.
- 2026-10-26 13:42 CET (GrokBot): fantasy-collab source `ac6a14e` play `75eea95` (승천 6 적 HP −18%, Grok 리뷰 FCB-ASC-06). GrokBot only touched this entry.

## 2026-10-26 — GPT 캐시 격리 수정 (game-hub, cache 1.5.23)
- 수정 전 activate 이벤트가 현재 버전 외 모든 origin 캐시를 삭제함을 재현. 같은 junsa80.github.io의 다른 게임 오프라인 자산이 지워질 수 있음.
- sw.js는 자기 게임 접두사의 구버전만 정리. index.html 자산 쿼리/캐시 버전 갱신. 게임 규칙·저장 키·영입·성장 변경 없음.
- `node tools/test-cache-isolation.cjs`: 수정 전 FAIL → 수정 후 PASS. 타 게임 캐시 내용·현재 캐시 보존, 자기 구버전 삭제, 반복 활성화 검증. Node VM 대역 검사이며 실제 폰 오프라인 검사는 미검증.
- 공개본 확인은 game-hub/logs/WORKLOG.md의 통합 결과 참조.

## 2026-10-26 — 통합 감사 인계
17개 게임1차 감사와 미검증 목록: docs/PORTFOLIO_AUDIT.md. 우선순위: docs/MASTER_BACKLOG.md. 이번3개 SW 캐시 격리 수정/공개파일 일치 및 커밋: logs/WORKLOG.md. 다음 AP-01→RT-01→JR-01. 당시 실물폰/모바일3규격 미검증. 이후 모바일 자동검증 및 사용량 조건 변경은 아래 후속 기록 참조.

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
- 2026-10-26 14:20 CET (GrokBot): fantasy-collab source `10d628f` play `ead521b` (FCB-SYN-02 패와 사냥 보스 첫 턴 기절 · 생명의 칸 룬 방패 10 · 승천 7 장비 40% 버그 고침 · test-edge 112) · hunt-now `764b823` (HN-SIM-02 맞는 봇 측정, 테스트만 · GPT 4b8f083 캐시 격리 포함). GrokBot only touched these two entries.

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
