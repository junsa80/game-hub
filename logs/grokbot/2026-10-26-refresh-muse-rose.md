# [GrokBot] HUB-REFRESH — play/muse-studio·rose-spire 복사본을 원본 main으로 갱신 (2026-10-26, Europe/Berlin)

- 프로젝트: game-hub / 작업 ID: DEP-01(부분) / 브랜치: grokbot/hub-refresh-muse-rose (origin/main 기준). 원본 저장소에는 푸시하지 않음(BUILD_PLAY_COPIES 원칙).
- 문제(재현): 허브 복사본이 원본 main보다 뒤처짐.
  - muse-studio: 원본 1d40d29(2026-10-22 mobile-finish 병합)의 `mobile.css`/`mobile.js`와 12px 최소 글자 수정이 허브에 없음 → 360×800에서 문서 높이 2712px(촬영 화면이 스크롤 아래), 44px 미만 터치 대상 18개, 12px 미만 글자 11개.
  - rose-spire: 원본 73981b1(2026-10-25 audio-portfolio)의 game-score 음악 연결이 없음.
- 조치: `python3 tools/make_static_copy.py ../muse-studio/public play/muse-studio`, 같은 방식으로 rose-spire. 게임 코드 수정 없음. 신규 파일은 mobile.css, mobile.js, visual/cover.webp(허브 thumbs/muse-studio-cover-v1.webp와 바이트 동일, 신규 그림 아님), rose-spire/game-score.js. 0바이트 파일 없음.
- 테스트(브라우저 에뮬레이션, 실기기 아님)
  - muse-studio 360/390/412: 문서 높이 2712/2682/2668 → 800/844/915(한 화면), 44px 미만 18→7, 12px 미만 글자 11→0, 가로 넘침 없음, 콘솔 오류 없음.
  - 세이브 호환: 구 복사본에서 플레이·저장(muse-studio-v2, 20키) → 새 복사본에서 같은 키로 로드, 크레딧 96 유지, 누락 키 0, 이후 탭으로 96→120 증가.
  - rose-spire: 저장 키(rose-spire.account.v1, run.v2, meta.v2) 동일, 3크기 가로 넘침 없음, 404 없음. `node tools/test-game-score.cjs` PASS.
  - 스크린샷: docs/qa/grokbot-refresh-20261026/*-{before,after}.png
- 남은 이슈: muse 상단 아이콘 33px, rose 상단 버튼 32px·11px 글자는 원본에서 고쳐야 함(복사본만 고치면 다음 갱신 때 사라짐). sw.js 캐시는 건드리지 않음(CACHE-01, GPT).
