# [GrokBot] HUB-PRISM — play/prism-muse를 원본 main(90a10a1)으로 재빌드 (2026-10-26, Europe/Berlin)

- 프로젝트: game-hub / 작업 ID: DEP-01(부분) / 브랜치: grokbot/hub-refresh-prism. 원본 저장소에는 푸시하지 않음(로컬 빌드 트리만 사용).
- 문제: 허브 복사본은 2026-10-20 빌드(baec038). 원본에는 그 뒤로 익명 플레이(3d640b5), 모바일 화면·표지(8e514ee), 글자 크기(3c8aa6f), 음악(d7ac835)이 병합됨. 기존 tools/patches/prism-muse-static.patch는 90a10a1에 적용되지 않음.
- 조치: BUILD_PLAY_COPIES §3 원칙대로 수동 이식(next.config export+basePath, 아이콘/배경/그림 경로 /prism-muse 접두, /api/save → localStorage 가짜 fetch, api route·chatgpt-auth 제거) → Node 22.11, `npm install`, `npx next build` 성공 → 경로 sed → play/prism-muse 교체. 새 그림은 visual/cover.webp 1개뿐이며 허브 thumbs/prism-muse-cover-v1.webp와 바이트 동일. 패치 파일 갱신, 문서에 메모 추가. sw.js·games.json 미변경(games.json commit은 이미 90a10a1).
- 저장 이전: 키 `prism-muse-static-save`(가짜 fetch) 유지. GET은 `prism-muse-backup`(변경마다 기록)을 우선 → 3분 주기 저장보다 최신 진행 보존.
- 테스트(브라우저 에뮬레이션, 실기기 아님), 같은 origin에서 구 복사본 → 새 복사본 전환:
  - 진행 저장(포인트 640, 강화, 인연 7, 월드 해금, 도전 중 런)을 로드 전 주입 → 구 빌드가 정규화·저장 → 새 빌드 로드: 360/390/412 모두 전체 상태 차이 0개, 진행 중 런 보드(49칸) 복원, 페이지 오류 0.
  - 첫 화면: 문서 높이 1890/1836/1818 → 1141/1097/1096, 12px 미만 글자 5 → 0, 가로 넘침 없음. 44px 미만 버튼 11개는 그대로(원본 디자인; 원본에서 수정해야 함).
  - 스크린샷: docs/qa/grokbot-prism-20261026/
- 미검증: 실제 GitHub Pages 배포 후 동작(sw.js 캐시 버전은 GPT CACHE-01 영역이라 미변경 → 배포 시 캐시 갱신 필요), 실기기.
