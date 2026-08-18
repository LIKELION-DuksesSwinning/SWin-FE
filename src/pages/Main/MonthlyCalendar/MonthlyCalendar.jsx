import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import arrowPrev from '../../../assets/images/arrow-prev.svg';
import arrowNext from '../../../assets/images/arrow-next.svg';

import {
  getSchedulesByMonth,
} from '../../../api/schedules';

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


const normalizeSchedule = (
  schedule
) => ({
  id:
    schedule.schedule_id,

  date:
    String(
      schedule.start_datetime
    ).slice(0, 10),

  type:
    schedule.category ===
    'SWIM'
      ? 'swim'
      : schedule.category ===
        'CLINIC'
        ? 'clinic'
        : null,

  category:
    schedule.category,

  categoryDisplay:
    schedule.category_display,

  start_datetime:
    schedule.start_datetime,

  end_datetime:
    schedule.end_datetime,

  memo:
    schedule.memo ?? '',

  is_repeat:
    Boolean(
      schedule.is_repeat
    ),

  repeat_interval_weeks:
    schedule.repeat_interval_weeks ??
    null,

  repeat_end_type:
    schedule.repeat_end_type ??
    null,

  repeat_count:
    schedule.repeat_count ??
    null,

  repeat_until:
    schedule.repeat_until ??
    null,
});


