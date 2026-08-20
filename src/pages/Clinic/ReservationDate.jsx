import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReservationDate.css';
import arrowNext from '../../assets/images/arrow-next.svg';

const ReservationDate = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1));
    const [selectedDate, setSelectedDate] = useState(null);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const handleNextMonth = () => {
        if (month === 8) {
            setCurrentDate(new Date(2026, 8, 1));
            setSelectedDate(null);
        }
    };

    const handlePrevMonth = () => {
        if (month === 9) {
            setCurrentDate(new Date(2026, 7, 1));
            setSelectedDate(null);
        }
    };

    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonthLastDate = new Date(year, month - 1, 0).getDate();
    const calendarCells = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        calendarCells.push({ type: 'prev', day: prevMonthLastDate - i, dayOfWeek: firstDayOfMonth - 1 - i });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarCells.push({ type: 'current', day: i, dayOfWeek: (firstDayOfMonth + i - 1) % 7 });
    }
    const remainingCells = calendarCells.length % 7 === 0 ? 0 : 7 - (calendarCells.length % 7);
    for (let i = 1; i <= remainingCells; i++) {
        calendarCells.push({ type: 'next', day: i, dayOfWeek: (firstDayOfMonth + daysInMonth + i - 1) % 7 });
    }

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const korWeekDays = ['일', '월', '화', '수', '목', '금', '토'];

    const handleDateClick = (cell) => {
        if (cell.type === 'current') {
            setSelectedDate(new Date(year, month - 1, cell.day));
        }
    };

    const handleNextStep = () => {
        if (selectedDate) {
            // API에 보낼 YYYY-MM-DD 포맷 만들기
            const yyyy = selectedDate.getFullYear();
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const dd = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDateStr = `${yyyy}-${mm}-${dd}`;

            navigate('/clinic/time', { 
                state: { selectedDate, formattedDateStr } 
            });
        }
    };

    return (
        <div className="reservation-container">
            <h2 className="title">더나 클리닉 예약하기</h2>
            <p className="subtitle">방문일을 선택해 주세요.</p>

            <div className="calendar-wrapper">
                <div className="calendar-header">
                    <button className="arrow-btn" onClick={handlePrevMonth} disabled={month === 8}>
                        {month === 9 ? '<' : ''}
                    </button>
                    <span className="current-month">{year}년 {month < 10 ? `0${month}` : month}월</span>
                    <button className="arrow-btn" onClick={handleNextMonth} disabled={month === 9}>
                        {month === 8 ? <img src={arrowNext} alt="다음 달" /> : ''}
                    </button>
                </div>

                <div className="calendar">
                    <div className="weekdays">
                        {weekDays.map((day, idx) => (
                            <div key={idx} className={`weekday ${idx === 0 ? 'sun' : idx === 6 ? 'sat' : ''}`}>
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="days-grid">
                        {calendarCells.map((cell, idx) => {
                            const isSelected = selectedDate && cell.type === 'current' && selectedDate.getDate() === cell.day;
                            let dayColorClass = '';
                            if (cell.type === 'current') {
                                if (cell.dayOfWeek === 0) dayColorClass = 'sun';
                                else if (cell.dayOfWeek === 6) dayColorClass = 'sat';
                            }
                            return (
                                <div
                                    key={idx}
                                    className={`day-cell ${cell.type !== 'current' ? 'disabled-day' : ''} ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleDateClick(cell)}
                                >
                                    <div className={`day-number ${dayColorClass}`}>{cell.day}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="bottom-action-area">
                <div className="date-info-container">
                    {selectedDate ? (
                        <div className="selected-date-info">
                            <div className="selected-date-text">
                                {month}월 {selectedDate.getDate()}일 ({korWeekDays[selectedDate.getDay()]})
                            </div>
                            <div className="congestion-text">예상 혼잡도: 여유</div>
                        </div>
                    ) : (
                        <div className="reservation-history-link" onClick={() => navigate('/clinic/history')}>
                            예약 내역 확인
                        </div>
                    )}
                </div>

                <button
                    className={`next-submit-btn ${selectedDate ? 'active' : ''}`}
                    disabled={!selectedDate}
                    onClick={handleNextStep}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default ReservationDate;