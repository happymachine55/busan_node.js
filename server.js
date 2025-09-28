const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 데이터베이스 연결 테스트
testConnection();

// 라우트 설정
app.use('/api/auth', authRoutes);

// 정적 파일 서빙 (HTML, CSS, JS)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// API 상태 확인 엔드포인트
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: '서버가 정상적으로 실행 중입니다.',
        timestamp: new Date().toISOString()
    });
});

// 404 에러 핸들링
app.use('*', (req, res) => {
    res.status(404).json({
        error: '요청한 리소스를 찾을 수 없습니다.',
        path: req.originalUrl
    });
});

// 전역 에러 핸들링
app.use((error, req, res, next) => {
    console.error('서버 오류:', error);
    res.status(500).json({
        error: '서버 내부 오류가 발생했습니다.',
        message: process.env.NODE_ENV === 'development' ? error.message : '서버 오류'
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`http://localhost:${PORT} 에서 접속 가능합니다.`);
    console.log(`회원가입 페이지: http://localhost:${PORT}/register`);
});

module.exports = app;

