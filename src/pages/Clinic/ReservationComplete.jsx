import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReservationComplete.css';

import completePrev from '../../assets/images/complete-prev.svg';

const ReservationComplete = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedDate, selectedTime } = location.state || {};
    const [requestText, setRequestText] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const korWeekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const dateObj = selectedDate ? new Date(selectedDate) : new Date();
    const formattedDate = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${korWeekDays[dateObj.getDay()]})`;

    const handleSubmit = () => {
        if (isAgreed) {
            const existingReservations = JSON.parse(localStorage.getItem('clinicReservations') || '[]');
            
            const newReservation = {
                id: Date.now(), 
                date: formattedDate,
                time: selectedTime,
                request: requestText,
                status: '예약 완료'
            };
            
            const updatedReservations = [newReservation, ...existingReservations];
            
            localStorage.setItem('clinicReservations', JSON.stringify(updatedReservations));

            alert('예약이 완료되었습니다!');
            navigate('/clinic'); 
        }
    };

    const handlePrevClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmCancel = () => {
        setIsModalOpen(false);
        navigate('/clinic');
    };

    return (
        <div className="reservation-container">
            <div className="header-container">
                <button className="header-back-btn" onClick={handlePrevClick}>
                    <img src={completePrev} alt="뒤로가기" />
                </button>
                <span className="title">더나 클리닉 예약하기</span>
            </div>

            <div className="form-wrapper">
                <div className="form-section">
                    <div className="section-label">일정</div>
                    <div className="selected-info-text">{formattedDate}</div>
                    <div className="selected-info-text">{selectedTime}</div>
                </div>

                <div className="form-section">
                    <div className="section-label">요청 사항</div>
                    <textarea 
                        className="request-textarea"
                        placeholder="요청 사항을 입력해 주세요." 
                        value={requestText}
                        onChange={(e) => setRequestText(e.target.value)}
                    />
                </div>

                <div className="form-section agreement-section">
                    <div className="section-label">안내</div>
                    <p className="agreement-text">
                        SWin 내의 사용자 정보를 제3자(더나 클리닉)에 제공하는 것에 동의하십니까?
                    </p>
                    <label className="checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={isAgreed} 
                            onChange={(e) => setIsAgreed(e.target.checked)} 
                        />
                        <span>예, 동의합니다</span>
                    </label>
                </div>
            </div>

            <div className="bottom-action-area">
                <button 
                    className={`next-submit-btn ${isAgreed ? 'active' : ''}`} 
                    disabled={!isAgreed}
                    onClick={handleSubmit}
                >
                    예약 완료
                </button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">예약을 취소하시겠습니까?</h3>
                        <p className="modal-desc">지금 예약을 취소하면 예약 정보가 모두 사라집니다.</p>
                        <div className="modal-actions">
                            <button className="modal-btn cancel" onClick={handleCloseModal}>취소</button>
                            <button className="modal-btn confirm" onClick={handleConfirmCancel}>확인</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationComplete;