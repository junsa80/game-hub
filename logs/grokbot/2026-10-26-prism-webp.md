# 2026-10-26 [GrokBot] PERF: prism-muse 플레이 사본 이미지 WebP 변환

## 측정 (재현)
- 환경: 헤드리스 Chrome 에뮬레이션 390×844, DPR 3, CPU 4배 감속, 캐시 끔, localhost (실기기 아님)
- 허브 게임 중 prism-muse가 첫 화면 전송량 최대: 4090KB 중 이미지 3284KB, `muses.png` 하나가 2871KB
- 다른 게임: 허브 34KB, muse-studio 485KB, rose-spire 1001KB, chronicle 605KB, world-breaker 335KB, arcana 385KB → 최적화 이득 작음, 손대지 않음
- 프레임 시간: 모든 페이지 중앙값 16.7ms / p95 16.8ms (병목 아님)

## 변경
- `tools/optimize_prism_images.py`: `muses*.png`, `fusion-*.png` 8장 → 같은 해상도 WebP q90, 빌드 청크(css 1, js 1)의 참조만 `.webp`로 교체
- 원본 PNG 유지(삭제 없음). 게임 로직·저장 코드 변경 없음. sw.js 미변경.

| 파일 | PNG | WebP | PSNR |
|---|---|---|---|
| muses (2172×724) | 2871KB | 353KB | 38.1dB |
| muses-special | 2938KB | 416KB | 37.0dB |
| muses-extra | 2929KB | 388KB | 38.6dB |
| muses-extra-special | 2885KB | 400KB | 38.1dB |
| fusion-lumi-serin (1536×1024) | 2753KB | 373KB | 39.2dB |
| fusion-seoa-jia | 2121KB | 195KB | 38.9dB |
| fusion-yuna-harin | 2609KB | 323KB | 39.0dB |
| fusion-yuna-seoa | 1853KB | 137KB | 42.1dB |
| 합계 | 20961KB | 2589KB | |

## 전/후
- 첫 화면 전송량: 4090KB → 1572KB (이미지 3284KB → 766KB)
- 4G 가정(9Mbps, 40ms) + CPU 4배: `muses` 시트 응답 완료 4034/4007/4012ms → 1704/1731/1693ms, networkidle 약 4.5s → 2.2s
- 360/390/412: 콘솔 오류 0, 4xx 0, WebP 8장 모두 브라우저에서 decode 성공·원래 해상도 동일
- 스크린샷: docs/qa/grokbot-prism-webp-{360,390,412}.png (브라우저 에뮬레이션)

## 미검증
- 실기기, iOS Safari 14 미만(WebP 미지원, 2020년 이전 기기)
- 융합 화면을 실제로 열어 본 것은 아님(이미지 decode만 확인)
