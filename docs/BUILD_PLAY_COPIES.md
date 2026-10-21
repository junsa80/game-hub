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
python3 tools/make_static_copy.py ../src-rose-spire/public play/rose-spire
python3 tools/make_static_copy.py ../src-muse-studio/public play/muse-studio
```
스크립트가 하는 일: `cloud-save.js`·`package.json` 제외, `<script type="text/cloud-pending" data-cloud-src="X">` → `<script src="X">`, `/cloud-save.js` 스크립트 제거, `/visual.*`·`url('/visual/...')` 루트 절대경로 → 상대경로.
2026-10-21 검증: rose-spire `6bf8f6f` public/로 돌리면 현재 `play/rose-spire`와 바이트 단위로 같음. muse-studio는 주석 한 줄만 다름.
**새 그림 확인**: rose-spire 그림이 바뀌면 `public/art`를 먼저 눈으로 확인(실사·실존 인물 닮음·노출 없음, 0바이트 파일 없음: `find play/rose-spire -size 0`).

## 2) world-breaker (빌드 없음)
```bash
rm -rf play/world-breaker && mkdir -p play/world-breaker
cp ../src-world-breaker/index.html ../src-world-breaker/styles.css play/world-breaker/
cp -r ../src-world-breaker/src play/world-breaker/src
```
(2026-10-21 검증: 현재 복사본과 main `5bb0b6c` 파일이 모두 같음.)

## 3) prism-muse (Next.js → 정적 export, basePath)
원본은 ChatGPT Sites용(vinext/Cloudflare, `/api/save` 서버 저장). 정적 빌드를 위해 `tools/patches/prism-muse-static.patch`를 적용한다. 패치 내용:
- `next.config.ts`: `output:'export', basePath:'/game-hub/play/prism-muse', images:{unoptimized:true}, trailingSlash:true, typescript:{ignoreBuildErrors:true}`
- `app/page.tsx`: `/api/save` fetch를 localStorage(`prism-muse-static-save`) 가짜 fetch로 대체, 그림 경로 `/x.png` → `/prism-muse/x.png`
- `app/layout.tsx`, `app/globals.css`: 아이콘·배경 경로 같은 방식
- 삭제: `app/api/save/route.ts`, `app/chatgpt-auth.ts` (정적 export에서 API 라우트 불가), `pnpm-lock.yaml`, `pnpm-workspace.yaml` (npm 사용)
```bash
cd ../src-prism-muse
git apply ../game-hub/tools/patches/prism-muse-static.patch
git rm -q --cached app/api/save/route.ts app/chatgpt-auth.ts 2>/dev/null; rm -f app/api/save/route.ts app/chatgpt-auth.ts pnpm-lock.yaml pnpm-workspace.yaml
npm install
npx next build            # 결과: out/
# 빌드 후 그림 경로 보정(커밋 baec038과 같은 처리): '/prism-muse/' → '/game-hub/play/prism-muse/'
grep -rlZ "/prism-muse/" out | xargs -0 sed -i -E "s#([\"'(])/prism-muse/#\1/game-hub/play/prism-muse/#g"
cd ../game-hub && rm -rf play/prism-muse && cp -r ../src-prism-muse/out play/prism-muse
grep -rho "\"/[a-z_][^\"]*\"" play/prism-muse/index.html | grep -v "^\"/game-hub/" | head   # 남은 루트 경로가 없어야 함
```
2026-10-21 검증: 패치가 `5f7e28e`에 `git apply --check` 통과, 작업 상자의 기존 빌드 결과 `out/`에 위 sed를 돌리면 현재 `play/prism-muse`와 파일이 모두 같음 (빌드 자체를 새 환경에서 다시 돌려 보지는 않음).
주의: 패치는 원본 `5f7e28e`(내용상 `a479cdd`) 기준. 원본 `app/page.tsx`가 크게 바뀌면 `git apply`가 실패할 수 있다 → 같은 원칙(저장 fetch를 localStorage로, 경로에 `/prism-muse` 접두어)으로 손으로 다시 적용. 이 빌드는 원본 저장소에 커밋하지 않는다(로컬 클론만 수정).
`next build`가 vinext 관련 오류를 내면 `package.json`의 `next` 버전(16.x)을 그대로 쓰고 `npx next build`만 실행(`npm run build`는 vinext/Cloudflare 빌드라 쓰지 않음).

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
