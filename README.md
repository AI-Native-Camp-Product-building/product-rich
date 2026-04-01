# Liveklass Extensions Marketplace

고객사 노출용 확장 기능 마켓의 배포 저장소.

## 목적

- `extensions.liveklass.com` 같은 별도 도메인에 서빙할 정적 앱 관리
- 공개 가능한 앱 카탈로그와 요청 CTA 운영
- 메타데이터 기반 빌드와 배포 자동화

## 구조

```text
catalog/apps/         앱 메타데이터 원본
site/app-marketplace/ 배포용 정적 앱
scripts/              빌드/가져오기 스크립트
```

## 명령어

```bash
npm run build
npm run serve
npm run import:feature-workarounds
```

## 운영 원칙

- 이 저장소의 단일 소스 오브 트루스는 `catalog/apps/*.json`
- `site/app-marketplace/catalog.json`, `catalog.js`는 빌드 산출물
- `feature-workarounds`는 근거/아카이브 저장소로 유지
- 필요 시 `import:feature-workarounds`로 메타데이터를 가져와 동기화
