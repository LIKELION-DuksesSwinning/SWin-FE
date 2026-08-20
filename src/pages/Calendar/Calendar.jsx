import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import WeeklyCalendar
  from '../../components/WeeklyCalendar/WeeklyCalendar';

import prevBtn
  from '../../assets/images/prev-btn.svg';

import moreRecords
  from '../../assets/images/more-records.svg';

import {
  getSchedulesByMonth,
  createSchedule,
  updateSchedule,
} from '../../api/schedules';

import './Calendar.css';


/* ========================================
   날짜 파싱
======================================== */

const parseDateParam = (dateParam) => {
  if (!dateParam) {
    return new Date(2026, 7, 14);
  }

  const [year, month, day] = dateParam
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
======================================== */

const formatDate = (date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}.${month}.${day}`;
};


/* ========================================
   URL·API용 날짜
======================================== */

const formatDateForInput = (date) => {
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
   API schedule → 화면용 schedule
======================================== */

const normalizeSchedule = (schedule) => ({
  id: schedule.schedule_id,

  date: String(
    schedule.start_datetime
  ).slice(0, 10),

  type:
    schedule.category === 'SWIM'
      ? 'swim'
      : schedule.category === 'CLINIC'
        ? 'clinic'
        : null,

  category: schedule.category,

  categoryDisplay:
    schedule.category_display,

  start_datetime:
    schedule.start_datetime,

  end_datetime:
    schedule.end_datetime,

  memo:
    schedule.memo ?? '',

  is_repeat:
    Boolean(schedule.is_repeat),

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

  clinic_reservation:
    schedule.clinic_reservation ??
    null,
});


/* ========================================
   API 응답 → 화면용 schedules
======================================== */

const normalizeSchedulesResponse = (
  data
) => {
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
   Wheel Column
======================================== */

function WheelColumn({
  values,
  selectedValue,
  onChange,
  renderValue,
  ariaLabel,
}) {
  const containerRef = useRef(null);
  const scrollTimerRef = useRef(null);

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) {
      return;
    }

    const selectedIndex =
      values.indexOf(selectedValue);

    if (selectedIndex === -1) {
      return;
    }

    const itemHeight =
      window.innerWidth <= 375
        ? 52
        : 56;

    container.scrollTo({
      top:
        selectedIndex *
        itemHeight,
      behavior: 'auto',
    });
  }, [
    values,
    selectedValue,
  ]);

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
          nextValue !== selectedValue
        ) {
          onChange(nextValue);
        }

        container.scrollTo({
          top:
            clampedIndex *
            itemHeight,
          behavior: 'smooth',
        });
      }, 120);
  };

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

        {values.map((value) => (
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
            {renderValue(value)}
          </button>
        ))}

        <div className="calendar-wheel-spacer" />
      </div>
    </div>
  );
}


/* ========================================
   Calendar
======================================== */

function Calendar() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const dateParam =
    searchParams.get('date');

  const selectedDate =
    parseDateParam(dateParam);

  const selectedYear =
    selectedDate.getFullYear();

  const selectedMonth =
    selectedDate.getMonth() + 1;


  /* ========================================
     State
  ======================================== */

  const [
    schedules,
    setSchedules,
  ] = useState([]);

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState('');

  const [
    selectedScheduleId,
    setSelectedScheduleId,
  ] = useState(null);

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

  const [
    repeatIntervalWeeks,
    setRepeatIntervalWeeks,
  ] = useState('1');

  const repeatType = '주마다';

  const [
    repeatEndType,
    setRepeatEndType,
  ] = useState('');

  const [
    repeatCount,
    setRepeatCount,
  ] = useState('');

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

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    saveMessage,
    setSaveMessage,
  ] = useState('');

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const saveMessageTimerRef =
    useRef(null);


  /* ========================================
     반복 종료 조건 변환
  ======================================== */

  const mapApiEndTypeToUi = (
    value
  ) => {
    if (value === 'FOREVER') {
      return 'continue';
    }

    if (value === 'COUNT') {
      return 'count';
    }

    if (value === 'UNTIL_DATE') {
      return 'date';
    }

    return '';
  };

  const mapUiEndTypeToApi = (
    value
  ) => {
    if (value === 'continue') {
      return 'FOREVER';
    }

    if (value === 'count') {
      return 'COUNT';
    }

    if (value === 'date') {
      return 'UNTIL_DATE';
    }

    return null;
  };


  /* ========================================
     일정 → 입력 폼 반영
  ======================================== */

  const applyScheduleToForm = (
    schedule,
    baseDate = selectedDate
  ) => {
    if (!schedule) {
      setSelectedEvent('');
      setSelectedScheduleId(null);
      setStartTime('10:00');
      setEndTime('11:00');
      setIsRepeat(false);
      setRepeatIntervalWeeks('1');
      setRepeatEndType('');
      setRepeatCount('');
      setMemo('');

      setRepeatEndDate(
        new Date(
          baseDate.getFullYear() + 1,
          baseDate.getMonth(),
          baseDate.getDate()
        )
      );

      return;
    }

    setSelectedEvent(
      schedule.type
    );

    setSelectedScheduleId(
      schedule.id
    );

    if (schedule.start_datetime) {
      const start = String(
        schedule.start_datetime
      ).slice(11, 16);

      if (start) {
        setStartTime(start);
      }
    }

    if (schedule.end_datetime) {
      const end = String(
        schedule.end_datetime
      ).slice(11, 16);

      if (end) {
        setEndTime(end);
      }
    }

    setMemo(
      schedule.memo || ''
    );

    setIsRepeat(
      Boolean(schedule.is_repeat)
    );

    setRepeatIntervalWeeks(
      String(
        schedule
          .repeat_interval_weeks ??
          1
      )
    );

    setRepeatEndType(
      schedule.repeat_end_type
        ? mapApiEndTypeToUi(
            schedule.repeat_end_type
          )
        : ''
    );

    setRepeatCount(
      schedule.repeat_count != null
        ? String(
            schedule.repeat_count
          )
        : ''
    );

    if (schedule.repeat_until) {
      const [
        year,
        month,
        day,
      ] = String(
        schedule.repeat_until
      )
        .split('-')
        .map(Number);

      if (year && month && day) {
        setRepeatEndDate(
          new Date(
            year,
            month - 1,
            day
          )
        );
      }
    }
  };


  /* ========================================
     일정 목록 조회
  ======================================== */

  useEffect(() => {
    let isMounted = true;

    const fetchInitialSchedules =
      async () => {
        setIsLoading(true);

        try {
          const data =
            await getSchedulesByMonth(
              selectedYear,
              selectedMonth
            );

          const result =
            normalizeSchedulesResponse(
              data
            );

          if (isMounted) {
            setSchedules(result);
            setErrorMessage('');
          }
        } catch (error) {
          console.error(
            '캘린더 일정 조회 실패:',
            error
          );

          if (isMounted) {
            setSchedules([]);

            setErrorMessage(
              error?.message ||
                '일정을 불러오지 못했습니다.'
            );
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

    fetchInitialSchedules();

    return () => {
      isMounted = false;
    };
  }, [
    selectedYear,
    selectedMonth,
  ]);


  /* ========================================
     현재 날짜의 일정
  ======================================== */

  const selectedDateKey =
    formatDateForInput(
      selectedDate
    );

  const selectedDateSchedules =
    schedules.filter(
      (schedule) =>
        schedule.date ===
        selectedDateKey
    );


  /* ========================================
     이벤트 선택
  ======================================== */

  const handleEventSelect = (
    eventType
  ) => {
    setSelectedEvent(eventType);

    const existingSchedule =
      selectedDateSchedules.find(
        (schedule) =>
          schedule.type ===
          eventType
      );

    if (existingSchedule) {
      applyScheduleToForm(
        existingSchedule
      );

      return;
    }

    setSelectedScheduleId(null);
    setStartTime('10:00');
    setEndTime('11:00');
    setMemo('');
    setIsRepeat(false);
    setRepeatIntervalWeeks('1');
    setRepeatEndType('');
    setRepeatCount('');
  };


  /* ========================================
     반복 날짜 옵션
  ======================================== */

  const YEAR_START = 2026;
  const YEAR_END = 2100;

  const YEAR_OPTIONS =
    Array.from(
      {
        length:
          YEAR_END -
          YEAR_START +
          1,
      },
      (_, index) =>
        YEAR_START + index
    );

  const MONTH_OPTIONS =
    Array.from(
      {
        length: 12,
      },
      (_, index) => index + 1
    );

  const repeatEndYear =
    repeatEndDate.getFullYear();

  const repeatEndMonth =
    repeatEndDate.getMonth() + 1;

  const repeatEndDay =
    repeatEndDate.getDate();

  const getDaysInMonth = (
    year,
    month
  ) =>
    new Date(
      year,
      month,
      0
    ).getDate();

  const repeatEndDayOptions =
    Array.from(
      {
        length:
          getDaysInMonth(
            repeatEndYear,
            repeatEndMonth
          ),
      },
      (_, index) => index + 1
    );

  const updateRepeatEndDate = ({
    year = repeatEndYear,
    month = repeatEndMonth,
    day = repeatEndDay,
  }) => {
    const maxDay =
      getDaysInMonth(year, month);

    const safeDay =
      Math.min(day, maxDay);

    setRepeatEndDate(
      new Date(
        year,
        month - 1,
        safeDay
      )
    );
  };


  /* ========================================
     화면 이동
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

  const handleBack = () => {
    navigate(-1);
  };


  /* ========================================
     저장 성공 메시지
  ======================================== */

  const showSaveMessage = () => {
    setSaveMessage(
      '저장되었습니다.'
    );

    clearTimeout(
      saveMessageTimerRef.current
    );

    saveMessageTimerRef.current =
      setTimeout(() => {
        setSaveMessage('');
      }, 2000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(
        saveMessageTimerRef.current
      );
    };
  }, []);


  /* ========================================
     반복 값 검증
  ======================================== */

  const getSafeRepeatInterval =
    () => {
      const value = Number(
        repeatIntervalWeeks
      );

      if (
        !Number.isFinite(value)
      ) {
        return 1;
      }

      return Math.max(
        1,
        Math.min(100, value)
      );
    };

  const getSafeRepeatCount = () => {
    const value =
      Number(repeatCount);

    if (
      !Number.isFinite(value)
    ) {
      return null;
    }

    return Math.max(
      1,
      Math.min(100, value)
    );
  };


  /* ========================================
     Request Body
  ======================================== */

  const buildRequestBody = () => {
    const category =
      selectedEvent === 'swim'
        ? 'SWIM'
        : 'CLINIC';

    const apiEndType =
      isRepeat
        ? mapUiEndTypeToApi(
            repeatEndType
          )
        : null;

    return {
      category,

      start_datetime:
        `${selectedDateKey}T${startTime}:00`,

      end_datetime:
        `${selectedDateKey}T${endTime}:00`,

      memo:
        memo.trim() || null,

      is_repeat:
        isRepeat,

      repeat_interval_weeks:
        isRepeat
          ? getSafeRepeatInterval()
          : null,

      repeat_end_type:
        apiEndType,

      repeat_count:
        isRepeat &&
        repeatEndType === 'count'
          ? getSafeRepeatCount()
          : null,

      repeat_until:
        isRepeat &&
        repeatEndType === 'date'
          ? formatDateForInput(
              repeatEndDate
            )
          : null,
    };
  };


  /* ========================================
     저장
  ======================================== */

  const handleSave = async () => {
    if (
      isSaving ||
      !selectedEvent
    ) {
      return;
    }

    if (startTime >= endTime) {
      alert(
        '종료 시간은 시작 시간보다 늦어야 합니다.'
      );

      return;
    }

    if (
      isRepeat &&
      !repeatEndType
    ) {
      alert(
        '반복 종료 조건을 선택해 주세요.'
      );

      return;
    }

    if (
      isRepeat &&
      repeatEndType === 'count' &&
      !repeatCount
    ) {
      alert(
        '반복 횟수를 입력해 주세요.'
      );

      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const requestBody =
        buildRequestBody();

      const isEdit = Boolean(
        selectedScheduleId
      );

      const responseData = isEdit
        ? await updateSchedule(
            selectedScheduleId,
            requestBody
          )
        : await createSchedule(
            requestBody
          );

      console.log(
        isEdit
          ? '캘린더 일정 수정 성공:'
          : '캘린더 일정 등록 성공:',
        responseData
      );

      showSaveMessage();

      // 저장 성공 후 Main.jsx로 이동
      navigate('/home');
    } catch (error) {
      console.error(
        '캘린더 일정 저장 실패:',
        error
      );

      setErrorMessage(
        error?.message ||
          '일정 저장에 실패했습니다.'
      );

      alert(
        error?.message ||
          '일정 저장에 실패했습니다.'
      );
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <main className="calendar-page">

      {/* Header */}

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


      {/* Weekly Calendar */}

      <section className="calendar-weekly-section">
        <WeeklyCalendar
          key={selectedDateKey}
          schedules={schedules}
          selectedDate={selectedDate}
          onDateChange={
            handleDateChange
          }
        />
      </section>


      {/* Detail */}

      <section className="calendar-detail">

        <div className="calendar-selected-date">
          {formatDate(selectedDate)}
        </div>


        {/* 일정 */}

        <section className="calendar-detail-section">
          <h2>일정</h2>

          <div className="calendar-event-buttons">
            <button
              type="button"
              className={`calendar-event-button ${
                selectedEvent === 'swim'
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                handleEventSelect(
                  'swim'
                )
              }
            >
              수영
            </button>

            <button
              type="button"
              className={`calendar-event-button ${
                selectedEvent === 'clinic'
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                handleEventSelect(
                  'clinic'
                )
              }
            >
              클리닉
            </button>
          </div>
        </section>


        {/* 시간 */}

        <section className="calendar-detail-section">
          <h2>시간</h2>

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


        {/* 반복 */}

        <section className="calendar-detail-section">
          <div className="calendar-repeat-header">
            <h2>반복</h2>

            <button
              type="button"
              className={`calendar-repeat-toggle ${
                isRepeat
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setIsRepeat(
                  (prev) => !prev
                )
              }
              aria-label="반복 설정"
              aria-pressed={isRepeat}
            >
              <span />
            </button>
          </div>

          {isRepeat && (
            <div className="calendar-repeat-content">

              <div className="calendar-repeat-rule">
                <input
                  type="text"
                  className="repeat-number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={3}
                  value={
                    repeatIntervalWeeks
                  }
                  onChange={(event) => {
                    const value =
                      event.target
                        .value
                        .replace(
                          /\D/g,
                          ''
                        );

                    setRepeatIntervalWeeks(
                      value
                    );
                  }}
                  onBlur={() => {
                    const value = Number(
                      repeatIntervalWeeks
                    );

                    if (
                      !repeatIntervalWeeks ||
                      value < 1
                    ) {
                      setRepeatIntervalWeeks(
                        '1'
                      );

                      return;
                    }

                    if (value > 100) {
                      setRepeatIntervalWeeks(
                        '100'
                      );
                    }
                  }}
                  aria-label="반복 주기"
                />

                <span>
                  {repeatType}
                </span>
              </div>


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


              {repeatEndType ===
                'count' && (
                <div className="calendar-repeat-value">
                  <span>총</span>

                  <input
                    type="text"
                    className="repeat-number repeat-count-input"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={3}
                    value={repeatCount}
                    onChange={(event) => {
                      const value =
                        event.target
                          .value
                          .replace(
                            /\D/g,
                            ''
                          );

                      setRepeatCount(
                        value
                      );
                    }}
                    onBlur={() => {
                      if (!repeatCount) {
                        setRepeatCount(
                          '1'
                        );

                        return;
                      }

                      const number =
                        Number(
                          repeatCount
                        );

                      if (number < 1) {
                        setRepeatCount(
                          '1'
                        );

                        return;
                      }

                      if (number > 100) {
                        setRepeatCount(
                          '100'
                        );
                      }
                    }}
                    aria-label="반복 횟수"
                  />

                  <span>번</span>
                </div>
              )}


              {repeatEndType ===
                'date' && (
                <div className="calendar-repeat-date">
                  <button
                    type="button"
                    className="calendar-repeat-date-trigger"
                    onClick={() =>
                      setIsDatePickerOpen(
                        (prev) => !prev
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

                  {isDatePickerOpen && (
                    <div className="calendar-wheel-picker">
                      <div className="calendar-wheel-selected-line" />

                      <WheelColumn
                        values={
                          YEAR_OPTIONS
                        }
                        selectedValue={
                          repeatEndYear
                        }
                        onChange={(year) =>
                          updateRepeatEndDate({
                            year,
                          })
                        }
                        renderValue={(year) =>
                          `${year}년`
                        }
                        ariaLabel="연도 선택"
                      />

                      <WheelColumn
                        values={
                          MONTH_OPTIONS
                        }
                        selectedValue={
                          repeatEndMonth
                        }
                        onChange={(month) =>
                          updateRepeatEndDate({
                            month,
                          })
                        }
                        renderValue={(month) =>
                          `${String(
                            month
                          ).padStart(
                            2,
                            '0'
                          )}월`
                        }
                        ariaLabel="월 선택"
                      />

                      <WheelColumn
                        values={
                          repeatEndDayOptions
                        }
                        selectedValue={
                          repeatEndDay
                        }
                        onChange={(day) =>
                          updateRepeatEndDate({
                            day,
                          })
                        }
                        renderValue={(day) =>
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


        {/* 메모 */}

        <section className="calendar-detail-section">
          <h2>메모</h2>

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


        {/* API 로딩·에러 */}

        {isLoading && (
          <p
            style={{
              margin: '10px 0 0',
              textAlign: 'center',
              fontSize: '12px',
            }}
          >
            일정을 불러오는 중입니다.
          </p>
        )}

        {errorMessage && (
          <p
            role="alert"
            style={{
              margin: '10px 0 0',
              textAlign: 'center',
              fontSize: '12px',
              color: '#d33',
            }}
          >
            {errorMessage}
          </p>
        )}


        {/* 저장 */}

        <button
          type="button"
          className="calendar-save-button"
          onClick={handleSave}
          disabled={
            isSaving ||
            !selectedEvent
          }
        >
          {isSaving
            ? '저장 중...'
            : '저장'}
        </button>

        {saveMessage && (
          <p
            style={{
              margin: '10px 0 0',
              textAlign: 'center',
              fontSize: '12px',
              color: '#0068F5',
            }}
          >
            {saveMessage}
          </p>
        )}
      </section>
    </main>
  );
}

export default Calendar;