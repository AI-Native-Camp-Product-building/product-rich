# Extensions Marketplace 카테고리 재설계

> 2026-04-02 | 브레인스토밍 결과

## 배경

Notion "커스텀 기능 및 디자인 적용 플레이북"의 대영역 6개(모바일 최적화, 텍스트 변경, 색상 변경, 여백/사이즈 변경, 영역 숨김, 블록 요소 추가)를 고객 니즈 기준 4개 카테고리로 재편하여 marketplace에 반영한다.

## 카테고리 체계

| category ID | 표시명 | 아이콘 | 설명 |
|------------|--------|--------|------|
| `design` | 디자인 변경 | 🎨 | CSS 기반 — 색상, 텍스트, 여백, 모바일 최적화 |
| `hide` | 요소 숨김 | 👁️‍🗨️ | display:none 계열 — 영역/텍스트 숨김 |
| `addon` | 기능 추가 | ⚡ | JS/HTML 블록 — 배너, 플로팅, 애니메이션 |
| `automation` | 운영 자동화 | 🔄 | 비UI — 수강 이전, 쿠폰 등 |

## 앱 유형

### 번들 앱 (bundle)

JSON에 `"appType": "bundle"` + `"features": [...]` 배열. 모달에서 아코디언으로 세부 기능 + 코드 스니펫 노출.

### 단일 앱 (single)

기존과 동일. `"appType": "single"` (생략 가능, 빌드에서 기본값).

## 앱 목록

### 번들 앱 2개

**디자인 변경** (`design-customization`):
1. mobile-separate-edit — 모바일/PC 페이지 각각 편집 (모바일 최적화)
2. mobile-responsive-image — 모바일에서 반응형 이미지 사이즈 (모바일 최적화)
3. text-value-change — 버튼, 메뉴, 용어 등 특정 텍스트 값 변경 (텍스트 변경)
4. error-message-change — 특정 오류/안내 메시지 텍스트 값 변경 (텍스트 변경)
5. font-style-change — 글꼴 크기/색상 변경 (텍스트 변경)
6. button-color — 클래스 신청, 회원가입 등 버튼 색상 변경 (색상 변경)
7. area-color — 페이지 배경/헤더 등 영역 색상 변경 (색상 변경)
8. cta-button-color — CTA 버튼 색상 변경 (색상 변경)
9. block-spacing — 페이지 디자인내 블록간 여백 변경 (여백/사이즈 변경)

**요소 숨김** (`element-hide`):
1. section-hide — 추천 클래스, 리뷰, 강사소개 등 특정 영역 숨김 (영역 숨김)
2. text-value-hide — 가격, 모집 인원 등 특정 텍스트 값 숨김 (텍스트 변경)
3. video-time-hide — 클래스 상세 페이지 내 동영상 시간만 숨김 (영역 숨김)
4. video-count-time-hide — 클래스 상세 페이지 내 동영상 개수/총시간 표기 숨김 (영역 숨김)

### 단일 앱 10개

| category | app id | 앱명 | 상태 |
|----------|--------|------|------|
| addon | top-banner | 상단 띠배너 | 신규 |
| addon | notice-banner | 공지 배너 | 신규 |
| addon | video-background | 동영상 배경 블록 | 신규 |
| addon | video-player | 동영상 재생 블록 | 신규 |
| addon | floating-cta | 페이지 플로팅 CTA | 신규 |
| addon | scroll-animation | 스크롤 애니메이션 효과 | 신규 |
| addon | slide-animation | 슬라이드 애니메이션 블록 | 신규 |
| addon | reservation-alert | 강의 예약 알림 | 기존 (marketing → addon) |
| addon | lms-block-clone | LMS 블록 클론 | 기존 (design → addon) |
| automation | course-transfer | 수강 이전 | 기존 유지 |

## UI 변경

### 카테고리 필터 탭
앱 섹션 상단. [전체] [디자인 변경] [요소 숨김] [기능 추가] [운영 자동화]

### 번들 카드
- 우상단 "N개 기능" 뱃지
- 포함 기능 키워드 나열
- "세부 기능 보기 →"

### 번들 모달
- 아코디언: 첫 번째 항목 기본 열림
- 코드 스니펫 + 복사 버튼
- 플레이스홀더(#YOUR_COLOR 등) 고객이 교체

### "이런 상황이라면" 섹션
3개 → 4개: 디자인 커스텀 + 요소 숨김 추가

### 기존 앱 마이그레이션
- reservation-alert: marketing → addon
- lms-block-clone: design → addon
- course-transfer: migration → automation

## 범위 밖
- 신규 단일 앱 7개 상세 구현 (껍데기만)
- guideUrl / demoUrl
- 커스텀 도메인
- og-image
