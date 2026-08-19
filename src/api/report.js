export const getLatestWeeklyReport = async () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');

    const response = await fetch('https://miseno.store/api/v1/reports/weekly/latest/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('주간 리포트를 불러오는데 실패했습니다.');
    }

    return response.json();
};

export const getLatestRoutineRecs = async () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');

    const response = await fetch('https://miseno.store/api/v1/reports/routines/latest/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('루틴 추천을 불러오는데 실패했습니다.');
    }

    return response.json();
};