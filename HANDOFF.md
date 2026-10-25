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
- 기존 7명 지역별 고정 조우, 만남 대화+기록 회수+봉인 복구 후 수락 영입. 보스 자동 영입 제거, 