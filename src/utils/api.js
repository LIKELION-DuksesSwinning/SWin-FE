// src/utils/api.js

export const fetchWithToken = async (url, options = {}) => {
    // 1. 무조건 로컬 스토리지에서 토큰을 꺼냅니다.
    const token = localStorage.getItem('accessToken');
    
    // 2. 기본 헤더 세팅
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // 3. 토큰이 있으면 무조건 Authorization에 붙여줍니다! (실수 원천 차단)
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 4. 통신 실행
    const response = await fetch(url, { ...options, headers });

    // 5. 만약 401(토큰 만료) 에러가 나면 자동으로 로그인 화면으로 쫓아냅니다!
    if (response.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해 주세요.');
        localStorage.clear();
        window.location.href = '/'; // 로그인 페이지로 강제 이동
        throw new Error('Unauthorized');
    }

    return response;
};