function MonthlyCalendar() {
  const navigate =
    useNavigate();


  const [
    currentDate,
    setCurrentDate,
  ] = useState(
    new Date(2026, 7, 1)
  );


  const [
    selectedDate,
    setSelectedDate,
  ] = useState(14);


  const [
    schedules,
    setSchedules,
  ] = useState([]);


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    hasError,
    setHasError,
  ] = useState(false);


  const year =
    currentDate.getFullYear();


  const month =
    currentDate.getMonth();


  const monthNumber =
    month + 1;


  const monthLabel =
    `${year}년 ${String(
      monthNumber
    ).padStart(2, '0')}월`;


  /* ========================================
     월별 일정 조회
  ======================================== */

  useEffect(() => {
    let isMounted =
      true;


    const loadSchedules =
      async () => {
        setIsLoading(true);
        setHasError(false);


        try {
          const data =
            await getSchedulesByMonth(
              year,
              monthNumber
            );


          const nextSchedules =
            Array.isArray(
              data?.schedules
            )
              ? data.schedules
                  .map(
                    normalizeSchedule
                  )
                  .filter(
                    (schedule) =>
                      schedule.date &&
                      schedule.type
                  )
              : [];


          if (isMounted) {
            setSchedules(
              nextSchedules
            );
          }
        } catch (error) {
          console.error(
            '월간 일정 조회 실패:',
            error
          );

          if (isMounted) {
            setSchedules([]);
            setHasError(true);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };


    loadSchedules();


    return () => {
      isMounted = false;
    };
  }, [
    year,
    monthNumber,
  ]);


  /* ========================================
     달력 범위
  ======================================== */

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();


  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  const previousMonthLastDate =
    new Date(
      year,
      month,
      0
    ).getDate();


  /* ========================================
     날짜 생성
  ======================================== */

  const calendarDays =
    useMemo(() => {
      const days = [];


      for (
        let index =
          firstDay - 1;
        index >= 0;
        index -= 1
      ) {
        days.push({
          day:
            previousMonthLastDate -
            index,

          currentMonth:
            false,

          dateKey:
            null,
        });
      }


      for (
        let day = 1;
        day <=
        daysInMonth;
        day += 1
      ) {
        const dateKey =
          `${year}-${String(
            month + 1
          ).padStart(
            2,
            '0'
          )}-${String(
            day
          ).padStart(
            2,
            '0'
          )}`;


        days.push({
          day,
          currentMonth:
            true,
          dateKey,
        });
      }


      let nextDay = 1;


      while (
        days.length <
        42
      ) {
        days.push({
          day:
            nextDay,

          currentMonth:
            false,

          dateKey:
            null,
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


  /* 이전 달 */

  const goToPreviousMonth =
    () => {
      setCurrentDate(
        new Date(
          year,
          month - 1,
          1
        )
      );

      setSelectedDate(null);
    };


  /* 다음 달 */

  const goToNextMonth =
    () => {
      setCurrentDate(
        new Date(
          year,
          month + 1,
          1
        )
      );

      setSelectedDate(null);
    };


  /* 날짜 클릭 */

  const handleDateClick =
    (date) => {
      if (
        !date.currentMonth
      ) {
        return;
      }

      setSelectedDate(
        date.day
      );
    };


  /* 날짜 더블클릭 */

  const handleDateDoubleClick =
    (date) => {
      if (
        !date.currentMonth
      ) {
        return;
      }

      navigate(
        `/calendar?date=${encodeURIComponent(
          date.dateKey
        )}`
      );
    };


  return (
    <section className="monthly-calendar">

      <div className="calendar-top">

        <div className="calendar-month-navigation">

          <button
            type="button"
            className="calendar-month-button"
            onClick={
              goToPreviousMonth
            }
            aria-label="이전 달"
          >
            <img
              src={arrowPrev}
              alt=""
            />
          </button>

          <strong>
            {monthLabel}
          </strong>

          <button
            type="button"
            className="calendar-month-button"
            onClick={
              goToNextMonth
            }
            aria-label="다음 달"
          >
            <img
              src={arrowNext}
              alt=""
            />
          </button>

        </div>


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


      <div className="calendar-weekdays">

        {WEEKDAYS.map(
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


      <div className="calendar-grid">

        {calendarDays.map(
          (date, index) => {
            const events =
              date.dateKey
                ? schedules
                    .filter(
                      (schedule) =>
                        schedule.date ===
                        date.dateKey
                    )
                    .map(
                      (schedule) =>
                        schedule.type
                    )
                : [];


            const hasSwim =
              events.includes(
                'swim'
              );

            const hasClinic =
              events.includes(
                'clinic'
              );


            const isSelected =
              date.currentMonth &&
              date.day ===
                selectedDate;


            return (
              <button
                key={`${
                  date.dateKey ??
                  'empty'
                }-${index}`}
                type="button"
                className={`calendar-day ${
                  date.currentMonth
                    ? 'current-month'
                    : 'other-month'
                }`}
                onClick={() =>
                  handleDateClick(
                    date
                  )
                }
                onDoubleClick={() =>
                  handleDateDoubleClick(
                    date
                  )
                }
                disabled={
                  !date.currentMonth
                }
                aria-label={
                  date.currentMonth
                    ? `${year}년 ${
                        month + 1
                      }월 ${
                        date.day
                      }일`
                    : undefined
                }
              >

                <span
                  className={`calendar-day-content ${
                    isSelected
                      ? 'selected'
                      : ''
                  }`}
                >

                  <span className="calendar-day-number">
                    {date.day}
                  </span>


                  {(hasSwim ||
                    hasClinic) && (
                    <span className="calendar-events">

                      {hasSwim && (
                        <span
                          className="calendar-event-dot swim"
                          aria-label="수영 일정"
                        />
                      )}

                      {hasClinic && (
                        <span
                          className="calendar-event-dot clinic"
                          aria-label="클리닉 일정"
                        />
                      )}

                    </span>
                  )}

                </span>

              </button>
            );
          }
        )}

      </div>


      {hasError && (
        <span
          aria-live="polite"
          style={{
            display: 'none',
          }}
        >
          일정 조회에 실패했습니다.
        </span>
      )}


      {isLoading && (
        <span
          aria-live="polite"
          style={{
            display: 'none',
          }}
        >
          일정을 불러오는 중입니다.
        </span>
      )}

    </section>
  );
}


export default MonthlyCalendar;