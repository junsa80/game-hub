# 아르카나 포켓 Alpha 0.1

Small standalone single-player TCG prototype. Do not fold into or replace other games without a user request.

- Static app: dist/index.html, dist/style.css, dist/app.js
- Pure battle engine and card data: dist/engine.js
- Run rules and 300 complete-game checks: node test.cjs
- 16 cards, 12-card decks, max 2 copies, 25 leader HP, max 8 mana, max 5 units.
- Victory: one 5-card pack; defeat/concede: 5 points; draw: no reward.
- Packs: four C75/R22/E3 slots, one R95/E5 slot, uniform within each rarity.
- Copy cap 2; excess conversion C5/R15/E40; crafting C20/R60/E120; pack price 40.
- Local automatic saves include in-progress battle. JSON export/import. No cloud synchronization.
- Initial collection: 2 copies of 6 types + one welcome pack.
- User direction: prove a small mechanism first, then expand types, patterns and cards. No card stat leveling, payments or ads.

## Verification
Rules tested: summon readiness, guard restriction, simultaneous combat, captain aura, apprentice spell trigger. 300 AI vs AI games terminated within 250 turns. Not evidence of human win rate or balance.
Browser checked: pack opening, duplicate conversion, summoning, AI turn, reload restoring battle. Responsive styles included; physical-phone testing remains necessary.

## Next
Observe human play before adding content. Prioritize meaningful attack/tempo decisions and mobile readability. Add mulligan and more opponent tactics only after feedback. Never invent predicted win rates. Keep data migration compatibility with arcana-pocket-v1.

## 2026-10-25 Alpha 0.2 — deck limits and defeat progression
- Rules: deck20 / copies2 / hand10 / board5, both AI decks obey the same limits. Same local key preserved. Rules migration grants starter collection up to two copies, fills complete old12 decks to20, preserves records/currency/collection and ongoing battles. Incomplete edited decks stay editable.
- First genuine defeat unlocks one choice of nova/knight/oracle, two copies. Old losses qualify retroactively once. Owned reward duplicates convert at Rare15P. Claim persists before deck edit, prevents repeat grants. Exact remove/add preview → apply → retry same opponent or edit further.
- Every three genuine defeats grants an extra pack, in addition to5P per loss. Concession grants5P but no new loss-meter/first-defeat progression. Wins still pack1. Pending rewards survive reload.
- Pure progression module: dist/progression.js. node test.cjs covers old migration/idempotence, same limits for AI, single claim, swap quantity, inventory preservation, defeat meter/concession exclusion + combat/300 full games.
- Actual browser: old ongoing game preserved, defeat → choice → nova2 → study2 removal preview → apply → retry CTA confirmed. Not human win-rate/physical phone validation.
- Hub copy published separately under play/arcana-pocket; origins do not auto-sync. JSON backup imports old/new saves, migrates old rules. Existing free-solo-tcg is a different game and must not be replaced.

## 2026-10-25 Alpha 0.3 — graphics, touch flow, cover
- New original vector illustrations for all 16 cards (art.js), faction colors plus spell double borders and rarity framing. Original generated adult knight/oracle cover (cover-art-v2.webp), hub thumb v2; cover explicitly labeled illustration, not gameplay.
- Compact 5-slot boards with larger ATK/HP and ready/guard states; abilities available through detail dialogs. Horizontal hand independent of hand count; tap opens readable card details before explicit use. Custom simultaneous-damage confirmation; legal target outlines, mana pips, HP tracks. Reduced-motion and keyboard focus/leader activation.
- Collection filters (all/unit/spell/owned), 44px edit buttons. Home reports actual deck size and incomplete-deck fix CTA. Retry remains available on home/results/collection after editing and already-decked reward choices. Pack-grant results link to packs.
- Scroll resets on tab/battle transitions only. Original save key/rules unchanged. Invalid saves are preserved verbatim with explicit warning and raw export; recovery imports replace only after validation/confirmation. Normal saves/battle reload remain compatible.
- Automated engine/progression suite incl 300 AI games; added tests/ui-smoke.cjs for corrupt-save protection, deck guidance, retry, card use, victory pack CTA, reward edge case, reload and legacy active-battle migration.
- Browser QA in 360x640 iframe viewport: title, battle, hand detail -> summon -> mana deduction, AI turn and leader attack. Actual phone, human balance and full campaign not tested. Existing cards, opponent balance and reward economy unchanged.
- Sources: custom card glyphs and game UI patterns adapted within this game's theme; no other game's mechanics imported. These readability/retry/save patterns are candidates for other games, not already applied elsewhere.

## 2026-10-26 — AP-01 손상 대전 저장 보호 (Alpha 0.3.2 / hub 1.5.24)
- 실제 재현: JSON 파싱은 성공하지만 battle.log가 없으면 battleView의 join에서 부팅 중단. 이전 validate가 통과시켜 시작 시 저장도 수행됨.
- 저장/가져오기 공통 validate에서 대전 기록, 자원, 피로, 턴/승자, 유닛 종류·체력·UID·준비 상태, 전장/손패 상한, 성장 보상을 검사. 잘못된 값은 기존 원본 보존·복구 안내 경로로 처리. 전투 기록은 HTML이 아닌 텍스트로 표시.
- 자동검사: 손상14종 거절/원문 보존, 고정 시드 실제 엔진 활성 대전376개 동일 복원, 기존12장 저장 이관·미완성 덱·보상·재도전 회귀 통과. 규칙/성장 및 AI300판 종료 통과. 사람 승률 자료가 아님.
- 저장 키/버전/카드 능력/보상/정상 데이터는 변경하지 않음. 실물 폰 및 이번 변경의 실제 브라우저 복구 조작은 미검증.
