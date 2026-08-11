import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReservationTime.css';
import timePrev from '../../assets/images/time-prev.svg';

const ReservationTime = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const selectedDate = location.state?.selectedDate; 

    const [selectedTime, setSelectedTime] = useState(null);

    const amTimes = ['10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45'];
    const pmTimes = [
        '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45',
        '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
        '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45',
        '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45',
        '20:00', '20:15', '20:30', '20:45', '21:00'
    ];

    const disabledTimes = ['12:00', '12:15', '12:30', '12:45'];

    const handleTimeClick = (time) => {
        if (disabledTimes.includes(time)) return;
        
        setSelectedTime(time);
    };

    const handleNextStep = () => {
        if (selectedTime) {
            navigate('/clinic/complete', { state: { selectedDate, selectedTime } });
        }
    };

    return (
        <div className="reservation-container">
            <h2 className="title">더나 클리닉 예약하기</h2>
            <p className="subtitle">방문 시간을 선택해 주세요.</p>

            <div className="time-selection-wrapper">
                <div className="time-section-title">오전</div>
                <div className="time-grid">
                    {amTimes.map((time, idx) => (
                        <div 
                            key={idx} 
                            className={`time-cell ${selectedTime === time ? 'selected' : ''} ${disabledTimes.includes(time) ? 'disabled' : ''}`}
                            onClick={() => handleTimeClick(time)}
                        >
                            {time}
                        </div>
                    ))}
                </div>

                <div className="time-section-title">오후</div>
                <div className="time-grid">
                    {pmTimes.map((time, idx) => (
                        <div 
                            key={idx} 
                            className={`time-cell ${selectedTime === time ? 'selected' : ''} ${disabledTimes.includes(time) ? 'disabled' : ''}`}
                            onClick={() => handleTimeClick(time)}
                        >
                            {time}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bottom-action-area row-action">
                <button className="time-prev-btn" onClick={() => navigate(-1)}>
                    {<img src={timePrev} alt="이전" />}
                </button>
                
                <button 
                    className={`next-submit-btn flex-grow ${selectedTime ? 'active' : ''}`} 
                    disabled={!selectedTime}
                    onClick={handleNextStep}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default ReservationTime;