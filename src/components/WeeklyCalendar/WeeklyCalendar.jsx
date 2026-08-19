import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import './WeeklyCalendar.css';

import arrowPrev from '../../assets/images/arrow-prev.svg';
import arrowNext from '../../assets/images/arrow-next.svg';

import { apiRequest } from '../../api/axios';


const WEEK_DAYS = [
  'Su',
  'Mo',
  'Tu',
  'We',
  'Th',
  'Fr',
  'Sa',
];


/* ========================================
   Date → YYYY-MM-DD
======================================== */

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


/* ========================================
   API datetime → YYYY-MM-DD
======================================== */

const getScheduleDateKey = (datetime) => {
  if (!datetime) {
    return null;
  }

  return String(datetime).slice(0, 10);
};


/* ========================================
   API schedule → 화면용 schedule
======================================== */

const normalizeSchedule = (schedule) => ({
  id: schedule?.schedule_id,

  date: getScheduleDateKey(
    schedule?.start_datetime
  ),

  type:
    schedule?.category === 'SWIM'
      ? 'swim'
      : schedule?.category === 'CLINIC'
        ? 'clinic'
        : null,

  category:
    schedule?.category ?? null,

  categoryDisplay:
    schedule?.category_display ?? '',

  start_datetime:
    schedule?.start_datetime ?? null,

  end_datetime:
    schedule?.end_datetime ?? null,

  memo:
    schedule?.memo ?? '',

  is_repeat:
    Boolean(schedule?.is_repeat),

  repeat_interval_weeks:
    schedule?.repeat_interval_weeks ?? null,

  repeat_end_type:
    schedule?.repeat_end_type ?? null,

  repeat_count:
    schedule?.repeat_count ?? null,

  repeat_until:
    schedule?.repeat_until ?? null,
});


/* ========================================
   월별 일정 조회
======================================== */

const fetchSchedulesByMonth = async (
  year,
  month
) => {
  const data = await apiRequest(
    `/api/v1/schedules/?year=${year}&month=${month}`,
    {
      method: 'GET',
      authenticated: true,
    }
  );

  const schedules = Array.isArray(
    data?.schedules
  )
    ? data.schedules
    : [];

  return schedules
    .map(normalizeSchedule)
    .filter(
      (schedule) =>
        schedule.date &&
        schedule.type
    );
};


/* ========================================
   해당 날짜가 포함된 주의 일요일
======================================== */

const getSunday = (date) => {
  const sunday = new Date(date);

  sunday.setHours(
    0,
    0,
    0,
    0
  );

  sunday.setDate(
    sunday.getDate() - sunday.getDay()
  );

  return sunday;
};


/* ========================================
   해당 주의 7일
======================================== */

const getWeekDates = (date) => {
  const sunday = getSunday(date);

  return Array.from(
    { length: 7 },
    (_, index) => {
      const currentDate =
        new Date(sunday);

      currentDate.setDate(
        sunday.getDate() + index
      );

      return currentDate;
    }
  );
};


