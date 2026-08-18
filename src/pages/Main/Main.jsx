import {
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import MonthlyCalendar from './MonthlyCalendar/MonthlyCalendar';
import ArchiveBtn from './ArchiveBtn/ArchiveBtn';
import RecordList from './RecordList/RecordList';

import alertActivated from '../../assets/images/alert-activated.svg';
import alertDeactivated from '../../assets/images/alert-deactivated.svg';

import './Main.css';


const DEMO_RECORDS = [
  {
    id: 1,
    date: '2026-08-17',
  },
  {
    id: 2,
    date: '2026-08-15',
  },
  {
    id: 3,
    date: '2026-08-14',
  },
  {
    id: 4,
    date: '2026-08-12',
  },
  {
    id: 5,
    date: '2026-08-01',
  },
  {
    id: 6,
    date: '2026-07-29',
  },
  {
    id: 7,
    date: '2026-07-26',
  },
  {
    id: 8,
    date: '2026-07-22',
  },
  {
    id: 9,
    date: '2026-07-18',
  },
  {
    id: 10,
    date: '2026-07-15',
  },
];


const INITIAL_ALERTS = [
  {
    id: 1,
    isRead: false,
  },
  {
    id: 2,
    isRead: false,
  },
  {
    id: 3,
    isRead: true,
  },
  {
    id: 4,
    isRead: true,
  },
  {
    id: 5,
    isRead: true,
  },
  {
    id: 6,
    isRead: true,
  },
  {
    id: 7,
    isRead: false,
  },
  {
    id: 8,
    isRead: true,
  },
  {
    id: 9,
    isRead: false,
  },
  {
    id: 10,
    isRead: true,
  },
];


const READ_ALERTS_KEY =
  'swinning-read-alert-ids';


/* ========================================
   읽은 알림 ID 가져오기
======================================== */

const getReadAlertIds = () => {
  try {
    const saved =
      localStorage.getItem(
        READ_ALERTS_KEY
      );

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      '읽은 알림 상태를 불러오지 못했습니다.',
      error
    );

    return [];
  }
};


function Main() {
  const navigate = useNavigate();


  const [
    hasUnreadAlert,
    setHasUnreadAlert,
  ] = useState(true);


  /* ========================================
     읽지 않은 알림 여부 확인
  ======================================== */

  useEffect(() => {
    const readAlertIds =
      getReadAlertIds();


    const hasUnread =
      INITIAL_ALERTS.some(
        (alert) =>
          !(
            alert.isRead ||
            readAlertIds.includes(
              alert.id
            )
          )
      );


    setHasUnreadAlert(
      hasUnread
    );
  }, []);


  /* ========================================
     Main 진입 시 localStorage 상태 재확인

     다른 페이지에서 읽음 처리한 뒤
     /home으로 돌아왔을 때 반영
  ======================================== */

  useEffect(() => {
    const handleStorageChange = () => {

      const readAlertIds =
        getReadAlertIds();


      const hasUnread =
        INITIAL_ALERTS.some(
          (alert) =>
            !(
              alert.isRead ||
              readAlertIds.includes(
                alert.id
              )
            )
        );


      setHasUnreadAlert(
        hasUnread
      );
    };


    window.addEventListener(
      'storage',
      handleStorageChange
    );


    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange
      );
    };
  }, []);


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
          onClick={() =>
            navigate('/alert')
          }
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

      <RecordList
        records={DEMO_RECORDS}
      />

    </main>
  );
}


export default Main;