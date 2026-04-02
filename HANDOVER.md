# Handover — 2026-04-01 (세션 2)

## 작업 요약

이전 세션에서 초기 배포까지 완료한 상태에서, 이번 세션에서 디자인 통일 + Supabase 백엔드 + 정책 수립 + 페이지 재설계를 완료했다.

### 완료된 작업

1. **Framer 공홈 디자인 토큰 통일** — `styles.css`
   - Color: warm brown → 뉴트럴 (30곳+), 브랜드 핑크 `#ff2f67` → `#fc1150`
   - Typography: h2 lh 1.08→1.3, h3 19→22px, body Medium 500, kicker SemiBold
   - Font: Pretendard Variable CDN 추가
   - 포스터: 다크 톤 + 핑크 accent + 글래스 카드 리디자인

2. **모바일 반응형** — 640px / 1080px 2단계 브레이크포인트

3. **CSS 전면 리팩토링** — `styles.css`
   - 한 줄 압축 → 속성별 줄바꿈 + 섹션별 주석
   - 공홈 여백 벤치마킹 (섹션 100px, 간격 60px, 좌우 40px, 카드 32px)
   - `--text-light` 변수 추가

4. **Supabase 백엔드 연동**
   - 프로젝트: `extensions-marketplace`, Seoul (ap-northeast-2), Nano
   - URL: `https://pexuiwzimatyawmqqytr.supabase.co`
   - `requests` 테이블 + RLS (anon INSERT) + updated_at 트리거
   - `config.js`: Supabase URL + anon key 설정
   - `app.js`: 폼 제출 → Supabase REST API 직접 호출
   - 폼 제출 → DB INSERT 검증 완료 (테스트 데이터 1건)

5. **Extensions 정책 문서 확정** — `docs/extensions-policy.md`
   - 목적: 오픈소스 확장 + 셀프서브 우선 + 무료 지원
   - 페이지 성격: 세일즈 도구 (URL 직접 공유, 공홈 미노출)
   - 가격: 전부 무료 (향후 로그인 게이팅으로 대상 제한)
   - 노출 기준: 1곳 적용 + 가이드 + 제한사항 명시
   - 피드백: 마켓 내 기능별 폼
   - 비공개 기능: 마켓 미노출, 세일즈 직접 안내

6. **정책 기반 페이지 재설계** — `index.html`, `app.js`, `catalog/apps/*.json`
   - 톤: "요청하면 해드립니다" → "가이드대로 직접 적용 + 막히면 무료 지원"
   - CTA: "설치 요청" → 1차 "적용 가이드 보기" + 2차 "지원 요청"
   - 히어로: "무료 · 오픈소스 · 베타" eyebrow, 포스터 노출 기준 카드 제거
   - How it works: 가이드 보기 → 직접 적용 → 막히면 지원
   - 카드: "베타" 뱃지 + "무료" 태그
   - 모달: 상단 뱃지 + 가이드/데모 링크(준비 중) + 지원 요청 + 피드백 버튼
   - JSON: accessMode → self-serve, guideUrl/demoUrl 필드 추가 (현재 null)

## 주요 결정 사항

| 결정 | 이유 |
|------|------|
| Supabase (Apps Script 대신) | 내부 대시보드 필요 + 마이그레이션 이중 작업 방지 |
| self-serve first 톤 | 오픈소스 정책과 일치, 고객 자율성 강조 |
| 무료 명시 | 고객 "돈 드는 건가?" 불안 해소 |
| 세일즈 도구로 포지셔닝 | 공홈 노출 없이 URL 직접 공유 방식 |
| 데모 페이지 (master.liveklass.com) | 고객이 실제 작동을 보고 판단할 수 있어야 |

## 다음 단계

### P0 (즉시)
- [ ] **피드백 폼 백엔드** — Supabase feedback 테이블 생성 + 모달 내 피드백 입력 UI + app.js 이벤트 핸들러 (현재 버튼만 있고 로직 없음)
- [ ] **Apps Script 역할 정리** — Supabase로 전환됨. Code.gs 미사용 마킹 또는 삭제

### P1 (이번 주)
- [ ] **guideUrl 설정** — 기능별 적용 가이드 문서 작성 (Notion 또는 GitHub)
- [ ] **demoUrl 설정** — master.liveklass.com에 데모 세팅
- [ ] **커스텀 도메인** — `extensions.liveklass.com` CNAME → Vercel
- [ ] **og-image.png** — OG 이미지 제작 (1200x630)

### P2 (여유 시)
- [ ] **GitHub Pages 비활성화** — deploy.yml 제거
- [ ] **course-transfer visibility** — private인데 listed:true 불일치 확인
- [ ] **앱 카탈로그 확장** — 신규 확장 기능 추가
- [ ] **marketplace-app-add 커맨드** — 신규 앱 등록 자동화

## 중요 파일 맵

