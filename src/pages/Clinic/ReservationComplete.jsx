import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReservationComplete.css';
import completePrev from '../../assets/images/complete-prev.svg';

const API_BASE_URL = 'https://miseno.store/api/v1/clinics';

const ReservationComplete = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { selectedDate, formattedDateStr, selectedTime, clinicId } = location.state || {};
    
    const [requestText, setRequestText] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    
    const korWeekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const dateObj = selectedDate ? new Date(selectedDate) : new Date();
    const formattedDateDisplay = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${korWeekDays[dateObj.getDay()]})`;

    const handleSubmit = async () => {
        if (!isAgreed || !clinicId) return;

        try {
            const token = localStorage.getItem('accessToken');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const payload = {
                clinic_id: clinicId,
                visit_date: formattedDateStr,
                visit_time: selectedTime,
                user_note: requestText,
                user_consented: isAgreed
            };

            const response = await fetch(`${API_BASE_URL}/reservations/`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (response.status === 201) {
                setIsSuccessModalOpen(true);
            } else if (response.status === 401) {
                alert('로그인이 만료되었습니다. 다시 로그인해 주세요.');
                localStorage.clear();
                navigate('/');
            } else {
                const errorData = await response.json();
                console.error(errorData);
                alert('예약 실패: ' + JSON.stringify(errorData));
            }
        } catch (error) {
            console.error('API 에러:', error);
            alert('서버와 통신할 수 없습니다.');
        }
    };

    const handlePrevClick = () => setIsCancelModalOpen(true);
    const handleCloseCancelModal = () => setIsCancelModalOpen(false);
    const handleConfirmCancel = () => {
        setIsCancelModalOpen(false);
        navigate('/clinic');
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
        navigate('/clinic/history');
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
                    <div className="selected-info-text">{formattedDateDisplay}</div>
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

            {isCancelModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">예약을 취소하시겠습니까?</h3>
                        <p className="modal-desc">지금 예약을 취소하면 예약 정보가 모두 사라집니다.</p>
                        <div className="modal-actions">
                            <button className="modal-btn cancel" onClick={handleCloseCancelModal}>취소</button>
                            <button className="modal-btn confirm" onClick={handleConfirmCancel}>확인</button>
                        </div>
                    </div>
                </div>
            )}

            {isSuccessModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content success-modal">
                        <h3 className="modal-title">예약되었습니다.</h3>
                        <p className="modal-desc">예약 내역은 '예약 내역 확인'에서 확인할 수 있습니다.</p>
                        <div className="modal-actions single-action">
                            <button className="modal-btn confirm-single" onClick={handleCloseSuccessModal}>확인</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationComplete;