# 나만의 게임 선택기 (game-hub)

junsa80의 모든 게임을 한곳에서 실행하는 모바일용 런처. 플레이: https://junsa80.github.io/game-hub/

- 정적 HTML/JS, GitHub Pages(main 브랜치 루트) 배포, PWA(홈 화면 추가 가능)
- 게임 목록은 `games.json` 하나에서만 관리
- 즐겨찾기·최근 플레이는 localStorage(이 기기에만 저장, 클라우드 동기화 없음)
- 카드마다 원본 저장소·반영 커밋·저장 방식을 표시(`games.json`의 `src`/`commit`/`save`). 선택기 안 복사본(`play/`)은 이 브라우저에만 저장되고, 계정 저장을 쓰는 Sites판과 진행이 이어지지 않음.
- 다른 AI가 이어받을 때: 먼저 `AI_START.md`를 읽기.
