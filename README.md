# Tax-Agent 양도세 전문 챗봇

양도세 관련 질문에 대해 전문적인 답변을 제공하는 AI 챗봇입니다.

## 🚀 주요 기능

- **다국어 지원**: 한국어, 영어, 러시아어, 일본어
- **AI API 연동**: OpenAI GPT (기본 활성화), Google Gemini, Anthropic Claude 지원
- **양도세 전문 지식**: 양도세율, 계산, 신고, 비과세요건 등
- **반응형 디자인**: 모바일, 태블릿, PC 최적화
- **브라우저 호환성**: Chrome, Edge, Firefox, Safari, 카카오톡 브라우저 지원
- **즉시 사용 가능**: 별도 설정 없이 OpenAI GPT-4o 바로 사용

## 📋 API 연결 설정 방법

### 🎯 기본 사용 (설정 불필요)
- **OpenAI GPT-4o가 기본적으로 활성화**되어 있어 별도 설정 없이 바로 사용 가능
- 챗봇 페이지에 접속하면 즉시 AI 응답을 받을 수 있습니다

### 🔧 고급 설정 (선택사항)
다른 AI 서비스나 개인 API 키를 사용하려면 관리자 페이지에서 설정하세요.

#### 1. 관리자 페이지 접속
챗봇 우측 상단의 ⚙️ 설정 버튼을 클릭하여 관리자 페이지로 이동합니다.

### 2. API 키 설정

#### OpenAI API 설정
1. [OpenAI API 키 발급](https://platform.openai.com/api-keys)에서 API 키를 생성
2. 관리자 페이지에서 "OpenAI API 설정" 섹션의 활성화 토글을 ON
3. API 키 입력 (sk-로 시작)
4. 모델 선택 (GPT-4o 권장)
5. "OpenAI 설정 저장" 버튼 클릭

#### Google Gemini API 설정
1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키를 생성
2. 관리자 페이지에서 "Google Gemini API 설정" 섹션의 활성화 토글을 ON
3. API 키 입력 (AIza로 시작)
4. 모델 선택 (Gemini Flash 2.5 권장)
5. "Google 설정 저장" 버튼 클릭

#### Anthropic Claude API 설정
1. [Anthropic Console](https://console.anthropic.com/)에서 API 키를 생성
2. 관리자 페이지에서 "Anthropic Claude API 설정" 섹션의 활성화 토글을 ON
3. API 키 입력 (sk-ant-로 시작)
4. 모델 선택 (Claude 3.5 Sonnet 권장)
5. "Anthropic 설정 저장" 버튼 클릭

### 3. 연결 테스트
각 API 설정 후 "연결 테스트" 버튼을 클릭하여 정상 작동을 확인합니다.

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Netlify Functions
- **AI APIs**: OpenAI GPT, Google Gemini, Anthropic Claude
- **Deployment**: Netlify

## 📁 프로젝트 구조

```
phoenixai-tax-agent-landing/
├── index.html              # 메인 챗봇 페이지
├── admin.html              # 관리자 설정 페이지
├── package.json            # 프로젝트 의존성
├── netlify.toml           # Netlify 설정
├── netlify/
│   └── functions/
│       ├── chatbot-config.js  # 설정 관리 함수
│       ├── ask-ai.js          # OpenAI API 함수
│       ├── ask-gemini.js      # Google Gemini API 함수
│       └── ask-claude.js      # Anthropic Claude API 함수
└── README.md              # 프로젝트 문서
```

## 🚀 배포 방법

### Netlify 배포
1. GitHub에 프로젝트를 푸시
2. Netlify에서 새 사이트 생성
3. GitHub 저장소 연결
4. 빌드 설정:
   - Build command: `echo "No build required"`
   - Publish directory: `.`
5. 환경변수 설정 (선택사항):
   - `OPENAI_API_KEY`
   - `GOOGLE_API_KEY`
   - `ANTHROPIC_API_KEY`

### 로컬 개발
```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

## 🔧 환경변수 설정

### 기본 사용
- 환경변수 설정 없이도 기본 OpenAI API로 작동합니다
- 기본 API 키가 내장되어 있어 즉시 사용 가능합니다

### 고급 사용 (선택사항)
API 키를 사용하려면 Netlify 대시보드에서 다음 환경변수를 설정할 수 있습니다:

```bash
# 기본 API 키 (1차 우선순위)
DEFAULT_OPENAI_API_KEY=sk-proj-your-default-openai-api-key

# 개인 API 키 (2차 우선순위)
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_API_KEY=AIza-your-google-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
```

### ⚠️ 중요: API 키 설정 필요
현재 기본 API 키가 설정되지 않아 일부 질문에서 오류가 발생할 수 있습니다. 
다음 방법으로 해결하세요:

1. **Netlify 환경변수 설정** (권장):
   - Netlify 대시보드 → Site settings → Environment variables
   - `DEFAULT_OPENAI_API_KEY`에 유효한 OpenAI API 키 설정
   - 이 키가 1차 우선순위로 사용됩니다

2. **개발자용 테스트 키 사용**:
   - OpenAI에서 무료 크레딧으로 테스트 가능

## 🌐 브라우저 호환성

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ 카카오톡 브라우저
- ✅ 모바일 브라우저

## 📱 모바일 최적화

- 터치 친화적 인터페이스
- 반응형 디자인
- 키보드 최적화
- 안드로이드 카카오톡 브라우저 특별 지원

## 🔒 보안

- API 키는 로컬 스토리지에 안전하게 저장
- CORS 설정으로 보안 강화
- HTTPS 필수

## 🐛 문제 해결

### API 연결 오류
1. **API 키 설정 확인**:
   - 관리자 페이지에서 API 키가 설정되어 있는지 확인
   - Netlify 환경변수에 `DEFAULT_OPENAI_API_KEY` 설정
   
2. **오류 유형별 해결방법**:
   - `API key not configured`: API 키 설정 필요
   - `rate limit exceeded`: 잠시 후 다시 시도
   - `network error`: 인터넷 연결 확인
   
3. **관리자 페이지에서 연결 테스트 실행**
4. **브라우저 콘솔에서 오류 메시지 확인**
5. **다른 브라우저로 시도**

### 일부 질문에서만 오류 발생
- **원인**: API 키 미설정, 토큰 한도 초과, 네트워크 문제
- **해결**: API 키 설정, 대화 이력 초기화, 네트워크 재연결

### 브라우저별 문제
- **Chrome**: 캐시 문제일 수 있으니 시크릿 모드로 테스트
- **Edge**: 정상 작동, 권장 브라우저
- **Firefox**: CORS 설정 확인
- **Safari**: 보안 설정 확인

## 📞 지원

문제가 발생하면 다음을 확인해주세요:
1. 브라우저 콘솔 오류 메시지
2. API 키 설정 상태
3. 네트워크 연결 상태

## 📄 라이선스

MIT License

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해주세요.
