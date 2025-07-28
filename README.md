# AI 챗봇 웹 애플리케이션

OpenAI GPT API를 활용하여 사용자와의 대화형 인터페이스를 제공합니다.

## 🚀 주요 기능

- **AI 챗봇**: OpenAI GPT-3.5-turbo 모델을 활용한 자연어 대화
- **사용자 인증**: Firebase Authentication을 통한 로그인/회원가입
- **카카오 로그인**: 카카오 소셜 로그인 지원
- **채팅 히스토리**: Firestore를 통한 대화 기록 저장 및 관리
- **실시간 채팅**: 실시간 메시지 전송 및 응답
- **반응형 디자인**: 모바일과 데스크톱 환경 모두 지원
- **다크/라이트 모드**: 테마 전환 기능

## 🛠️ 기술 스택

### Frontend

- **React 18** - 사용자 인터페이스 구축
- **TypeScript** - 타입 안전성 보장
- **Vite** - 빠른 개발 환경 및 빌드 도구
- **Tailwind CSS** - 스타일링
- **React Router** - 클라이언트 사이드 라우팅
- **React Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리

### Backend & Services

- **Firebase Authentication** - 사용자 인증
- **Firestore** - 실시간 데이터베이스
- **OpenAI API** - AI 챗봇 기능
- **Kakao API** - 소셜 로그인

### 개발 도구

- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **React Icons** - 아이콘 라이브러리

## 📦 설치 및 실행

### 1. 저장소 클론

```bash
git clone [repository-url]
cd chatbot
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 🏗️ 프로젝트 구조

```
src/
├── api/                 # API 관련 훅 및 함수
├── components/          # 재사용 가능한 컴포넌트
├── config/             # 설정 파일
├── firebase/           # Firebase 설정
├── guards/             # 인증 가드 컴포넌트
├── hooks/              # 커스텀 훅
├── pages/              # 페이지 컴포넌트
├── router/             # 라우팅 설정
├── store/              # Zustand 스토어
├── types/              # TypeScript 타입 정의
└── utils/              # 유틸리티 함수
```

## 🔧 주요 컴포넌트

### 인증 시스템

- `AuthGuard`: 인증 상태에 따른 라우트 보호
- `SignIn/SignUp`: 로그인/회원가입 페이지
- `KakaoCallback`: 카카오 로그인 콜백 처리

### 채팅 시스템

- `Chat`: 메인 채팅 인터페이스
- `LoadingSpinner`: 로딩 상태 표시
- `ReactMarkdownRenderer`: 마크다운 렌더링

### 레이아웃

- `Layout`: 전체 레이아웃 구조
- `SideBar`: 사이드바 네비게이션
- `GlobalHeader`: 전역 헤더

## 🔐 인증 플로우

1. **일반 회원가입/로그인**: Firebase Authentication 사용
2. **카카오 로그인**: OAuth 2.0 플로우를 통한 소셜 로그인
3. **인증 상태 관리**: Zustand 스토어를 통한 전역 상태 관리

## 💬 채팅 기능

- **실시간 메시지 전송**: 사용자 입력을 즉시 UI에 반영
- **AI 응답 생성**: OpenAI API를 통한 자연어 응답
- **채팅 히스토리**: Firestore에 대화 기록 저장
- **자동 스크롤**: 새 메시지에 따른 자동 스크롤링

## 🎨 UI/UX 특징

- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **다크/라이트 모드**: 사용자 선호도에 따른 테마 전환
- **로딩 상태**: 사용자 피드백을 위한 로딩 인디케이터
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 🚀 배포

**개발 중인 프로젝트입니다.** 일부 기능이 아직 구현 중이거나 변경될 수 있습니다.
