# AI 챗봇 웹 애플리케이션

React + TypeScript + Vite + Firebase Cloud Functions로 구축된 AI 챗봇 웹 애플리케이션입니다.
OpenAI GPT API를 활용하여 사용자와의 대화형 인터페이스를 제공합니다.

🌐 **Live Demo**: [https://chatbot-seven-snowy.vercel.app/](https://chatbot-seven-snowy.vercel.app/)

## 🚀 주요 기능

### 🤖 AI 챗봇

- **OpenAI GPT-3.5-turbo**: 자연어 대화 및 질의응답
- **개인화된 AI 설정**: 사용자별 닉네임과 특성 설정으로 맞춤형 응답
- **실시간 대화**: 즉시 응답하는 인터랙티브 채팅
- **마크다운 렌더링**: 코드 블록, 링크 등 풍부한 텍스트 표시

### 🔐 인증 시스템

- **Firebase Authentication**: 이메일/비밀번호 로그인
- **카카오 소셜 로그인**: OAuth 2.0 기반 안전한 인증
- **네이버 소셜 로그인**: 추가 소셜 로그인 옵션
- **자동 회원가입**: SNS 로그인 시 자동 계정 생성

### 💬 채팅 관리

- **채팅 히스토리**: Firestore 기반 대화 기록 저장
- **채팅 목록**: 사이드바에서 모든 채팅 관리
- **채팅 삭제**: 개별 채팅 및 메시지 완전 삭제
- **채팅 검색**: 제목 기반 채팅 검색 기능
- **실시간 동기화**: 여러 탭에서 실시간 데이터 동기화

### ⚙️ 사용자 설정

- **AI 개인화 설정**: 닉네임과 특성 설정으로 맞춤형 AI 응답
- **프로필 관리**: 이메일, 이름, 비밀번호 변경
- **테마 설정**: 다크/라이트 모드 전환
- **다국어 지원**: 한국어/영어 언어 전환

### 🎨 UI/UX

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **사이드바 리사이징**: 사용자 정의 사이드바 너비
- **로딩 상태**: 직관적인 로딩 인디케이터
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 🛠️ 기술 스택

### Frontend

- **React 18** - 사용자 인터페이스 구축
- **TypeScript** - 타입 안전성 보장
- **Vite** - 빠른 개발 환경 및 빌드 도구
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **React Router v6** - 클라이언트 사이드 라우팅
- **Zustand** - 경량 상태 관리
- **React Hook Form** - 폼 상태 관리
- **React Icons** - 아이콘 라이브러리

### Backend & Services

- **Firebase Authentication** - 사용자 인증
- **Firestore** - 실시간 NoSQL 데이터베이스
- **Firebase Cloud Functions** - 서버리스 백엔드 API
- **OpenAI API** - GPT-3.5-turbo AI 챗봇
- **Kakao API** - 카카오 소셜 로그인
- **Naver API** - 네이버 소셜 로그인

### 개발 도구

- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **TypeScript** - 정적 타입 검사

## 📦 설치 및 실행

### 요구사항

- **Node.js**: 18.x 이상
- **npm** 또는 **yarn**

## 🏗️ 프로젝트 구조

```
chatbot/
├── src/                    # 프론트엔드 소스 코드
│   ├── api/               # API 관련 훅 및 함수
│   │   ├── auth.ts        # 인증 관련 API
│   │   ├── common/        # 공통 HTTP 설정
│   │   ├── useChat.tsx    # 채팅 API 훅
│   │   └── useKakao.tsx   # 카카오 로그인 훅
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── common/        # 공통 컴포넌트
│   │   ├── layout/        # 레이아웃 컴포넌트
│   │   └── settings/      # 설정 관련 컴포넌트
│   ├── config/           # 설정 파일
│   ├── firebase/         # Firebase 설정
│   ├── guards/           # 인증 가드 컴포넌트
│   ├── hooks/            # 커스텀 훅
│   ├── pages/            # 페이지 컴포넌트
│   ├── router/           # 라우팅 설정
│   ├── store/            # Zustand 스토어
│   ├── types/            # TypeScript 타입 정의
│   └── utils/            # 유틸리티 함수
├── functions/             # Firebase Cloud Functions
│   ├── src/              # TypeScript 소스 코드
│   │   └── index.ts      # Cloud Functions 엔트리 포인트
│   ├── lib/              # 컴파일된 JavaScript
│   └── package.json      # Functions 의존성
├── firebase.json         # Firebase 프로젝트 설정
├── vercel.json          # Vercel 배포 설정
└── package.json          # 프론트엔드 의존성
```

## 🔧 주요 컴포넌트

### 인증 시스템

- `AuthGuard`: 인증 상태에 따른 라우트 보호
- `SignIn/SignUp`: 로그인/회원가입 페이지
- `KakaoCallback/NaverCallback`: 소셜 로그인 콜백 처리

### 채팅 시스템

- `Chat`: 메인 채팅 인터페이스
- `SideBar`: 채팅 목록 및 관리
- `LoadingSpinner`: 로딩 상태 표시
- `ReactMarkdownRenderer`: 마크다운 렌더링

### 설정 시스템

- `GeneralSettings`: 일반 설정 (언어, 테마)
- `DetailSettings`: AI 개인화 설정
- `PrivacySettings`: 개인정보 관리

### Cloud Functions

- `handleKakaoLogin`: 카카오 로그인 처리
- `handleNaverLogin`: 네이버 로그인 처리
- `chatWithOpenAI`: OpenAI API 연동

## 🔐 인증 플로우

### 일반 로그인

1. 이메일/비밀번호로 Firebase Authentication 사용
2. 로그인 성공 시 홈 페이지로 리다이렉트

### 소셜 로그인 (카카오/네이버)

1. 소셜 로그인 버튼 클릭
2. OAuth 2.0 인증 플로우 실행
3. Cloud Functions에서 액세스 토큰 처리
4. 사용자 프로필 정보 조회
5. Firestore에 사용자 정보 저장
6. Firebase Custom Token 발급
7. 자동 로그인 처리

## 💬 채팅 기능

### 메시지 전송

- **실시간 입력**: 사용자 입력을 즉시 UI에 반영
- **AI 응답 생성**: OpenAI GPT-3.5-turbo를 통한 자연어 응답
- **개인화된 응답**: 사용자 설정에 따른 맞춤형 AI 응답

### 채팅 관리

- **자동 저장**: 모든 대화를 Firestore에 자동 저장
- **채팅 목록**: 사이드바에서 모든 채팅 확인
- **채팅 검색**: 제목 기반 실시간 검색
- **채팅 삭제**: 개별 채팅 및 모든 메시지 완전 삭제

### 데이터 구조

```
chats/
├── {chatId}/
│   ├── title: "채팅 제목"
│   ├── uid: "사용자 ID"
│   ├── createdAt: "생성 시간"
│   └── message/ (서브컬렉션)
│       ├── {messageId}/
│       │   ├── role: "user|assistant"
│       │   ├── content: "메시지 내용"
│       │   └── timestamp: "전송 시간"
```

## ⚙️ 사용자 설정

### AI 개인화 설정

- **닉네임 설정**: AI가 사용자를 부를 이름
- **특성 설정**: AI가 참고할 사용자 특성
- **실시간 적용**: 설정 변경 시 즉시 AI 응답에 반영

### 프로필 관리

- **이메일 변경**: 계정 이메일 주소 변경
- **이름 변경**: 표시 이름 변경
- **비밀번호 변경**: SNS 로그인이 아닌 경우에만 가능

### 테마 및 언어

- **다크/라이트 모드**: 사용자 선호도에 따른 테마 전환
- **다국어 지원**: 한국어/영어 언어 전환
- **설정 저장**: 로컬 스토리지에 사용자 설정 저장

## 🎨 UI/UX 특징

### 반응형 디자인

- **모바일 최적화**: 터치 친화적 인터페이스
- **태블릿 지원**: 중간 크기 화면 최적화
- **데스크톱 경험**: 큰 화면에서의 효율적인 레이아웃

### 사용자 경험

- **직관적인 네비게이션**: 명확한 메뉴 구조
- **로딩 피드백**: 모든 작업에 대한 적절한 로딩 표시
- **에러 처리**: 사용자 친화적인 에러 메시지
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 🚀 배포

### Vercel 배포

- **자동 배포**: GitHub 연동으로 자동 배포
- **환경 변수**: Vercel 대시보드에서 환경 변수 설정
- **도메인**: [https://chatbot-seven-snowy.vercel.app/](https://chatbot-seven-snowy.vercel.app/)

### Firebase Functions 배포

```bash
cd functions
npm run deploy
```

---

**개발자**: taewon
**버전**: 1.0.0  
**최종 업데이트**: 2025년 8월
