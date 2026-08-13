import { useState } from 'react';
import './WeeklyCalendar.css';
import arrowPrev from '../../assets/images/arrow-prev.svg';
import arrowNext from '../../assets/images/arrow-next.svg';

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// 임시 일정 데이터
// 나중에 백엔드 API 연결 시 실제 schedules 데이터로 교체
const mockSchedules = [
  {
    date: '2026-08-12',
    type: 'swim',
  },
  {
    date: '2026-08-14',
    type: 'clinic',
  },
  {
    date: '2026-08-14',
    type: 'swim',
  },
  {
    date: '2026-08-15',
    type: 'clinic',
  },
];

// Date → YYYY-MM-DD
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// 해당 날짜가 포함된 주의 일요일 반환
const getSunday = (date) => {
  const sunday = new Date(date);
  sunday.setHours(0, 0, 0, 0);
  sunday.setDate(sunday.getDate() - sunday.getDay());

  return sunday;
};

// 해당 주의 7일 반환
const getWeekDates = (date) => {
  const sunday = getSunday(date);

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(sunday);
    currentDate.setDate(sunday.getDate() + index);

    return currentDate;
  });
};

const WeeklyCalendar = ({ schedules = mockSchedules }) => {
  // 현재 보고 있는 주
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());

  // 사용자가 선택한 날짜
  // 처음에는 오늘 날짜가 선택된 상태
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 현재 주의 날짜 7개
  const weekDates = getWeekDates(currentWeekDate);

  // 현재 주 가운데 날짜를 기준으로 연/월 표시
  const headerDate = weekDates[3];
  const year = headerDate.getFullYear();
  const month = String(headerDate.getMonth() + 1).padStart(2, '0');

  // 이전 주
  const handlePrevWeek = () => {
    const prevWeek = new Date(currentWeekDate);
    prevWeek.setDate(prevWeek.getDate() - 7);

    setCurrentWeekDate(prevWeek);
  };

  // 다음 주
  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeekDate);
    nextWeek.setDate(nextWeek.getDate() + 7);

    setCurrentWeekDate(nextWeek);
  };

  // 날짜 선택
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // 특정 날짜의 일정 가져오기
  const getSchedulesForDate = (date) => {
    const dateKey = formatDateKey(date);

    return schedules.filter(
      (schedule) => schedule.date === dateKey
    );
  };

  return (
    <section className="weekly-calendar">
      {/* 상단 헤더 */}
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button
            type="button"
            className="calendar-arrow"
            onClick={handlePrevWeek}
            aria-label="이전 주"
          >
            <img src={arrowPrev} alt="이전 주" />
          </button>

          <span className="calendar-month">
            {year}년&nbsp;&nbsp;{month}월
          </span>

          <button
            type="button"
            className="calendar-arrow"
            onClick={handleNextWeek}
            aria-label="다음 주"
          >
            <img src={arrowNext} alt="다음 주" />
          </button>
        </div>

        {/* 일정 범례 */}
        <div className="schedule-legend">
          <div className="legend-item">
            <span className="legend-dot swim-dot" />
            <span>수영</span>
          </div>

          <div className="legend-item">
            <span className="legend-dot clinic-dot" />
            <span>클리닉</span>
          </div>
        </div>
      </div>

      {/* 요일 */}
      <div className="calendar-weekdays">
        {WEEK_DAYS.map((day, index) => (
          <div
            key={day}
            className={`calendar-weekday ${
              index === 0 ? 'sunday' : ''
            } ${index === 6 ? 'saturday' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="calendar-dates">
        {weekDates.map((date) => {
          const dateKey = formatDateKey(date);

          // 현재 선택된 날짜인지 확인
          const isSelected =
            selectedDate &&
            dateKey === formatDateKey(selectedDate);

          const daySchedules = getSchedulesForDate(date);

          const hasSwim = daySchedules.some(
            (schedule) => schedule.type === 'swim'
          );

          const hasClinic = daySchedules.some(
            (schedule) => schedule.type === 'clinic'
          );

          return (
            <button
              key={dateKey}
              type="button"
              className={`calendar-date ${
                isSelected ? 'selected' : ''
              }`}
              onClick={() => handleDateClick(date)}
            >
              {/* 날짜 숫자 + 일정 점 */}
              <div className="date-circle">
                <span className="date-number">
                  {date.getDate()}
                </span>

                <div className="schedule-dots">
                  {hasSwim && (
                    <span
                      className="schedule-dot swim-dot"
                      aria-label="수영 일정"
                    />
                  )}

                  {hasClinic && (
                    <span
                      className="schedule-dot clinic-dot"
                      aria-label="클리닉 일정"
                    />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default WeeklyCalendar;