const WeeklyCalendar = ({
  schedules: controlledSchedules = null,
  selectedDate: controlledSelectedDate = null,
  onDateChange = null,
}) => {
  /* ========================================
     초기 날짜
  ======================================== */

  const initialDate =
    controlledSelectedDate
      ? new Date(controlledSelectedDate)
      : new Date();


  /* ========================================
     현재 주의 기준 날짜
  ======================================== */

  const [
    currentWeekDate,
    setCurrentWeekDate,
  ] = useState(initialDate);


  /* ========================================
     내부 선택 날짜

     controlledSelectedDate가 전달되지 않는
     독립 사용을 위한 fallback state
  ======================================== */

  const [
    internalSelectedDate,
    setInternalSelectedDate,
  ] = useState(initialDate);


  /* ========================================
     실제 선택 날짜
  ======================================== */

  const selectedDate =
    controlledSelectedDate ||
    internalSelectedDate;


  /* ========================================
     API 일정
  ======================================== */

  const [
    fetchedSchedules,
    setFetchedSchedules,
  ] = useState([]);


  /* ========================================
     API 일정 조회 중 여부
  ======================================== */

  const [
    isFetchingSchedules,
    setIsFetchingSchedules,
  ] = useState(false);


  /* ========================================
     현재 주 날짜
  ======================================== */

  const weekDates = useMemo(
    () =>
      getWeekDates(
        currentWeekDate
      ),
    [currentWeekDate]
  );


  /* ========================================
     로딩 상태

     부모에게 schedules가 전달된 경우에는
     자체 API 조회를 하지 않음
  ======================================== */

  const isLoading =
    controlledSchedules === null &&
    isFetchingSchedules;


  /* ========================================
     이번 주가 포함된 월 조회
  ======================================== */

  useEffect(() => {
    if (
      controlledSchedules !== null
    ) {
      return;
    }

    let isMounted = true;

    const loadSchedules = async () => {
      if (isMounted) {
        setIsFetchingSchedules(true);
      }

      try {
        const firstDate =
          weekDates[0];

        const lastDate =
          weekDates[6];


        /* ========================================
           첫 번째 월
        ======================================== */

        const monthRequests = [
          {
            year:
              firstDate.getFullYear(),

            month:
              firstDate.getMonth() + 1,
          },
        ];


        /* ========================================
           마지막 날짜가 다른 월에 있다면
           해당 월도 추가 조회
        ======================================== */

        const lastMonth = {
          year:
            lastDate.getFullYear(),

          month:
            lastDate.getMonth() + 1,
        };


        if (
          monthRequests[0].year !==
            lastMonth.year ||
          monthRequests[0].month !==
            lastMonth.month
        ) {
          monthRequests.push(
            lastMonth
          );
        }


        /* ========================================
           월별 API 요청
        ======================================== */

        const results =
          await Promise.all(
            monthRequests.map(
              ({ year, month }) =>
                fetchSchedulesByMonth(
                  year,
                  month
                )
            )
          );


        /* ========================================
           API 결과 병합
        ======================================== */

        const merged =
          results.flat();


        /* ========================================
           schedule_id 기준 중복 제거
        ======================================== */

        const uniqueSchedules =
          Array.from(
            new Map(
              merged.map(
                (schedule) => [
                  schedule.id,
                  schedule,
                ]
              )
            ).values()
          );


        if (isMounted) {
          setFetchedSchedules(
            uniqueSchedules
          );
        }
      } catch (error) {
        console.error(
          '주간 일정 조회 실패:',
          error
        );

        if (isMounted) {
          setFetchedSchedules([]);
        }
      } finally {
        if (isMounted) {
          setIsFetchingSchedules(false);
        }
      }
    };

    loadSchedules();

    return () => {
      isMounted = false;
    };
  }, [
    weekDates,
    controlledSchedules,
  ]);


  /* ========================================
     실제 일정 데이터
  ======================================== */

  const schedules =
    controlledSchedules !== null
      ? controlledSchedules
      : fetchedSchedules;


  /* ========================================
     헤더 월
  ======================================== */

  const headerDate =
    weekDates[3];


  const year =
    headerDate.getFullYear();


  const month = String(
    headerDate.getMonth() + 1
  ).padStart(2, '0');


  /* ========================================
     이전 주
  ======================================== */

  const handlePrevWeek = () => {
    const prevWeek =
      new Date(
        currentWeekDate
      );

    prevWeek.setDate(
      prevWeek.getDate() - 7
    );

    setCurrentWeekDate(
      prevWeek
    );
  };


  /* ========================================
     다음 주
  ======================================== */

  const handleNextWeek = () => {
    const nextWeek =
      new Date(
        currentWeekDate
      );

    nextWeek.setDate(
      nextWeek.getDate() + 7
    );

    setCurrentWeekDate(
      nextWeek
    );
  };


  /* ========================================
     날짜 선택
  ======================================== */

  const handleDateClick = (
    date
  ) => {
    setInternalSelectedDate(
      date
    );

    if (onDateChange) {
      onDateChange(date);
    }
  };


  /* ========================================
     특정 날짜 일정 조회
  ======================================== */

  const getSchedulesForDate = (
    date
  ) => {
    const dateKey =
      formatDateKey(date);

    return schedules.filter(
      (schedule) =>
        schedule.date === dateKey
    );
  };


  return (
    <section className="weekly-calendar">

      {/* ========================================
          Header
      ======================================== */}

      <div className="calendar-header">

        <div className="calendar-navigation">

          <button
            type="button"
            className="calendar-arrow"
            onClick={
              handlePrevWeek
            }
            aria-label="이전 주"
          >
            <img
              src={arrowPrev}
              alt=""
            />
          </button>


          <span className="calendar-month">
            {year}년&nbsp;&nbsp;
            {month}월
          </span>


          <button
            type="button"
            className="calendar-arrow"
            onClick={
              handleNextWeek
            }
            aria-label="다음 주"
          >
            <img
              src={arrowNext}
              alt=""
            />
          </button>

        </div>


        {/* ========================================
            수영 / 클리닉 범례
        ======================================== */}

        <div className="schedule-legend">

          <div className="legend-item">
            <span
              className="legend-dot swim-dot"
            />
            <span>수영</span>
          </div>


          <div className="legend-item">
            <span
              className="legend-dot clinic-dot"
            />
            <span>클리닉</span>
          </div>

        </div>

      </div>


      {/* ========================================
          Weekdays
      ======================================== */}

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


      {/* ========================================
          Dates
      ======================================== */}

      <div className="calendar-dates">

        {weekDates.map((date) => {
          const dateKey =
            formatDateKey(date);


          const isSelected =
            selectedDate &&
            dateKey ===
              formatDateKey(
                new Date(
                  selectedDate
                )
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


      {/* ========================================
          Loading 상태

          현재 CSS 구조를 유지하기 위해
          실제 화면에는 표시하지 않음
      ======================================== */}

      <span
        aria-hidden="true"
        style={{
          display: 'none',
        }}
      >
        {isLoading
          ? 'loading'
          : ''}
      </span>

    </section>
  );
};


export default WeeklyCalendar;