| 파일 | 역할 |
|------|------|
| `docs/extensions-policy.md` | 정책 기준 문서 (SSOT) |
| `catalog/apps/*.json` | 앱 메타데이터 원본. 3개: reservation-alert, lms-block-clone, course-transfer |
| `scripts/build-marketplace.mjs` | JSON → catalog.json/js 빌드. 필드 검증 포함 |
| `site/app-marketplace/index.html` | 메인 페이지 |
| `site/app-marketplace/app.js` | 카드/모달 렌더링, Supabase 폼 제출, 딥링크 |
| `site/app-marketplace/styles.css` | Framer 토큰 기반 CSS. 반응형 포함 |
| `site/app-marketplace/config.js` | Supabase URL + anon key |
| `supabase/migrations/001_create_requests.sql` | requests 테이블 DDL |
| `vercel.json` | Vercel 빌드/출력 설정 |

## 인프라

| 서비스 | URL/ID |
|--------|--------|
| Vercel | `liveklass-extensions-marketplace.vercel.app` (main push 자동 배포) |
| Supabase | `pexuiwzimatyawmqqytr` / Seoul / Nano |
| GitHub | `Rich00lee/product-rich` (public, 레포명 변경됨) |
| GitHub (조직) | `AI-Native-Camp-Product-building/product-rich` (과제 제출용) |

---

# Handover — 2026-04-02 (세션 3)

## 작업 요약

카테고리 구조 전면 재설계 + 번들 앱 도입 + 적용 가이드 페이지 구축 + 과제 제출용 레포 생성.

### 완료된 작업

1. **카테고리 재설계** — Notion 플레이북 6개 대영역 → 4개 고객 니즈 기준
   - `design` (디자인 변경), `hide` (요소 숨김), `addon` (기능 추가), `automation` (운영 자동화)
   - 기존 앱 3개 마이그레이션: marketing→addon, design→addon, migration→automation

2. **번들 앱 2개 신규**
   - `design-customization`: 9개 기능 (색상·텍스트·여백·모바일 최적화)
   - `element-hide`: 4개 기능 (영역 숨김·텍스트 숨김)

3. **단일 앱 껍데기 7개 신규**
   - top-banner, notice-banner, video-background, video-player, floating-cta, scroll-animation, slide-animation

4. **UI 개선**
   - 카테고리 필터 탭 (pill 스타일)
   - 번들 카드 (기능 수 뱃지 + 키워드 요약)
   - 번들 모달 (details/summary 아코디언 + 코드 스니펫 + 복사 버튼)
   - "이런 상황이라면" 섹션 3개 → 4개 확장

5. **적용 가이드 페이지** — `site/app-marketplace/guide/how-to-apply.html`
   - 관리자 메타 영역 코드 삽입 6단계 가이드
   - 스크린샷 플레이스홀더 3개 (추후 실제 캡처로 교체)
   - 모달에서 "적용 방법 알아보기" 링크 연결

6. **운영 가이드 분석** (에이전트 병렬 분석)
   - 공식 가이드에 CSS/바디코드 전용 가이드 부재 확인
   - 관리자 실제 메뉴명: "검색 및 코드 설정 > 메타 영역" (≠ 바디코드)
   - 코드 입력 기능 기본 비활성화 상태 확인

7. **과제 제출**
   - README 과제 3줄 추가
   - 레포명 변경: liveklass-extensions-marketplace → product-rich
   - AI-Native-Camp-Product-building/product-rich 조직 레포 생성

## 주요 결정 사항

| 결정 | 이유 |
|------|------|
| 4카테고리 (고객 니즈 기준) | 구현 방식(Notion 대영역)이 아니라 고객이 "내가 뭘 원하는가"로 찾을 수 있게 |
| 번들 앱 (하이브리드) | CSS 단순 변경은 묶고, JS/HTML 복잡한 건 개별 앱으로 분리 |
| 적용 가이드 별도 페이지 | 모달 내 반복보다 공통 가이드 1곳 + 모달에서 링크. 세일즈 도구로 URL 별도 공유 가능 |

## 다음 단계

### P0 (즉시)
- [ ] **가이드 스크린샷 3장 교체** — master.liveklass.com/admin에서 캡처
- [ ] **가이드 페이지 진입 경로** — how-it-works 섹션에서 가이드 링크 추가
- [ ] **피드백 버튼 QA** — Supabase feedback 테이블 + 핸들러 확인
- [ ] **Apps Script 정리** — Code.gs 삭제 또는 아카이브

### P1 (이번 주)
- [ ] **guideUrl 설정** — 기존 3개 앱부터 적용 가이드 문서 연결
- [ ] **신규 앱 7개 상세** — 구현체 있는 것부터 status/snippet 채우기
- [ ] **커스텀 도메인** — `extensions.liveklass.com` CNAME → Vercel

### P2 (여유 시)
- [ ] **og-image.png** — 1200x630 OG 이미지 제작
- [ ] **demoUrl 설정** — master.liveklass.com 데모 환경
- [ ] **GitHub Pages 비활성화** — deploy.yml 제거

## 중요 파일 맵 (세션 3 변경분)

| 파일 | 역할 |
|------|------|
| `catalog/apps/design-customization.json` | 번들 앱 — 디자인 변경 9기능 |
| `catalog/apps/element-hide.json` | 번들 앱 — 요소 숨김 4기능 |
| `site/app-marketplace/guide/how-to-apply.html` | 적용 가이드 페이지 |
| `docs/superpowers/specs/2026-04-02-category-redesign.md` | 카테고리 재설계 디자인 스펙 |
