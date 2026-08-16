import { useState } from 'react';

import './WeeklyCalendar.css';

import arrowPrev from '../../assets/images/arrow-prev.svg';
import arrowNext from '../../assets/images/arrow-next.svg';

const WEEK_DAYS = [
  'Su',
  'Mo',
  'Tu',
  'We',
  'Th',
  'Fr',
  'Sa',
];

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

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// 해당 날짜가 포함된 주의 일요일 반환
const getSunday = (date) => {
  const sunday = new Date(date);

  sunday.setHours(0, 0, 0, 0);

  sunday.setDate(
    sunday.getDate() - sunday.getDay()
  );

  return sunday;
};

// 해당 주의 7일 반환
const getWeekDates = (date) => {
  const sunday = getSunday(date);

  return Array.from(
    { length: 7 },
    (_, index) => {
      const currentDate = new Date(sunday);

      currentDate.setDate(
        sunday.getDate() + index
      );

      return currentDate;
    }
  );
};

const WeeklyCalendar = ({
  schedules = mockSchedules,

  // Calendar 페이지에서 전달하는 선택 날짜
  selectedDate: controlledSelectedDate = null,

  // 날짜가 변경되었을 때 부모에게 전달
  onDateChange = null,
}) => {
  // ========================================
  // 초기 날짜
  //
  // Calendar 페이지에서 selectedDate가 전달되면
  // 해당 날짜가 포함된 주부터 보여줌
  // ========================================

  const initialDate =
    controlledSelectedDate || new Date();

  // 현재 보고 있는 주의 기준 날짜
  const [
    currentWeekDate,
    setCurrentWeekDate,
  ] = useState(initialDate);

  // 내부 선택 날짜
  const [
    internalSelectedDate,
    setInternalSelectedDate,
  ] = useState(initialDate);

  // 실제 선택 날짜
  const selectedDate =
    controlledSelectedDate ||
    internalSelectedDate;

  // 현재 주의 7일
  const weekDates =
    getWeekDates(currentWeekDate);

  // 주 가운데 날짜를 기준으로 월 표시
  const headerDate = weekDates[3];

  const year =
    headerDate.getFullYear();

  const month = String(
    headerDate.getMonth() + 1
  ).padStart(2, '0');


  // ========================================
  // 이전 주
  // ========================================

  const handlePrevWeek = () => {
    const prevWeek =
      new Date(currentWeekDate);

    prevWeek.setDate(
      prevWeek.getDate() - 7
    );

    setCurrentWeekDate(prevWeek);
  };


  // ========================================
  // 다음 주
  // ========================================

  const handleNextWeek = () => {
    const nextWeek =
      new Date(currentWeekDate);

    nextWeek.setDate(
      nextWeek.getDate() + 7
    );

    setCurrentWeekDate(nextWeek);
  };


  // ========================================
  // 날짜 선택
  // ========================================

  const handleDateClick = (date) => {
    setInternalSelectedDate(date);

    // Calendar 페이지에서 사용하는 경우
    // 부모의 selectedDate도 변경
    if (onDateChange) {
      onDateChange(date);
    }
  };


  // ========================================
  // 특정 날짜 일정 가져오기
  // ========================================

  const getSchedulesForDate = (date) => {
    const dateKey =
      formatDateKey(date);

    return schedules.filter(
      (schedule) =>
        schedule.date === dateKey
    );
  };


  return (
    <section className="weekly-calendar">

      {/* ================================
          상단 헤더
      ================================= */}

      <div className="calendar-header">

        <div className="calendar-navigation">

          <button
            type="button"
            className="calendar-arrow"
            onClick={handlePrevWeek}
            aria-label="이전 주"
          >
            <img
              src={arrowPrev}
              alt="이전 주"
            />
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
            <img
              src={arrowNext}
              alt="다음 주"
            />
          </button>

        </div>


        {/* ================================
            일정 범례
        ================================= */}

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


      {/* ================================
          요일
      ================================= */}

      <div className="calendar-weekdays">

        {WEEK_DAYS.map(
          (day, index) => (
            <div
              key={day}
              className={`calendar-weekday ${
                index === 0
                  ? 'sunday'
                  : ''
              } ${
                index === 6
                  ? 'saturday'
                  : ''
              }`}
            >
              {day}
            </div>
          )
        )}

      </div>


      {/* ================================
          날짜
      ================================= */}

      <div className="calendar-dates">

        {weekDates.map((date) => {
          const dateKey =
            formatDateKey(date);

          const isSelected =
            selectedDate &&
            dateKey ===
              formatDateKey(
                selectedDate
              );

          const daySchedules =
            getSchedulesForDate(
              date
            );

          const hasSwim =
            daySchedules.some(
              (schedule) =>
                schedule.type ===
                'swim'
            );

          const hasClinic =
            daySchedules.some(
              (schedule) =>
                schedule.type ===
                'clinic'
            );

          return (
            <button
              key={dateKey}
              type="button"
              className={`calendar-date ${
                isSelected
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                handleDateClick(
                  date
                )
              }
            >

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