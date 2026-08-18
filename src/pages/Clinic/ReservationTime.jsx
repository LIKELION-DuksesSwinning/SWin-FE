import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReservationTime.css';
import prevBtn from '../../assets/images/prev-btn.svg';

const API_BASE_URL = 'https://miseno.store/api/v1/clinics';

const ReservationTime = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { selectedDate, formattedDateStr } = location.state || {}; 

    const [selectedTime, setSelectedTime] = useState(null);
    const lunchTimes = ['12:00', '12:15', '12:30', '12:45'];
    const [disabledTimes, setDisabledTimes] = useState(lunchTimes);

    const [clinicId, setClinicId] = useState(null);

    const amTimes = ['10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45'];
    const pmTimes = [
        '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45',
        '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
        '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45',
        '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45',
        '20:00', '20:15', '20:30', '20:45', '21:00'
    ];

    useEffect(() => {
        if (!formattedDateStr) return;

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const clinicRes = await fetch(`${API_BASE_URL}/`, { headers });
                
                if (clinicRes.ok) {
                    const clinicData = await clinicRes.json();
                    const clinicList = clinicData.results || clinicData;
                    
                    if (clinicList && clinicList.length > 0) {
                        const fetchedClinicId = clinicList[0].id;
                        setClinicId(fetchedClinicId);

                        const timeRes = await fetch(`${API_BASE_URL}/${fetchedClinicId}/available-times/?date=${formattedDateStr}`, { headers });
                        if (timeRes.ok) {
                            const timeData = await timeRes.json();
                            const lunchTimes = ['12:00', '12:15', '12:30', '12:45'];
                            setDisabledTimes([...lunchTimes, ...(timeData.bookedTimes || [])]);
                        }
                    } else {
                        console.error("백엔드에 등록된 병원 데이터가 없습니다.");
                    }
                }
            } catch (error) {
                console.error('데이터 조회 실패:', error);
            }
        };

        fetchData();
    }, [formattedDateStr]);

    const handleTimeClick = (time) => {
        if (disabledTimes.includes(time)) return;
        setSelectedTime(time);
    };

    const handleNextStep = () => {
        if (!clinicId) {
            alert("병원 정보를 불러오지 못했습니다. 서버에 등록된 병원이 있는지 확인해 주세요.");
            return;
        }

        if (selectedTime && clinicId) {
            navigate('/clinic/complete', { 
                state: { selectedDate, formattedDateStr, selectedTime, clinicId } 
            });
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
                    {<img src={prevBtn} alt="이전" />}
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