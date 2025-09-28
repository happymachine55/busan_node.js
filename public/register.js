// 회원가입 폼 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');

    // 폼 제출 이벤트 리스너
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 입력 데이터 수집
        const formData = {
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            fullName: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim()
        };

        // 클라이언트 사이드 유효성 검사
        if (!validateForm(formData)) {
            return;
        }

        // 버튼 비활성화 및 로딩 상태
        submitBtn.disabled = true;
        submitBtn.textContent = '처리 중...';

        try {
            // API 호출
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // 성공 시
                form.style.display = 'none';
                successMessage.style.display = 'block';
            } else {
                // 실패 시 에러 메시지 표시
                displayErrors(result.errors || [{ msg: result.message }]);
            }

        } catch (error) {
            console.error('회원가입 오류:', error);
            showError('submitBtn', '네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            // 버튼 상태 복원
            submitBtn.disabled = false;
            submitBtn.textContent = '회원가입';
        }
    });

    // 실시간 유효성 검사
    document.getElementById('username').addEventListener('blur', validateUsername);
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('password').addEventListener('input', validatePassword);
    document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);
    document.getElementById('fullName').addEventListener('blur', validateFullName);
    document.getElementById('phone').addEventListener('blur', validatePhone);
});

// 폼 유효성 검사
function validateForm(data) {
    let isValid = true;

    // 모든 에러 메시지 초기화
    clearAllErrors();

    // 사용자명 검사
    if (!validateUsername()) isValid = false;
    
    // 이메일 검사
    if (!validateEmail()) isValid = false;
    
    // 비밀번호 검사
    if (!validatePassword()) isValid = false;
    
    // 비밀번호 확인 검사
    if (!validateConfirmPassword()) isValid = false;
    
    // 이름 검사
    if (!validateFullName()) isValid = false;
    
    // 전화번호 검사 (선택사항)
    if (data.phone && !validatePhone()) isValid = false;

    return isValid;
}

// 사용자명 유효성 검사
function validateUsername() {
    const username = document.getElementById('username').value.trim();
    const errorElement = document.getElementById('usernameError');
    
    if (!username) {
        showError('usernameError', '사용자명을 입력해주세요.');
        return false;
    }
    
    if (username.length < 3 || username.length > 50) {
        showError('usernameError', '사용자명은 3-50자 사이여야 합니다.');
        return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showError('usernameError', '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.');
        return false;
    }
    
    clearError('usernameError');
    return true;
}

// 이메일 유효성 검사
function validateEmail() {
    const email = document.getElementById('email').value.trim();
    const errorElement = document.getElementById('emailError');
    
    if (!email) {
        showError('emailError', '이메일을 입력해주세요.');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('emailError', '올바른 이메일 형식이 아닙니다.');
        return false;
    }
    
    clearError('emailError');
    return true;
}

// 비밀번호 유효성 검사
function validatePassword() {
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('passwordError');
    
    if (!password) {
        showError('passwordError', '비밀번호를 입력해주세요.');
        return false;
    }
    
    if (password.length < 6) {
        showError('passwordError', '비밀번호는 최소 6자 이상이어야 합니다.');
        return false;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        showError('passwordError', '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다.');
        return false;
    }
    
    clearError('passwordError');
    return true;
}

// 비밀번호 확인 유효성 검사
function validateConfirmPassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('confirmPasswordError');
    
    if (!confirmPassword) {
        showError('confirmPasswordError', '비밀번호 확인을 입력해주세요.');
        return false;
    }
    
    if (password !== confirmPassword) {
        showError('confirmPasswordError', '비밀번호가 일치하지 않습니다.');
        return false;
    }
    
    clearError('confirmPasswordError');
    return true;
}

// 이름 유효성 검사
function validateFullName() {
    const fullName = document.getElementById('fullName').value.trim();
    const errorElement = document.getElementById('fullNameError');
    
    if (!fullName) {
        showError('fullNameError', '이름을 입력해주세요.');
        return false;
    }
    
    if (fullName.length < 2 || fullName.length > 100) {
        showError('fullNameError', '이름은 2-100자 사이여야 합니다.');
        return false;
    }
    
    clearError('fullNameError');
    return true;
}

// 전화번호 유효성 검사 (선택사항)
function validatePhone() {
    const phone = document.getElementById('phone').value.trim();
    const errorElement = document.getElementById('phoneError');
    
    if (phone) {
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(phone)) {
            showError('phoneError', '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
            return false;
        }
    }
    
    clearError('phoneError');
    return true;
}

// 에러 메시지 표시
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// 에러 메시지 숨기기
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

// 모든 에러 메시지 초기화
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
}

// 서버 에러 메시지 표시
function displayErrors(errors) {
    clearAllErrors();
    
    errors.forEach(error => {
        const field = error.path || error.param;
        const message = error.msg || error.message;
        
        switch (field) {
            case 'username':
                showError('usernameError', message);
                break;
            case 'email':
                showError('emailError', message);
                break;
            case 'password':
                showError('passwordError', message);
                break;
            case 'fullName':
                showError('fullNameError', message);
                break;
            case 'phone':
                showError('phoneError', message);
                break;
            default:
                showError('submitBtn', message);
        }
    });
}

