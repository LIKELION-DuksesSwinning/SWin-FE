import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReservationHistory.css';
import completePrev from '../../assets/images/complete-prev.svg';

const API_BASE_URL = 'https://miseno.store/api/v1/clinics';

const ReservationHistory = () => {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch(`${API_BASE_URL}/reservations/`, { headers });
                
                if (response.ok) {
                    const data = await response.json();
                    setReservations(data);
                } else if (response.status === 401) {
                    console.error('인증 에러: 로그인이 만료되었거나 토큰이 없습니다.');
                }
            } catch (error) {
                console.error('예약 내역 조회 실패:', error);
            }
        };

        fetchHistory();
    }, []);

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return timeStr.slice(0, 5);
    };

    return (
        <div className="reservation-container">
            <div className="header-container">
                <button className="header-back-btn" onClick={() => navigate(-1)}>
                    <img src={completePrev} alt="뒤로가기" />
                </button>
                <h2 className="title">예약 내역 확인</h2>
            </div>

            <div className="history-list-wrapper">
                {reservations.length === 0 ? (
                    <div className="empty-message">예약된 내역이 없습니다.</div>
                ) : (
                    reservations.map((item) => (
                        <div key={item.id} className="history-card">
                            <div className="history-section">
                                <div className="history-label">일시</div>
                                <div className="history-value">{item.visit_date}</div>
                                <div className="history-value">{formatTime(item.visit_time)}</div>
                            </div>

                            <div className="history-section">
                                <div className="history-label">시술 내역</div>
                                {item.treatment_items && item.treatment_items.length > 0 ? (
                                    item.treatment_items.map((treatment, idx) => (
                                        <div key={idx} className="history-value">{treatment}</div>
                                    ))
                                ) : (
                                    <div className="history-value">시술 내역 없음</div>
                                )}
                            </div>

                            <div className="history-section status-section">
                                <div className="history-value">{item.statusDisplay}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReservationHistory;