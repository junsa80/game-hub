# 통합 작업 로그

## 2026-10-26 — 최초 감사 기록 (GPT)
- 연결 저장소 21개/허브 게임17개 조사. 공개 원본 clone, 비공개 원본은 GitHub connector의 고정 SHA 파일 조회. 계정/권한/공개 범위 변경 없음.
- 48개 협업 문서와 주요 런타임/시험 코드 수신. 초기 검사 실패 중 의존 소스/그림/git 이력 부재는 환경 제약으로 별도 표기.
- Rune 61, Arcana 규칙/300판/UI-save 대역 통과. Free Solo 단위/저장/규칙95/시뮬 통과. Companion/Ember/Prism verify 재실행 통과. Beauty 시뮬100 설정 no crashes/softlocks/invariant violations.
- Fog 91/92; 남은 자산 검사 환경 부족. Aster vendor, Last Archive 구버전 git 비교, Rose/Muse 이미지 등은 전체 통과로 보고하지 않음.
- 공개 허브17카드와 Arcana 홈 브라우저 확인. 로컬 Chromium 다운로드가 ZIP 손상으로 실패; 요청3크기·실물폰 미검증.
- 실제 코드 변경 전 PORTFOLIO_AUDIT / MASTER_BACKLOG 저장. 다음: 세 SW의 다른 게임 캐시 삭제를 재현→격리→회귀→작은 커밋/라이브 확인.
- 사용량 조회 도구 없음. 3개 수정 완료 후 사용자 잔여량 확인. 리셋/추가 크레딧 사용 없음.

## 2026-10-26 — GPT 캐시 격리 수정 (game-hub, cache 1.5.23)
- 수정 전 activate 이벤트가 현재 버전 외 모든 origin 캐시를 삭제함을 재현. 같은 junsa80.github.io의 다른 게임 오프라인 자산이 지워질 수 있음.
- sw.js는 자기 게임 접두사의 구버전만 정리. index.html 자산 쿼리/캐시 버전 갱신. 게임 규칙·저장 키·영입·성장 변경 없음.
- `node tools/test-cache-isolation.cjs`: 수정 전 FAIL → 수정 후 PASS. 타 게임 캐시 내용·현재 캐시 보존, 자기 구버전 삭제, 반복 활성화 검증. Node VM 대역 검사이며 실제 폰 오프라인 검사는 미검증.
- 공개본 확인은 game-hub/logs/WORKLOG.md의 통합 결과 참조.
