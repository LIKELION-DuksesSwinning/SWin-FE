import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MonthlyCalendar from './MonthlyCalendar/MonthlyCalendar';
import ArchiveBtn from './ArchiveBtn/ArchiveBtn';
import RecordList from './RecordList/RecordList';

import alertActivated from '../../assets/images/alert-activated.svg';
import alertDeactivated from '../../assets/images/alert-deactivated.svg';

import './Main.css';

const DEMO_RECORDS = [
  { id: 1, date: '2026-08-17' },
  { id: 2, date: '2026-08-15' },
  { id: 3, date: '2026-08-14' },
  { id: 4, date: '2026-08-12' },
  { id: 5, date: '2026-08-01' },
  { id: 6, date: '2026-07-29' },
  { id: 7, date: '2026-07-26' },
  { id: 8, date: '2026-07-22' },
  { id: 9, date: '2026-07-18' },
  { id: 10, date: '2026-07-15' },
];

function Main() {
  const navigate = useNavigate();

  // TODO:
  // 추후 알림 API 연동 시 실제 읽지 않은 알림 여부로 변경
  const [hasUnreadAlert] = useState(true);

  return (
    <main className="main-page">

      {/* ================================
          Header
      ================================= */}

      <header className="main-header">

        <div className="main-greeting">

          <p className="main-greeting-small">
            안녕하세요, 멋사님
          </p>

          <h1>
            나의 피부 상태를 기록하고,
            <br />
            지속 가능한 수영 생활을 시작해 보세요.
          </h1>

        </div>


        {/* ================================
            Notification
        ================================= */}

        <button
          type="button"
          className="main-notification-button"
          onClick={() => navigate('/alert')}
          aria-label="알림"
        >
          <img
            src={
              hasUnreadAlert
                ? alertActivated
                : alertDeactivated
            }
            alt="알림"
            className="main-notification-icon"
          />
        </button>

      </header>


      {/* ================================
          Monthly Calendar
      ================================= */}

      <section className="main-calendar-section">
        <MonthlyCalendar />
      </section>


      {/* ================================
          Swim Before / After Record
      ================================= */}

      <ArchiveBtn />


      {/* ================================
          My Swim Records
      ================================= */}

    <RecordList records={DEMO_RECORDS} />

    </main>
  );
}

export default Main;