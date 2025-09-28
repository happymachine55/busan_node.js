const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 데이터베이스 연결 설정
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1111',
    database: process.env.DB_NAME || 'user_registration',
    multipleStatements: true
};

async function initializeDatabase() {
    let connection;
    
    try {
        console.log('데이터베이스 초기화를 시작합니다...');
        
        // 데이터베이스 연결
        connection = await mysql.createConnection(dbConfig);
        console.log('MySQL 데이터베이스에 연결되었습니다.');
        
        // 스키마 파일 읽기
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // 스키마 실행
        await connection.query(schema);
        console.log('데이터베이스 스키마가 성공적으로 생성되었습니다.');
        
        // 테스트 데이터 삽입 (선택사항)
        await insertTestData(connection);
        
        console.log('데이터베이스 초기화가 완료되었습니다.');
        
    } catch (error) {
        console.error('데이터베이스 초기화 중 오류 발생:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function insertTestData(connection) {
    try {
        // 테스트 사용자 데이터 (비밀번호는 'password123'의 해시값)
        const testUsers = [
            {
                username: 'testuser1',
                email: 'test1@example.com',
                password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
                full_name: '테스트 사용자1',
                phone: '010-1234-5678'
            },
            {
                username: 'testuser2',
                email: 'test2@example.com',
                password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
                full_name: '테스트 사용자2',
                phone: '010-9876-5432'
            }
        ];
        
        for (const user of testUsers) {
            await connection.execute(
                'INSERT IGNORE INTO users (username, email, password, full_name, phone) VALUES (?, ?, ?, ?, ?)',
                [user.username, user.email, user.password, user.full_name, user.phone]
            );
        }
        
        console.log('테스트 데이터가 삽입되었습니다.');
    } catch (error) {
        console.log('테스트 데이터 삽입 중 오류 (무시 가능):', error.message);
    }
}

// 스크립트가 직접 실행될 때만 초기화 실행
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('초기화 완료');
            process.exit(0);
        })
        .catch((error) => {
            console.error('초기화 실패:', error);
            process.exit(1);
        });
}

module.exports = { initializeDatabase, dbConfig };

