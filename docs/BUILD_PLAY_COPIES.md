## 2026-10-25 · 경계의 서약 개발 원본 이관 완료
- 원본: private `junsa80/chronicle-crossing` main(e7315fa부터 전체 TypeScript·tools·lock·LICENSE·표지 출처 포함). 이후 이 GitHub를 기준으로 수정한다. 아래의 Sites만 원본이라는 이전 설명은 이관 전 기록이다.
- `pnpm install --frozen-lockfile` → `node tools/test.mjs` → `pnpm build`. 71검사 및 기존 배포번들9개바이트 동일 확인.
- dist 전체를 hub `play/chronicle-crossing/`에 복사하고 index의 /assets/만 ./assets/로 수정. 기존 game-score.js와 로더는 원본 public/index에 이미 포함되어 있으므로 중복 삽입하지 않는다.
- `.openai/hosting.json`의 기존 Site ID·접근권한 유지. Sites 재배포도 GitHub 최신 소스에서 한다. 기존 Sites와 Pages는 별도 origin 저장/JSON 수동 이전이며 자동 동기화를 주장하지 않는다.
- 이번 이관은 기존dist 보존/소스 보완만 했으며 허브 실행본을 바꾸지 않았다.

# play/ 복사본 다시 만들기 (BUILD_PLAY_COPIES)

GPT 게임 4개(비공개 저장소)를 선택기 안 `play/<이름>/`에 정적 복사본으로 둔다. 원래 이 작업은 Grok Bot 작업 상자(`/workspace/private-games`)에서 했고, 그 상자는 2026-10-28쯤 사라진다. 아래 명령만 있으면 어느 셸 환경(Linux/macOS, git, Python 3, Node 22+)에서든 다시 만들 수 있다.

원칙: **원본 저장소에는 절대 푸시하지 않는다(특히 rose-spire).** 읽기 전용 클론만 쓴다. 게임 코드는 바꾸지 않고, 호스팅에 필요한 수정만 한다. 복사본 저장은 이 브라우저 localStorage에만 남고 ChatGPT Sites판(계정 저장)과 이어지지 않는다.

준비 (비공개 저장소라 junsa80 권한으로 로그인된 git 필요):
```bash
mkdir -p ~/hubwork && cd ~/hubwork
git clone https://github.com/junsa80/game-hub.git
for r in rose-spire muse-studio world-breaker prism-muse; do git clone https://github.com/junsa80/$r.git src-$r; done
cd game-hub
```

## 1) rose-spire, muse-studio (정적 public/)
```bash
python3 tools/make_static_copy.py ../src-rose-spire/public ../rose-spire-staged
python3 tools/make_static_copy.py ../src-muse-studio/public ../muse-studio-staged
```
2026-10-27 안전 변경: 출력 폴더가 이미 있으면 거절한다. 기존 play 폴더를 삭제하지 말고 새 staging을 만들어 원본·허브 전용 변경을 비교한 뒤 게시한다. 원본 부재·UTF-8 해석 실패에도 기존 공개 파일은 보존되고 부분 출력은 남지 않는다. `python3 tools/test-static-copy.py`로 회귀 확인.

스크립트가 하는 일: `cloud-save.js`·`package.json` 제외, `<script type="text/cloud-pending" data-cloud-src="X">` → `<script src="X">`, `/cloud-save.js` 스크립트 제거, `/visual.*`·`url('/visual/...')` 루트 절대경로 → 상대경로. 뮤즈 설정의 계정 저장 설명도 Pages의 브라우저 저장·백업 이전 안내로 바꾼다.
2026-10-21 검증: rose-spire `6bf8f6f` public/로 돌리면 현재 `play/rose-spire`와 바이트 단위로 같음. muse-studio는 주석 한 줄만 다름.
**새 그림 확인**: rose-spire 그림이 바뀌면 `public/art`를 먼저 눈으로 확인(실사·실존 인물 닮음·노출 없음, 0바이트 파일 없음: `find play/rose-spire -size 0`).

## 2) world-breaker — 원본 + 검증된 허브 개선 (2026-10-27)

원본 main a48859f의 규칙·성장·연구 도전은 유지되지만, 허브 a217903에 새 그림·샘플 효과음과 이를 읽는 코드가 추가되었다. **이전의 폴더 삭제 후 단순 복사 명령은 사용하지 않는다.** 그림·효과음과 game-score.js까지 잃을 수 있다.

