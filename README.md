# Liveklass Extensions Marketplace

1. **누구의 어떤 문제를 푸는가**: 라이브클래스 고객사가 공식 기능에 없는 디자인/기능 커스텀을 어떻게 적용해야 할지 모르는 문제를 풉니다.
2. **핵심 동작**: 확장 기능 카드 클릭 → 코드 스니펫 복사 → 적용 가이드를 따라 내 사이트에 바로 적용.
3. **누구에게 보여줄 것인가**: 라이브클래스 고객사 + 세일즈팀 (미팅 시 URL 공유 도구로 사용).

---

라이브클래스 고객사에 공유하는 정적 확장 기능 마켓 저장소입니다. 앱 카탈로그 메타데이터를 기준으로 정적 사이트를 빌드해 GitHub와 Vercel에 배포합니다.

## 링크

- GitHub: `https://github.com/Rich00lee/liveklass-extensions-marketplace`
- Vercel: `https://liveklass-extensions-marketplace.vercel.app`

## 목적

- `extensions.liveklass.com` 같은 별도 도메인에 서빙할 정적 앱 관리
- 공개 가능한 확장 기능 카탈로그와 지원 요청 CTA 운영
- 메타데이터 기반 빌드와 배포 자동화

## 기술 스택

- Vanilla HTML, CSS, JavaScript
- Node.js 기반 빌드 스크립트 (`scripts/build-marketplace.mjs`)
- Supabase REST API + RLS 기반 요청/피드백 저장
- Vercel 정적 배포
- GitHub Actions Pages 배포 워크플로우

## 프로젝트 구조

```text
catalog/apps/         앱 메타데이터 원본
site/app-marketplace/ 배포용 정적 앱
scripts/              빌드/가져오기 스크립트
supabase/migrations/  요청/피드백 테이블 스키마
docs/                 운영 정책 문서
apps-script/          레거시 Apps Script 예시
```

## 시작 방법

```bash
npm run build
```

`catalog/apps/*.json`을 읽어 `site/app-marketplace/catalog.json`, `catalog.js`를 생성합니다.

```bash
npm run serve
```

로컬에서 `http://localhost:4173`로 정적 사이트를 확인합니다.

```bash
npm run import:feature-workarounds
```

상위 디렉터리의 `feature-workarounds` 저장소에서 `plugin.json` 파일을 가져와 카탈로그 원본을 갱신합니다.

## 운영 메모

- 단일 소스 오브 트루스는 `catalog/apps/*.json`입니다.
- `site/app-marketplace/catalog.json`, `catalog.js`는 빌드 산출물이므로 커밋하지 않습니다.
- 브라우저에서 사용하는 공개용 Supabase anon key는 [`site/app-marketplace/config.js`](/Users/liveklass/liveklass-extensions-marketplace/site/app-marketplace/config.js)에 있습니다.
- 서비스 역할 키, 개인 토큰, 로컬 설정 파일은 저장소에 커밋하지 않도록 `.gitignore`로 차단합니다.

## 배포

- Vercel은 [`vercel.json`](/Users/liveklass/liveklass-extensions-marketplace/vercel.json)을 기준으로 `npm run build` 후 `site/app-marketplace`를 배포합니다.
- GitHub Pages 워크플로우는 [`.github/workflows/deploy.yml`](/Users/liveklass/liveklass-extensions-marketplace/.github/workflows/deploy.yml)에 있습니다.
