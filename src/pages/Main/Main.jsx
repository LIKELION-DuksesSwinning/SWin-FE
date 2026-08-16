import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MonthlyCalendar from './MonthlyCalendar/MonthlyCalendar';
import ArchiveBtn from './ArchiveBtn/ArchiveBtn';

import alertActivated from '../../assets/images/alert-activated.svg';
import alertDeactivated from '../../assets/images/alert-deactivated.svg';

import './Main.css';

function Main() {
  const navigate = useNavigate();

  // TODO:
  // 나중에 알림 API를 연동하면
  // 읽지 않은 알림이 있는지 API 결과로 변경
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
          상세 기능은 다음 이슈에서 구현
      ================================= */}

      <section className="main-record-section">

        <div className="main-record-header">

          <h2>
            내 수영 기록
          </h2>

          <button
            type="button"
            className="main-filter-button"
            aria-label="정렬"
          >
            ☷
          </button>

        </div>


        {/* ================================
            Empty State
        ================================= */}

        <div className="main-record-empty">

          <div
            className="main-record-empty-icon"
            aria-hidden="true"
          >
            ≋
          </div>

          <p className="main-record-empty-title">
            아직 수영 기록이 없어요.
          </p>

          <p className="main-record-empty-description">
            수영을 기록하면
            <br />
            AI 맞춤 분석을 받을 수 있어요.
          </p>

        </div>


        {/* ================================
            More
        ================================= */}

        <button
          type="button"
          className="main-more-button"
        >
          <span>
            더보기
          </span>

          <span aria-hidden="true">
            ⌄
          </span>
        </button>

      </section>

    </main>
  );
}

export default Main;