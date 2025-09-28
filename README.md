# Node.js + MySQL 회원가입 서비스

Node.js와 MySQL을 사용하여 구축된 회원가입 서비스입니다.

## 🚀 주요 기능

- ✅ 안전한 회원가입 (비밀번호 암호화)
- ✅ 이메일/사용자명 중복 확인
- ✅ 입력 데이터 유효성 검사
- ✅ 로그인 기능
- ✅ 사용자 정보 조회
- ✅ 반응형 웹 인터페이스

## 📋 사전 요구사항

- Node.js (v14 이상)
- MySQL (v5.7 이상)
- npm 또는 yarn

## 🛠️ 설치 및 설정

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 의존성 설치
npm install
```

### 2. 환경 변수 설정

`config.env.example` 파일을 복사하여 `.env` 파일을 생성하고 데이터베이스 정보를 입력하세요:

```bash
# Windows
copy config.env.example .env

# macOS/Linux
cp config.env.example .env
```

`.env` 파일 내용:

```env
# MySQL 데이터베이스 설정
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=user_registration

# 서버 설정
PORT=3000
NODE_ENV=development

# JWT 시크릿 (선택사항)
JWT_SECRET=your_jwt_secret_key
```

### 3. MySQL 데이터베이스 설정

MySQL에 접속하여 데이터베이스를 생성하세요:

```sql
CREATE DATABASE user_registration;
```

### 4. 데이터베이스 초기화

```bash
# 데이터베이스 스키마 생성 및 테스트 데이터 삽입
node database/init.js
```

## 🚀 실행

### 개발 모드 (nodemon 사용)

```bash
npm run dev
```

### 프로덕션 모드

```bash
npm start
```

서버가 실행되면 다음 URL에서 접속할 수 있습니다:

- 메인 페이지: http://localhost:3000
- 회원가입 페이지: http://localhost:3000/register

## 📡 API 엔드포인트

### 회원가입

```
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Password123",
  "fullName": "홍길동",
  "phone": "010-1234-5678"
}
```

### 로그인

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Password123"
}
```

### 사용자 정보 조회

```
GET /api/auth/profile/:id
```

### 서버 상태 확인

```
GET /api/health
```

## 🗄️ 데이터베이스 스키마

### users 테이블

- `id`: 사용자 ID (자동 증가)
- `username`: 사용자명 (고유)
- `email`: 이메일 (고유)
- `password`: 암호화된 비밀번호
- `full_name`: 실명
- `phone`: 전화번호
- `created_at`: 생성일시
- `updated_at`: 수정일시
- `is_active`: 활성화 상태

### user_profiles 테이블 (선택사항)

- `id`: 프로필 ID (자동 증가)
- `user_id`: 사용자 ID (외래키)
- `bio`: 자기소개
- `avatar_url`: 프로필 이미지 URL
- `birth_date`: 생년월일
- `gender`: 성별
- `address`: 주소

## 🔒 보안 기능

- **비밀번호 암호화**: bcryptjs를 사용한 해싱 (salt rounds: 12)
- **입력 데이터 검증**: express-validator를 사용한 서버 사이드 검증
- **SQL 인젝션 방지**: Prepared statements 사용
- **CORS 설정**: Cross-Origin Resource Sharing 설정

## 🧪 테스트

### 테스트 데이터

데이터베이스 초기화 시 다음 테스트 계정이 생성됩니다:

- 사용자명: `testuser1`, 이메일: `test1@example.com`, 비밀번호: `password123`
- 사용자명: `testuser2`, 이메일: `test2@example.com`, 비밀번호: `password123`

### API 테스트

Postman이나 curl을 사용하여 API를 테스트할 수 있습니다:

```bash
# 회원가입 테스트
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "Password123",
    "fullName": "새사용자",
    "phone": "010-9999-8888"
  }'

# 로그인 테스트
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser1",
    "password": "password123"
  }'
```

## 📁 프로젝트 구조

```
├── config/
│   └── database.js          # 데이터베이스 연결 설정
├── database/
│   ├── init.js             # 데이터베이스 초기화 스크립트
│   └── schema.sql          # 데이터베이스 스키마
├── public/
│   ├── index.html          # 메인 페이지
│   ├── register.html       # 회원가입 페이지
│   ├── styles.css          # CSS 스타일
│   └── register.js         # 회원가입 JavaScript
├── routes/
│   └── auth.js             # 인증 관련 라우트
├── server.js               # 메인 서버 파일
├── package.json            # 프로젝트 설정
├── config.env.example      # 환경 변수 예시
└── README.md               # 프로젝트 문서
```

## 🐛 문제 해결

### 데이터베이스 연결 오류

1. MySQL 서비스가 실행 중인지 확인
2. `.env` 파일의 데이터베이스 정보가 올바른지 확인
3. 데이터베이스가 생성되었는지 확인

### 포트 충돌 오류

`.env` 파일에서 `PORT` 값을 다른 포트로 변경하세요.

### 의존성 설치 오류

```bash
# npm 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
```

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해주세요.

