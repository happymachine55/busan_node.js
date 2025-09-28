const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');

const router = express.Router();

// 회원가입 유효성 검사 규칙
const registerValidation = [
    body('username')
        .isLength({ min: 3, max: 50 })
        .withMessage('사용자명은 3-50자 사이여야 합니다.')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.'),
    
    body('email')
        .isEmail()
        .withMessage('올바른 이메일 형식이 아닙니다.')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다.'),
    
    body('fullName')
        .isLength({ min: 2, max: 100 })
        .withMessage('이름은 2-100자 사이여야 합니다.')
        .trim(),
    
    body('phone')
        .optional()
        .isMobilePhone('ko-KR')
        .withMessage('올바른 전화번호 형식이 아닙니다.')
];

// 회원가입 API
router.post('/register', registerValidation, async (req, res) => {
    try {
        // 유효성 검사 결과 확인
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: '입력 데이터가 올바르지 않습니다.',
                errors: errors.array()
            });
        }

        const { username, email, password, fullName, phone } = req.body;

        // 중복 사용자명 확인
        const existingUser = await executeQuery(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: '이미 사용 중인 사용자명 또는 이메일입니다.'
            });
        }

        // 비밀번호 해싱
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 사용자 데이터 삽입
        const result = await executeQuery(
            'INSERT INTO users (username, email, password, full_name, phone) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, fullName, phone || null]
        );

        // 성공 응답 (비밀번호 제외)
        res.status(201).json({
            success: true,
            message: '회원가입이 성공적으로 완료되었습니다.',
            user: {
                id: result.insertId,
                username,
                email,
                fullName,
                phone: phone || null
            }
        });

    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({
            success: false,
            message: '회원가입 중 오류가 발생했습니다.'
        });
    }
});

// 로그인 API (추가 기능)
router.post('/login', [
    body('username').notEmpty().withMessage('사용자명을 입력해주세요.'),
    body('password').notEmpty().withMessage('비밀번호를 입력해주세요.')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: '입력 데이터가 올바르지 않습니다.',
                errors: errors.array()
            });
        }

        const { username, password } = req.body;

        // 사용자 정보 조회
        const users = await executeQuery(
            'SELECT id, username, email, password, full_name, phone, is_active FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: '사용자명 또는 비밀번호가 올바르지 않습니다.'
            });
        }

        const user = users[0];

        // 계정 활성화 상태 확인
        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: '비활성화된 계정입니다.'
            });
        }

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: '사용자명 또는 비밀번호가 올바르지 않습니다.'
            });
        }

        // 로그인 성공 (비밀번호 제외)
        res.json({
            success: true,
            message: '로그인이 성공했습니다.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({
            success: false,
            message: '로그인 중 오류가 발생했습니다.'
        });
    }
});

// 사용자 정보 조회 API
router.get('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const users = await executeQuery(
            'SELECT id, username, email, full_name, phone, created_at FROM users WHERE id = ? AND is_active = true',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('사용자 정보 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '사용자 정보 조회 중 오류가 발생했습니다.'
        });
    }
});

module.exports = router;