~~~bash
python3 tools/build_world_breaker_copy.py ../src-world-breaker ../world-breaker-staged
# 새 staging만 생성. 기존 출력 폴더가 있으면 중단.
python3 tools/test-world-breaker-copy.py ../src-world-breaker
diff -qr play/world-breaker ../world-breaker-staged
# 원본 게임 테스트 및 변경 차이를 검토한 뒤 승인된 범위에서 staging을 복사·게시한다.
~~~

- tools/patches/world-breaker-overlays.json: 원본 커밋, 허브 개선 커밋, 원본 파일 Git blob, 유지할 허브 파일 SHA256.
- 원본 index/main/art/audio가 변경되었으면 자동으로 구버전을 덮어씌우지 않고 충돌로 중단한다. 새 원본에 같은 자산 경로가 생기거나 허브 개선 파일이 바뀐 경우도 중단한다. 해당 변경을 검토·통합하고 manifest를 갱신한 뒤 재실행한다.
- 원본 소스/기존 공개 파일은 읽기 전용. 필수 파일과 충돌 검증 후에만 새 staging 생성. 캐시나 사용자 저장에 접근하지 않음.
- 2026-10-27 기준 canonical10파일 + hub overlay38파일 → 중복 교체4개를 반영한 최종44파일. 현재 공개 복사본과 전부 바이트 동일 재생성 확인. 게임 규칙3파일(data/engine/trials), styles, game-score는 원본과 동일.
- PRIVATE 원본에 허브 전용 그림·효과음을 자동 역이식하지 않는다. Sites와 Pages 실행본은 별개이며 사용자 저장도 origin별이다.

## 3) prism-muse (Next.js → 정적 export, basePath)
원본은 ChatGPT Sites용(vinext/Cloudflare, `/api/save` 서버 저장). 정적 빌드를 위해 `tools/patches/prism-muse-static.patch`를 적용한다. 패치 내용:
- `next.config.ts`: `output:'export', basePath:'/game-hub/play/prism-muse', images:{unoptimized:true}, trailingSlash:true, typescript:{ignoreBuildErrors:true}`
- `app/page.tsx`: `/api/save` fetch를 localStorage(`prism-muse-static-save`) 가짜 fetch로 대체, 그림 경로 `/x.png` → `/prism-muse/x.png`
- `app/layout.tsx`, `app/globals.css`: 아이콘·배경 경로 같은 방식
- 삭제: `app/api/save/route.ts`, `app/chatgpt-auth.ts` (정적 export에서 API 라우트 불가), `pnpm-lock.yaml`, `pnpm-workspace.yaml` (npm 사용)
**2026-10-29: 기존 `rm -rf play/prism-muse && cp ...` 게시 절차는 폐기한다.** a155dc9/e508195에서 번들 JS·CSS·index 및 배경3개/효과음3개를 직접 수정했다. 원본 단순 재빌드는 이 변경을 잃는다.

새 정적 빌드는 원본의 **별도 임시 체크아웃**에서 기존 static.patch 적용과 Next export를 수행한다. 원본 체크아웃/공개 폴더를 삭제하지 않는다. 생성한 out의 경로 보정까지 끝낸 뒤 아래 도구에 전달한다.

```bash
python3 tools/stage_prism_copy.py ../prism-export ../prism-staged
# 새 staging만 생성한다. 기존 출력 폴더/입력 내부 출력은 거절한다.
# 바이트 해시가 다르면 게시 중단: 새 소스와 허브 개선을 검토하여 통합한다.
```

- `tools/patches/prism-muse-overlays.json`: 검토된 정적 기준38파일, 현재44파일, 교체/추가9파일의 SHA256. 현재 private main90a10a1 확인. 정적 기준은 hub1a610a4의 실행본이며 최신 private 소스를 새로 빌드했다는 의미가 아니다.
- `stage_prism_copy.py`는 **빌드 도구가 아닌 호환성 검사·보존 staging 도구**다. 입력의 파일 집합/내용이 기준과 다르면 최신 소스를 구번들로 덮지 않고 중단한다. 변경된 허브 파일, 새 원본 자산 충돌, 누락 파일, 심볼릭 링크도 중단한다.
- hashed chunk명·모듈 참조가 바뀐 새 Next 빌드에 구번들을 자동 이식하지 않는다. 변경을 소스 수준에서 통합하고 게임/저장/모바일 검증을 거친 후 manifest를 갱신해야 한다. 검사를 통과시키기 위해 해시만 새로 찍지 않는다.
- 검토된 과거 export에서 현재44파일 전체 재구성 및 입력 비변이 검증 완료. **현재 private 소스의 새 Next 빌드/배포와 Sites 동기화는 미검증**. 이 보존 검사를 게임 동작 테스트로 보고하지 않는다.

