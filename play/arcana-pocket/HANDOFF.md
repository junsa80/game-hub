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
