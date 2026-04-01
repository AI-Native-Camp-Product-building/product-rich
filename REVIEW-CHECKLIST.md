# REVIEW CHECKLIST

검토일: 2026-04-01

## 범위

- 현재 워크트리의 실제 파일
- Git 히스토리 전체
- 빌드 및 JavaScript 문법 검증

## 결과 요약

| 항목 | 상태 | 확인 내용 | 조치 |
| --- | --- | --- | --- |
| 1. 민감정보 노출 | 보완 완료 | `.env*` 파일은 워크트리와 Git 히스토리에서 발견되지 않음. 대신 로컬 전용 `.claude.json`에 `secret=` 쿼리 파라미터가 있었고, 미추적 상태였음. `site/app-marketplace/config.js`에는 Supabase anon key가 현재/과거 커밋에 존재하지만 브라우저 공개용 anon key이며 service role 키나 private key는 발견되지 않음. | `.gitignore`에 `.claude.json`, `.env*` 추가. `.claude.json`은 Git 미추적 상태 유지. |
| 2. 코드 품질 | 양호 | `TODO`, `FIXME`, 주석 처리된 죽은 코드 패턴은 추적 파일에서 발견되지 않음. `console.log`는 CLI 빌드/가져오기 스크립트에만 존재하며 불필요한 런타임 로그는 없음. | 코드 정리 수정 없음. |
| 3. README 완성도 | 보완 완료 | 기존 README에 외부 공유용 링크, 기술 스택, 실행 방법, 배포 정보가 부족했음. | `README.md`에 GitHub/Vercel 링크, 스택, 시작 방법, 배포 정보 추가. |
| 4. 불필요한 파일 | 보완 완료 | `.gitignore`에 `.next`, `dist`, `build`, `coverage`, `.env*`, 로컬 설정 파일, OMX 상태 디렉터리 등이 빠져 있었음. | `.gitignore` 보강. 기존 `.vercel` 무시도 유지. |
| 5. package.json | 양호 | `dependencies`, `devDependencies`가 비어 있어 제거할 패키지가 없음. 스크립트는 `build`, `serve`, `import:feature-workarounds`만 존재. | 수정 없음. |
| 6. TypeScript/Lint 에러 | 확인 완료 | TypeScript 및 ESLint 설정 파일이 저장소에 없음. 대신 실제 사용 중인 JS 엔트리와 빌드를 검증함. | `npm run build`, `node --check`로 검증. |
| 7. 커밋 히스토리 | 확인 완료 | `.env*`, `.claude.json`, service role 키, private key, GitHub/Vercel 토큰 패턴은 히스토리에서 발견되지 않음. Supabase anon key는 `site/app-marketplace/config.js`에 커밋 이력이 있으나 공개용 키임. | 기능 변경 없이 유지. 필요 시 별도 서버 경유 구조로 전환 후 키 회전 검토 가능. |

## 검증 명령

```bash
git status --short
git check-ignore -v .claude.json HANDOVER.md .vercel
git log --all --oneline -- '**/.env*'
git log --all --stat -- .claude.json
git rev-list --all | xargs -I{} git grep -nE '(api[_-]?key|secret|token|password|passwd|client_secret|access_key|private_key|BEGIN [A-Z ]+PRIVATE KEY|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z\\-_]{35}|eyJ[a-zA-Z0-9_\\-]{20,}\\.[a-zA-Z0-9_\\-]{20,}\\.[a-zA-Z0-9_\\-]{20,})' {}
npm run build
node --check site/app-marketplace/app.js
node --check scripts/build-marketplace.mjs
node --check scripts/import-feature-workarounds.mjs
```

## 수정 파일

- `.gitignore`
- `README.md`
- `REVIEW-CHECKLIST.md`

## 남은 리스크

- `site/app-marketplace/config.js`의 Supabase anon key는 공개용이지만 저장소와 히스토리에 남아 있습니다. 현재 RLS 정책상 anon은 INSERT만 가능하도록 설계되어 있어 즉시 민감정보 이슈로 보지는 않았습니다.
- 완전한 "키 없는 공개 저장소"를 원하면 브라우저 직접 호출 대신 서버 측 엔드포인트로 요청/피드백을 중계하고 anon key를 교체하는 작업이 별도로 필요합니다.
