import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReservationHistory.css';
import completePrev from '../../assets/images/complete-prev.svg';

const ReservationHistory = () => {
    const navigate = useNavigate();
    const [reservations] = useState(() => {
        const saved = localStorage.getItem('clinicReservations');
        return saved ? JSON.parse(saved) : [];
    });

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
                                <div className="history-value">{item.date}</div>
                                <div className="history-value">{item.time}</div>
                            </div>

                            <div className="history-section">
                                <div className="history-label">시술 내역</div>
                                <div className="history-value">메디컬 스킨 케어</div>
                                <div className="history-value">크라이오 진정관리</div>
                            </div>

                            <div className="history-section status-section">
                                <div className="history-value">{item.status}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReservationHistory;