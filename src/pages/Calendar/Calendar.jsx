import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar';

import prevBtn from '../../assets/images/prev-btn.svg';
import moreRecords from '../../assets/images/more-records.svg';

import './Calendar.css';


/* ========================================
   날짜 파싱
======================================== */

const parseDateParam = (dateParam) => {
  if (!dateParam) {
    return new Date(2026, 7, 14);
  }

  const [
    year,
    month,
    day,
  ] = dateParam
    .split('-')
    .map(Number);

  if (!year || !month || !day) {
    return new Date(2026, 7, 14);
  }

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return new Date(2026, 7, 14);
  }

  return parsedDate;
};


/* ========================================
   화면용 날짜
   2026.08.14
======================================== */

const formatDate = (date) => {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}.${month}.${day}`;
};


/* ========================================
   URL용 날짜
   2026-08-14
======================================== */

const formatDateForInput = (date) => {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


/* ========================================
   월의 마지막 날짜
======================================== */

const getDaysInMonth = (
  year,
  month
) => {
  return new Date(
    year,
    month,
    0
  ).getDate();
};


/* ========================================
   종료 날짜 범위
======================================== */

const YEAR_START = 2026;
const YEAR_END = 2100;

const YEAR_OPTIONS = Array.from(
  {
    length:
      YEAR_END - YEAR_START + 1,
  },
  (_, index) =>
    YEAR_START + index
);

const MONTH_OPTIONS = Array.from(
  { length: 12 },
  (_, index) => index + 1
);


/* ========================================
   Wheel Column
======================================== */

function WheelColumn({
  values,
  selectedValue,
  onChange,
  renderValue,
  ariaLabel,
}) {
  const containerRef =
    useRef(null);

  const scrollTimerRef =
    useRef(null);


  /* ========================================
     현재 선택값을 중앙으로 이동
  ======================================== */

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) {
      return;
    }

    const selectedIndex =
      values.indexOf(
        selectedValue
      );

    if (selectedIndex === -1) {
      return;
    }

    const itemHeight =
      window.innerWidth <= 375
        ? 52
        : 56;

    container.scrollTo({
      top:
        selectedIndex * itemHeight,
      behavior: 'auto',
    });
  }, [
    values,
    selectedValue,
  ]);


  /* ========================================
     스크롤 종료
  ======================================== */

  const handleScroll = () => {
    const container =
      containerRef.current;

    if (!container) {
      return;
    }

    clearTimeout(
      scrollTimerRef.current
    );

    scrollTimerRef.current =
      setTimeout(() => {
        const itemHeight =
          window.innerWidth <= 375
            ? 52
            : 56;

        const rawIndex =
          container.scrollTop /
          itemHeight;

        const index =
          Math.round(rawIndex);

        const clampedIndex =
          Math.max(
            0,
            Math.min(
              index,
              values.length - 1
            )
          );

        const nextValue =
          values[clampedIndex];

        if (
          nextValue !==
          selectedValue
        ) {
          onChange(
            nextValue
          );
        }

        container.scrollTo({
          top:
            clampedIndex *
            itemHeight,
          behavior: 'smooth',
        });
      }, 120);
  };


  /* ========================================
     정리
  ======================================== */

  useEffect(() => {
    return () => {
      clearTimeout(
        scrollTimerRef.current
      );
    };
  }, []);


  return (
    <div
      className="calendar-wheel-column"
      aria-label={ariaLabel}
    >

      <div
        ref={containerRef}
        className="calendar-wheel-scroll"
        onScroll={handleScroll}
      >

        <div className="calendar-wheel-spacer" />

        {values.map(
          (value) => (
            <button
              key={value}
              type="button"
              className={`calendar-wheel-item ${
                value === selectedValue
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                onChange(value)
              }
            >
              {renderValue(
                value
              )}
            </button>
          )
        )}

        <div className="calendar-wheel-spacer" />

      </div>

    </div>
  );
}