회귀 fixture 복원(공개 Git 이력만 사용):
```bash
git fetch origin 1a610a41bac1585c39ed88a5a117d9f25645d2b8
mkdir ../prism-baseline
git archive 1a610a41bac1585c39ed88a5a117d9f25645d2b8 play/prism-muse | tar -x -C ../prism-baseline --strip-components=2
python3 tools/test-prism-copy.py ../prism-baseline
```

검토 후 게시 시에만 기존 배포 절차로 게임 단위 diff와 저장 호환을 확인한다. 이 도구는 Git push, Pages 게시, 개인 세이브 접근을 하지 않는다.

## 4) 마무리
```bash
# games.json 해당 항목 "commit" 을 복사한 원본 커밋 7자리로 갱신
# sw.js 의 V='hub-vX.Y.Z' 와 index.html 의 ?v=X.Y.Z 올리기
touch .nojekyll   # 반드시 유지(_next 폴더 서빙)
git add -A && git commit -m "[GrokBot] refresh play/<name> from <repo>@<sha>" && git push
```
확인: 1~2분 뒤 https://junsa80.github.io/game-hub/play/<name>/ 열기, 헤드리스나 폰으로 첫 화면·첫 전투까지.

## 원래 작업 상자에서 쓰던 경로 (참고, 상자 종료 후 없음)
- `/workspace/private-games/build-prism` (prism-muse 패치된 작업 트리), `/workspace/private-games/rose`, `/workspace/private-games/src/*`
- 헤드리스 검사: `NODE_PATH=/tmp/pt/node_modules` (puppeteer-core 24.43.1), Chrome `/usr/bin/google-chrome`. 새 환경에선 `npm i puppeteer-core@24` 후 그 `node_modules` 경로를 `NODE_PATH`로.

## 아르카나 포켓 (2026-10-25)
- Source Site project_id appgprj_6adde2e8fb888191b33534e61105f710, local source /workspace/sites/arcana-pocket. Sites source commit67d8d3bc4fff7c46738f70d5a81e828d157c0079.
- Copy dist/index.html, engine.js, progression.js, app.js, style.css byte-for-byte to play/arcana-pocket/. No root asset path adjustments needed. Pure source is preserved in this GitHub folder as well; tests/test.cjs runs with node.
- Keep localStorage key arcana-pocket-v1; JSON export/import moves data between origins. Do not replace the unrelated play/free-solo-tcg. Update catalog source commit and cache on refresh.
- Alpha0.3 source f7f0c8a2f121baef0a82699be511512ba354db3d additionally requires dist/art.js and dist/cover-art-v2.webp. Copy all seven dist assets; retain legacy files when no longer referenced. UI/save regression test is play/arcana-pocket/tests/ui-smoke.cjs. Cover prompt: original adult ivory/gold legion knight and navy celestial oracle duel using sun-dragon/crystal-sentinel/meteor collectible cards, painterly fantasy, teal/gold, wide16:9, no text; generated with built-in ImageGen, title typeset separately in hub SVG and game HTML. Thumbnail thumbs/arcana-pocket-cover-v2.svg embeds compressed WebP; original runtime image play/arcana-pocket/cover-art-v2.webp (1600x900).

## 2026-10-27 뮤즈 스튜디오 재생성 검증
- 원본 c30c4fc public256개(제외 cloud-save.js/package.json)에서 생성. 모바일 CSS/JS 및 visual/cover.webp도 반드시 포함한다.
- tools/test-muse-mobile.cjs [staging 경로]: Playwright 및 CHROME 환경변수 필요. 360×800/390×844/412×915 실제 브라우저 자동 검사.
- play/muse-studio는 Pages 사본이고 현재 games.json의 기본 URL은 Sites이다. 기본 URL/저장 origin을 임의 교체하지 않는다.
