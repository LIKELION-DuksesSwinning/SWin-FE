import { useEffect, useState } from 'react';
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar';

import './Calendar.css';

const parseDateParam = (dateParam) => {
  if (!dateParam) {
    return new Date(2026, 7, 14);
  }

  const [year, month, day] = dateParam
    .split('-')
    .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return new Date(2026, 7, 14);
  }

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  // 잘못된 날짜 방지
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return new Date(2026, 7, 14);
  }

  return parsedDate;
};

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

function Calendar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dateParam = searchParams.get('date');

  const [selectedDate, setSelectedDate] =
    useState(() =>
      parseDateParam(dateParam)
    );

  const [selectedEvent, setSelectedEvent] =
    useState('');

  const [startTime, setStartTime] =
    useState('10:00');

  const [endTime, setEndTime] =
    useState('11:00');

  const [isRepeat, setIsRepeat] =
    useState(false);

  const [repeatType, setRepeatType] =
    useState('주마다');

  const [repeatEndType, setRepeatEndType] =
    useState('');

  const [repeatCount, setRepeatCount] =
    useState('10');

  const [repeatEndDate, setRepeatEndDate] =
    useState(
      new Date(2027, 7, 14)
    );

  const [memo, setMemo] =
    useState('');

  // ========================================
  // URL의 date가 바뀌면 선택 날짜도 변경
  // ========================================

  useEffect(() => {
    setSelectedDate(
      parseDateParam(dateParam)
    );
  }, [dateParam]);

  // ========================================
  // WeeklyCalendar 날짜 변경
  // ========================================

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // ========================================
  // 이전
  // ========================================

  const handleBack = () => {
    navigate(-1);
  };

  // ========================================
  // 저장
  // 현재는 UI 확인용
  // 다음 이슈에서 실제 API 연결
  // ========================================

  const handleSave = () => {
    const calendarData = {
      date: formatDate(selectedDate),
      event: selectedEvent,
      startTime,
      endTime,
      repeat: isRepeat,
      repeatType: isRepeat
        ? repeatType
        : null,
      repeatEndType: isRepeat
        ? repeatEndType
        : null,
      repeatCount:
        isRepeat &&
        repeatEndType === 'count'
          ? Number(repeatCount)
          : null,
      repeatEndDate:
        isRepeat &&
        repeatEndType === 'date'
          ? formatDate(repeatEndDate)
          : null,
      memo,
    };

    console.log(
      '캘린더 일정 저장:',
      calendarData
    );

    // TODO:
    // 다음 이슈에서 실제 일정 등록 API 연결
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
          ‹
        </button>

        <h1 className="calendar-title">
          캘린더
        </h1>

      </header>


      {/* ================================
          Weekly Calendar
      ================================= */}

      <section className="calendar-weekly-section">

        <WeeklyCalendar
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

      </section>


      {/* ================================
          Selected Date
      ================================= */}

      <section className="calendar-detail">

        <div className="calendar-selected-date">
          {formatDate(selectedDate)}
        </div>


        {/* ================================
            일정
        ================================= */}

        <div className="calendar-detail-section">

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
                setSelectedEvent('swim')
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
                setSelectedEvent('clinic')
              }
            >
              클리닉
            </button>

          </div>

        </div>


        {/* ================================
            시간
        ================================= */}

        <div className="calendar-detail-section">

          <h2>시간</h2>

          <div className="calendar-time-row">

            <div className="calendar-time-group">

              <span>
                {formatDate(selectedDate)}
              </span>

              <label>

                <span className="calendar-time-prefix">
                  오전
                </span>

                <input
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(
                      event.target.value
                    )
                  }
                />

              </label>

            </div>


            <span className="calendar-time-arrow">
              →
            </span>


            <div className="calendar-time-group">

              <span>
                {formatDate(selectedDate)}
              </span>

              <label>

                <span className="calendar-time-prefix">
                  오전
                </span>

                <input
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(
                      event.target.value
                    )
                  }
                />

              </label>

            </div>

          </div>

        </div>


        {/* ================================
            반복
        ================================= */}

        <div className="calendar-detail-section">

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
            >
              <span />
            </button>

          </div>


          {isRepeat && (
            <div className="calendar-repeat-content">

              <div className="calendar-repeat-rule">

                <span className="repeat-number">
                  1
                </span>

                <button
                  type="button"
                  className="repeat-type-button"
                >
                  {repeatType}
                </button>

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
                    repeatEndType === 'count'
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
                    repeatEndType === 'date'
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


              {repeatEndType === 'count' && (
                <div className="calendar-repeat-value">

                  <span>총</span>

                  <input
                    type="number"
                    min="1"
                    value={repeatCount}
                    onChange={(event) =>
                      setRepeatCount(
                        event.target.value
                      )
                    }
                  />

                  <span>번</span>

                </div>
              )}


              {repeatEndType === 'date' && (
                <div className="calendar-repeat-date">

                  <input
                    type="date"
                    value={formatDateForInput(
                      repeatEndDate
                    )}
                    onChange={(event) => {
                      const [
                        year,
                        month,
                        day,
                      ] = event.target.value
                        .split('-')
                        .map(Number);

                      setRepeatEndDate(
                        new Date(
                          year,
                          month - 1,
                          day
                        )
                      );
                    }}
                  />

                </div>
              )}

            </div>
          )}

        </div>


        {/* ================================
            메모
        ================================= */}

        <div className="calendar-detail-section">

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

        </div>


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