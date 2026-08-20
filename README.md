# LetSWin!

SWin은 **Swim과 Skin을 한 번에** 관리할 수 있는 수영인 맞춤형 웰니스 플랫폼입니다.  
SWin과 함께 피부 건강을 관리하고, 꾸준히 수영 기록을 쌓아보세요.  

*본 프로젝트는 [멋쟁이사자처럼 대학 14기 중앙해커톤] 덕성여대 팀 '덕세'의 AAC 트랙 출품 프로젝트입니다.* </br></br>

### Let’s win with SWin!

<p align="center">
  <img src="./src/assets/images/logo.svg" width="80" alt="SWin 로고" />
</p>


## 주요 기능

| 영역 | 기능 |
|---|---|
| 로그인 및 온보딩 | JWT 기반 로그인, 수영 패턴 및 피부 유형 등록 |
| 홈 | 주간 일정, 월간 캘린더, 최근 수영 기록 및 알림 확인 |
| 일정 관리 | 수영·클리닉 일정 조회, 등록 및 수정 |
| 수영 기록 | 수영 전·후 사진, 피부 증상, 수영 시간, 메모 기록 |
| 추가 기록 | 수영 후 피부 상태의 추가 사진·증상·메모 등록 |
| AI 피부 분석 | 수영 전후 피부 변화를 분석하고 주요 변화, 최근 경향 및 권장 사항 제공 |
| SWin 리포트 | 주간 수영·피부 변화 리포트와 맞춤 케어 추천 |
| 루틴 추천 | 사용자 기록을 반영한 수영 플랜과 피부 관리 루틴 제공 |
| 수영장 찾기 | 시/도 → 시/군/구 → 읍/면/동 단계별 수영장 검색 |
| 클리닉 예약 | 예약 가능 시간 조회, 방문 예약 및 예약 내역 확인 |
| 알림 | 알림 목록 및 상세 내용 확인, 읽음 처리 |
| 마이페이지 | 프로필, 알림 설정, 약관 동의 및 로그아웃 관리 |

## 기술 스택

| 구분 | 기술 |
|---|---|
| Language | JavaScript |
| UI | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM 7 |
| API 통신 | Fetch API |
| Styling | CSS, Pretendard |
| Authentication | JWT, Local Storage |
| Deployment | Vercel |
| Backend | Django REST Framework API |

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/LIKELION-DuksesSwinning/SWin-FE.git
cd SWin-FE
```

### 2. 패키지 설치

```bash
npm ci
```

Vite 8을 사용하므로 Node.js `20.19 이상` 또는 `22.12 이상` 환경을 권장합니다.

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
VITE_API_BASE_URL=https://miseno.store
```

로컬 백엔드 서버를 사용하는 경우 다음과 같이 변경합니다.

```env
VITE_API_BASE_URL=http://localhost:8000
```

OpenAI API 키는 백엔드에서 관리하므로 프론트엔드 `.env`에는 추가하지 않습니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

기본적으로 `http://localhost:5173`에서 실행됩니다.

### 5. 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 프로젝트 구조

```text
SWin-FE/
├── public/                 # 정적 파일
├── src/
│   ├── api/                # 백엔드 API 요청 모듈
│   ├── assets/             # 이미지 및 SVG
│   ├── components/         # 공통 컴포넌트
│   │   ├── BottomNav/
│   │   └── WeeklyCalendar/
│   ├── pages/
│   │   ├── Alert/          # 알림
│   │   ├── Analysis/       # AI 분석 및 리포트
│   │   ├── Archive/        # 수영 전후 기록
│   │   ├── Calendar/       # 일정 관리
│   │   ├── Clinic/         # 클리닉 예약
│   │   ├── Login/          # 로그인
│   │   ├── Main/           # 홈
│   │   ├── My/             # 마이페이지
│   │   ├── Pool/           # 수영장 찾기
│   │   ├── Starting/       # 시작 화면
│   │   └── UserRecord/     # 온보딩
│   ├── styles/             # 전역 스타일
│   ├── utils/              # 공통 유틸리티
│   ├── App.jsx             # 라우팅 설정
│   └── main.jsx            # 애플리케이션 진입점
├── package.json
└── vite.config.js
```

## 관련 저장소

- [SWin Backend](https://github.com/LIKELION-DuksesSwinning/SWin-BE)

## 팀원

| 역할 | 이름 | GitHub |
|---|---|---|
| Frontend | 박다인 | [@daniswings](https://github.com/daniswings) |
| Frontend | 정지원 | [@stopwonee](https://github.com/stopwonee) |
