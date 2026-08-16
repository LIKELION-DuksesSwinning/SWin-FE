import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './MonthlyCalendar.css';

const WEEKDAYS = [
  'Su',
  'Mo',
  'Tu',
  'We',
  'Th',
  'Fr',
  'Sa',
];

// 임시 데이터
// 나중에 백엔드 API 연결 시 실제 schedules 데이터로 교체
const DEMO_EVENTS = {
  '2026-08-05': ['swim'],
  '2026-08-08': ['clinic'],
  '2026-08-10': ['swim'],
  '2026-08-12': ['swim'],
  '2026-08-14': ['swim', 'clinic'],
  '2026-08-15': ['clinic'],
};

function MonthlyCalendar() {
  const navigate = useNavigate();

  // 현재 보고 있는 달
  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 7, 1)
  );

  // 현재 달에서 선택된 날짜
  const [selectedDate, setSelectedDate] =
    useState(14);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthLabel = `${year}년 ${String(
    month + 1
  ).padStart(2, '0')}월`;

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const previousMonthLastDate = new Date(
    year,
    month,
    0
  ).getDate();

  // ========================================
  // 캘린더 날짜 생성
  // ========================================

  const calendarDays = useMemo(() => {
    const days = [];

    // 이전 달
    for (
      let i = firstDay - 1;
      i >= 0;
      i -= 1
    ) {
      days.push({
        day: previousMonthLastDate - i,
        currentMonth: false,
        dateKey: null,
      });
    }

    // 현재 달
    for (
      let day = 1;
      day <= daysInMonth;
      day += 1
    ) {
      const dateKey = `${year}-${String(
        month + 1
      ).padStart(2, '0')}-${String(day).padStart(
        2,
        '0'
      )}`;

      days.push({
        day,
        currentMonth: true,
        dateKey,
      });
    }

    // 다음 달
    let nextDay = 1;

    while (days.length < 42) {
      days.push({
        day: nextDay,
        currentMonth: false,
        dateKey: null,
      });

      nextDay += 1;
    }

    return days;
  }, [
    daysInMonth,
    firstDay,
    month,
    previousMonthLastDate,
    year,
  ]);

  // ========================================
  // 이전 달
  // ========================================

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );

    setSelectedDate(null);
  };

  // ========================================
  // 다음 달
  // ========================================

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );

    setSelectedDate(null);
  };

  // ========================================
  // 날짜 클릭
  // ========================================

  const handleDateClick = (date) => {
    if (!date.currentMonth) return;

    setSelectedDate(date.day);
  };

  // ========================================
  // 날짜 더블클릭
  // → 상세 캘린더 페이지 이동
  // ========================================

  const handleDateDoubleClick = (date) => {
    if (!date.currentMonth) return;

    navigate(
      `/calendar?date=${date.dateKey}`
    );
  };

  return (
    <section className="monthly-calendar">

      {/* ================================
          Top
      ================================= */}

      <div className="calendar-top">

        <div className="calendar-month-navigation">

          <button
            type="button"
            className="calendar-month-button"
            onClick={goToPreviousMonth}
            aria-label="이전 달"
          >
            ‹
          </button>

          <strong>
            {monthLabel}
          </strong>

          <button
            type="button"
            className="calendar-month-button"
            onClick={goToNextMonth}
            aria-label="다음 달"
          >
            ›
          </button>

        </div>


        {/* ================================
            Legend
        ================================= */}

        <div className="calendar-legend">

          <span className="calendar-legend-item">
            <span className="calendar-dot swim" />
            수영
          </span>

          <span className="calendar-legend-item">
            <span className="calendar-dot clinic" />
            클리닉
          </span>

        </div>

      </div>


      {/* ================================
          Weekdays
      ================================= */}

      <div className="calendar-weekdays">

        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`calendar-weekday ${
              index === 0
                ? 'sunday'
                : index === 6
                  ? 'saturday'
                  : ''
            }`}
          >
            {day}
          </div>
        ))}

      </div>


      {/* ================================
          Dates
      ================================= */}

      <div className="calendar-grid">

        {calendarDays.map(
          (date, index) => {

            const events = date.dateKey
              ? DEMO_EVENTS[
                  date.dateKey
                ] ?? []
              : [];

            const isSelected =
              date.currentMonth &&
              date.day === selectedDate;

            return (
              <button
                key={`${date.dateKey ?? 'empty'}-${index}`}
                type="button"
                className={`calendar-day ${
                  date.currentMonth
                    ? 'current-month'
                    : 'other-month'
                } ${
                  isSelected
                    ? 'selected'
                    : ''
                }`}
                onClick={() =>
                  handleDateClick(date)
                }
                onDoubleClick={() =>
                  handleDateDoubleClick(date)
                }
                disabled={!date.currentMonth}
              >
                <span className="calendar-day-number">
                  {date.day}
                </span>

                {events.length > 0 && (
                  <span className="calendar-events">

                    {events.includes(
                      'swim'
                    ) && (
                      <span
                        className="calendar-event-dot swim"
                      />
                    )}

                    {events.includes(
                      'clinic'
                    ) && (
                      <span
                        className="calendar-event-dot clinic"
                      />
                    )}

                  </span>
                )}

              </button>
            );
          }
        )}

      </div>

    </section>
  );
}

export default MonthlyCalendar;