/* ========================================
   Calendar
======================================== */

function Calendar() {
  const navigate =
    useNavigate();

  const [searchParams] =
    useSearchParams();


  /* ========================================
     URL 날짜
  ======================================== */

  const dateParam =
    searchParams.get('date');

  const selectedDate =
    parseDateParam(
      dateParam
    );


  /* ========================================
     State
  ======================================== */

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState('');


  const [
    startTime,
    setStartTime,
  ] = useState('10:00');


  const [
    endTime,
    setEndTime,
  ] = useState('11:00');


  const [
    isRepeat,
    setIsRepeat,
  ] = useState(false);


  const repeatType =
    '주마다';


  const [
    repeatEndType,
    setRepeatEndType,
  ] = useState('');


  const [
    repeatCount,
    setRepeatCount,
  ] = useState('10');


  const [
    repeatEndDate,
    setRepeatEndDate,
  ] = useState(
    new Date(2027, 7, 14)
  );


  const [
    isDatePickerOpen,
    setIsDatePickerOpen,
  ] = useState(false);


  const [
    memo,
    setMemo,
  ] = useState('');


  /* ========================================
     종료 날짜 값
  ======================================== */

  const repeatEndYear =
    repeatEndDate.getFullYear();

  const repeatEndMonth =
    repeatEndDate.getMonth() + 1;

  const repeatEndDay =
    repeatEndDate.getDate();


  const repeatEndDayOptions =
    Array.from(
      {
        length:
          getDaysInMonth(
            repeatEndYear,
            repeatEndMonth
          ),
      },
      (_, index) =>
        index + 1
    );


  /* ========================================
     종료 날짜 변경
  ======================================== */

  const updateRepeatEndDate = ({
    year = repeatEndYear,
    month = repeatEndMonth,
    day = repeatEndDay,
  }) => {
    const maxDay =
      getDaysInMonth(
        year,
        month
      );

    const safeDay =
      Math.min(
        day,
        maxDay
      );

    setRepeatEndDate(
      new Date(
        year,
        month - 1,
        safeDay
      )
    );
  };


  /* ========================================
     WeeklyCalendar 날짜 변경
  ======================================== */

  const handleDateChange = (
    date
  ) => {
    navigate(
      `/calendar?date=${formatDateForInput(
        date
      )}`,
      {
        replace: true,
      }
    );
  };


  /* ========================================
     이전
  ======================================== */

  const handleBack = () => {
    navigate(-1);
  };


  /* ========================================
     저장
  ======================================== */

  const handleSave = () => {
    const calendarData = {
      date: formatDate(
        selectedDate
      ),

      event:
        selectedEvent,

      startTime,

      endTime,

      repeat:
        isRepeat,

      repeatType:
        isRepeat
          ? repeatType
          : null,

      repeatEndType:
        isRepeat
          ? repeatEndType
          : null,

      repeatCount:
        isRepeat &&
        repeatEndType ===
          'count'
          ? Number(
              repeatCount
            )
          : null,

      repeatEndDate:
        isRepeat &&
        repeatEndType ===
          'date'
          ? formatDate(
              repeatEndDate
            )
          : null,

      memo,
    };

    console.log(
      '캘린더 일정 저장:',
      calendarData
    );

    // TODO:
    // 실제 일정 등록 API 연결
  };


  return (
    <main className="calendar-page">

      {/* ================================
          Header
      ================================= */}

      <header className="calendar-header">

        <button
          type="button"
          className="calendar-back-button"
          onClick={handleBack}
          aria-label="이전"
        >
          <img
            src={prevBtn}
            alt="이전"
          />
        </button>

      </header>


      {/* ================================
          Weekly Calendar
      ================================= */}

      <section className="calendar-weekly-section">

        <WeeklyCalendar
          selectedDate={
            selectedDate
          }
          onDateChange={
            handleDateChange
          }
        />

      </section>


      {/* ================================
          Detail
      ================================= */}

      <section className="calendar-detail">

        {/* ================================
            Selected Date
        ================================= */}

        <div className="calendar-selected-date">
          {formatDate(
            selectedDate
          )}
        </div>


        {/* ================================
            일정
        ================================= */}

        <section className="calendar-detail-section">

          <h2>
            일정
          </h2>

          <div className="calendar-event-buttons">

            <button
              type="button"
              className={`calendar-event-button ${
                selectedEvent ===
                'swim'
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                setSelectedEvent(
                  'swim'
                )
              }
            >
              수영
            </button>


            <button
              type="button"
              className={`calendar-event-button ${
                selectedEvent ===
                'clinic'
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                setSelectedEvent(
                  'clinic'
                )
              }
            >
              클리닉
            </button>

          </div>

        </section>


        {/* ================================
            시간
        ================================= */}

        <section className="calendar-detail-section">

          <h2>
            시간
          </h2>

          <div className="calendar-time-row">

            <div className="calendar-time-group">

              <span className="calendar-time-date">
                {formatDate(
                  selectedDate
                )}
              </span>

              <label className="calendar-time-input-wrap">

                <input
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(
                      event.target.value
                    )
                  }
                  aria-label="시작 시간"
                />

              </label>

            </div>


            <span
              className="calendar-time-arrow"
              aria-hidden="true"
            >
              →
            </span>


            <div className="calendar-time-group">

              <span className="calendar-time-date">
                {formatDate(
                  selectedDate
                )}
              </span>

              <label className="calendar-time-input-wrap">

                <input
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(
                      event.target.value
                    )
                  }
                  aria-label="종료 시간"
                />

              </label>

            </div>

          </div>

        </section>


        {/* ================================
            반복
        ================================= */}

        <section className="calendar-detail-section">

          <div className="calendar-repeat-header">

            <h2>
              반복
            </h2>

            <button
              type="button"
              className={`calendar-repeat-toggle ${
                isRepeat
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setIsRepeat(
                  (prev) =>
                    !prev
                )
              }
              aria-label="반복 설정"
              aria-pressed={
                isRepeat
              }
            >
              <span />
            </button>

          </div>


          {isRepeat && (
            <div className="calendar-repeat-content">

              {/* 반복 규칙 */}

              <div className="calendar-repeat-rule">

                <input
                  type="text"
                  className="repeat-number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={3}
                  value={repeatCount}
                  onChange={(event) => {
                    const value =
                      event.target.value.replace(
                        /\D/g,
                        ''
                      );

                    setRepeatCount(
                      value
                    );
                  }}
                  onBlur={() => {

                    if (
                      repeatCount ===
                      ''
                    ) {
                      setRepeatCount(
                        '1'
                      );

                      return;
                    }

                    const number =
                      Number(
                        repeatCount
                      );

                    if (
                      number < 1
                    ) {
                      setRepeatCount(
                        '1'
                      );

                      return;
                    }

                    if (
                      number > 100
                    ) {
                      setRepeatCount(
                        '100'
                      );
                    }
                  }}
                  aria-label="반복 횟수"
                />

                <span>
                  {repeatType}
                </span>

              </div>


              {/* 반복 종료 */}

              <div className="calendar-repeat-end-options">

                <button
                  type="button"
                  className={`repeat-end-button ${
                    repeatEndType ===
                    'continue'
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    setRepeatEndType(
                      'continue'
                    )
                  }
                >
                  계속 반복
                </button>


                <button
                  type="button"
                  className={`repeat-end-button ${
                    repeatEndType ===
                    'count'
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    setRepeatEndType(
                      'count'
                    )
                  }
                >
                  일정 횟수 반복
                </button>


                <button
                  type="button"
                  className={`repeat-end-button ${
                    repeatEndType ===
                    'date'
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    setRepeatEndType(
                      'date'
                    )
                  }
                >
                  종료 날짜
                </button>

              </div>


              {/* 반복 횟수 */}

              {repeatEndType ===
                'count' && (
                <div className="calendar-repeat-value">

                  <span>
                    총
                  </span>

                  <input
                    type="text"
                    className="repeat-number repeat-count-input"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={3}
                    value={repeatCount}
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          ''
                        );

                      setRepeatCount(
                        value
                      );
                    }}
                    onBlur={() => {

                      if (
                        repeatCount ===
                        ''
                      ) {
                        setRepeatCount(
                          '1'
                        );

                        return;
                      }

                      const number =
                        Number(
                          repeatCount
                        );

                      if (
                        number < 1
                      ) {
                        setRepeatCount(
                          '1'
                        );

                        return;
                      }

                      if (
                        number > 100
                      ) {
                        setRepeatCount(
                          '100'
                        );
                      }
                    }}
                    aria-label="반복 횟수"
                  />

                  <span>
                    번
                  </span>

                </div>
              )}


              {/* 종료 날짜 */}

              {repeatEndType ===
                'date' && (
                <div className="calendar-repeat-date">

                  {/* 선택 날짜 */}

                  <button
                    type="button"
                    className="calendar-repeat-date-trigger"
                    onClick={() =>
                      setIsDatePickerOpen(
                        (prev) =>
                          !prev
                      )
                    }
                    aria-expanded={
                      isDatePickerOpen
                    }
                  >

                    <span>
                      {repeatEndYear}년{' '}
                      {repeatEndMonth}월{' '}
                      {repeatEndDay}일
                    </span>

                    <img
                      src={moreRecords}
                      alt=""
                      aria-hidden="true"
                      className={`calendar-repeat-date-icon ${
                        isDatePickerOpen
                          ? 'open'
                          : ''
                      }`}
                    />

                  </button>


                  {/* ================================
                      Wheel Picker
                  ================================= */}

                  {isDatePickerOpen && (
                    <div className="calendar-wheel-picker">

                      <div className="calendar-wheel-selected-line" />


                      {/* 년 */}

                      <WheelColumn
                        values={
                          YEAR_OPTIONS
                        }
                        selectedValue={
                          repeatEndYear
                        }
                        onChange={(
                          year
                        ) =>
                          updateRepeatEndDate({
                            year,
                          })
                        }
                        renderValue={(
                          year
                        ) =>
                          `${year}년`
                        }
                        ariaLabel="연도 선택"
                      />


                      {/* 월 */}

                      <WheelColumn
                        values={
                          MONTH_OPTIONS
                        }
                        selectedValue={
                          repeatEndMonth
                        }
                        onChange={(
                          month
                        ) =>
                          updateRepeatEndDate({
                            month,
                          })
                        }
                        renderValue={(
                          month
                        ) =>
                          `${String(
                            month
                          ).padStart(
                            2,
                            '0'
                          )}월`
                        }
                        ariaLabel="월 선택"
                      />


                      {/* 일 */}

                      <WheelColumn
                        values={
                          repeatEndDayOptions
                        }
                        selectedValue={
                          repeatEndDay
                        }
                        onChange={(
                          day
                        ) =>
                          updateRepeatEndDate({
                            day,
                          })
                        }
                        renderValue={(
                          day
                        ) =>
                          `${day}일`
                        }
                        ariaLabel="일 선택"
                      />

                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </section>


        {/* ================================
            메모
        ================================= */}

        <section className="calendar-detail-section">

          <h2>
            메모
          </h2>

          <input
            type="text"
            className="calendar-memo-input"
            value={memo}
            onChange={(event) =>
              setMemo(
                event.target.value
              )
            }
            placeholder="메모를 입력하세요."
          />

        </section>


        {/* ================================
            저장
        ================================= */}

        <button
          type="button"
          className="calendar-save-button"
          onClick={handleSave}
        >
          저장
        </button>

      </section>

    </main>
  );
}

export default Calendar;