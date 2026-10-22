# 게임 목록 표지와 초보 안내

- 제작: 2026-10-22. 내장 ImageGen 사용. CLI/API 키 사용 없음.
- 적용 범위: game-hub 목록의 9개 표지와 전체 13개 초보 안내. 게임 본체 타이틀 화면을 바꾼 변경이 아님.
- 표지는 플레이 화면 캡처가 아닌 홍보 일러스트이며 카드에 표지 일러스트로 표시.
- 인물은 성인, 일반 복장/갑옷, 성적 연출 없음. 원본 게임/실존 인물 참조 없음.
- 런타임 자산: thumbs/<게임 id>-cover-v1.webp. 생성 원본은 프로젝트 작업 사본에 보존하고 웹에는 최적화 WebP만 업로드.
- 기존 4개 표지(hunt-now, beauty-deck, srpg-prototype, rune-territories)는 유지.
- 초보 안내: 한 줄 매력 소개, 첫 3단계, 조작, 첫 도전 팁. 실제 게임에 없는 멀티플레이/클라우드/기능을 약속하지 않음.

## 공통 프롬프트
Wide landscape game cover illustration, 16:9. Strong focal characters in central 70%, readable silhouettes at small thumbnail size, rich environment with foreground/midground/background depth. Lower 20% visually calm for HTML overlays. All human characters clearly adult 23–30, fully clothed, no sexualization. No text, letters, watermark, logo, border, collage or panels. Illustrative promotional cover, not gameplay screenshot.

## 개별 프롬프트

### rose-spire

- 경로: `thumbs/rose-spire-cover-v1.webp`
- 프롬프트: A rose-themed fantasy deckbuilding roguelike. An adult silver-haired female knight and adult dark-haired mage confront a luminous rose-shaped tower, ornate magical cards orbiting their hands, burgundy roses, gilded stone stairs disappearing upward, dramatic painterly fantasy key art. Deep wine and candle gold, elegant intense adventure. No horror gore.

### aster-hunt

- 경로: `thumbs/aster-hunt-cover-v1.webp`
- 프롬프트: A single-player 3D fantasy hunting action game. One adult female ranger in practical green leather armor draws a luminous bow toward a large antlered crystalline beast across a sunlit forest clearing, subtle blue purification motes. Dynamic over-the-shoulder action composition, sweeping forest depth, emerald and turquoise. Premium stylized painted game key art.

### last-archive

- 경로: `thumbs/last-archive-cover-v1.webp`
- 프롬프트: An apocalyptic inheritance training RPG. An adult female archivist in a modest navy and ivory field uniform reaches toward a floating luminous data manuscript while adult companions stand beyond her, a shattered clockwork observatory above a vast dawn-lit ruined world. Cyan holographic ribbons and warm sunrise, hopeful science fantasy painted game key art, inherited knowledge as the motif.

### companion-guild

- 경로: `thumbs/companion-guild-cover-v1.webp`
- 프롬프트: A warm idle guild management RPG. Adult adventurer companions of varied jobs in practical modest fantasy outfits gather around a large wooden planning table, through the window a bustling timber-and-stone guild workshop and resource carts beneath golden morning light. Welcoming amber and forest green, richly detailed painterly fantasy game key art. Emphasize team cooperation and crafting.

### ember-tactics

- 경로: `thumbs/ember-tactics-cover-v1.webp`
- 프롬프트: A turn-based tactical fantasy RPG. An adult armored female captain with a bright scarlet cloak directs two adult allies across a broken stone bridge over glowing embers, small distinct terrain squares subtly suggested in stone paving, banners in wind, a threatening silhouette at the far end. Rich coral orange, dark indigo, cinematic painterly key art, strategy rather than gore.

### prism-muse

- 경로: `thumbs/prism-muse-cover-v1.webp`
- 프롬프트: A colorful match-three party roguelike. Three adult female fantasy performers wearing modest stylish stage jackets and dresses stand amid enormous floating jewel prisms, one pink, one sapphire, one lavender, luminous rainbow cascade curves behind them like a musical stage. Energetic sophisticated anime-inspired painterly game key art, crisp jewel detail. No puzzle board UI, no suggestive poses.

### muse-studio

- 경로: `thumbs/muse-studio-cover-v1.webp`
- 프롬프트: A fashion photography idle collection game. An adult Korean fashion model in an elegant fully opaque pastel pink summer dress poses confidently on a bright airy photography set, a professional camera and softbox silhouette in the foreground, sunlit blue-and-white studio, flowers and editorial elegance. Beautiful polished semi-realistic fashion illustration, wholesome premium game key art.

### fogbound-tactics

- 경로: `thumbs/fogbound-tactics-cover-v1.webp`
- 프롬프트: A tactical roguelite through misty ruins. Three adult female companions, a silver-haired armored knight, brown-haired forest archer and warm blonde healer in modest travel robes, walk with a glowing lantern toward a ruined bell tower emerging from teal fog. A forked stone path, mossy walls, warm lantern gold, delicate ink and gouache painterly storybook key art, brave hopeful adventure.

### world-breaker

- 경로: `thumbs/world-breaker-cover-v1.webp`
- 프롬프트: A touch-driven resource gathering and monster combat incremental game. A determined adult female explorer in practical workwear raises a mining pick at a floating island's glowing blue crystal seam, timber camp and verdant forest nearby, distant worlds fractured into the sky beyond. Warm daylight and saturated sapphire crystals, painterly charming adventure key art. No high-tech weapons.
