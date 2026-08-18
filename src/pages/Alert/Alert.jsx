import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import prevBtn from '../../assets/images/prev-btn.svg';

import './Alert.css';


const INITIAL_ALERTS = [
  {
    id: 1,
    title: '수영 기록 미완료',
    date: '2026년 8월 10일 오후 1시',
    isRead: false,
  },
  {
    id: 2,
    title: 'AAC 클리닉 예약 안내',
    date: '2026년 8월 9일 오전 10시',
    isRead: false,
  },
  {
    id: 3,
    title: '내일 수영이 예정되어 있어요',
    date: '2026년 8월 9일 오전 9시',
    isRead: true,
  },
  {
    id: 4,
    title: '내일 수영이 예정되어 있어요',
    date: '2026년 8월 8일 오전 9시',
    isRead: true,
  },
  {
    id: 5,
    title: '내일 수영이 예정되어 있어요',
    date: '2026년 8월 7일 오전 9시',
    isRead: true,
  },
  {
    id: 6,
    title: '내일 수영이 예정되어 있어요',
    date: '2026년 8월 6일 오전 9시',
    isRead: true,
  },
  {
    id: 7,
    title: '주간 리포트 도착',
    date: '2026년 8월 3일 오전 9시',
    isRead: false,
  },
  {
    id: 8,
    title: '시스템 점검',
    date: '2026년 8월 1일 오후 1시',
    isRead: true,
  },
  {
    id: 9,
    title: '주간 리포트 도착',
    date: '2026년 7월 27일 오전 9시',
    isRead: false,
  },
  {
    id: 10,
    title: '내일 수영이 예정되어 있어요',
    date: '2026년 7월 25일 오전 9시',
    isRead: true,
  },
];


function Alert() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState(
    INITIAL_ALERTS
  );


  /* ========================================
     뒤로가기
  ======================================== */

  const handleBack = () => {
    navigate(-1);
  };


  /* ========================================
     알림 클릭
     → 읽음 처리
     → 상세 알림 페이지 이동
  ======================================== */

  const handleAlertClick = (alertId) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              isRead: true,
            }
          : alert
      )
    );

    navigate(`/alert/${alertId}`);
  };


  return (
    <main className="alert-page">

      {/* ================================
          Header
      ================================= */}

      <header className="alert-header">

        <button
          type="button"
          className="alert-back-button"
          onClick={handleBack}
          aria-label="이전"
        >
          <img
            src={prevBtn}
            alt=""
          />
        </button>


        <h1>
          알림
        </h1>

      </header>


      {/* ================================
          Alert List
      ================================= */}

      <section
        className="alert-list"
        aria-label="알림 목록"
      >

        {alerts.map((alert) => (
          <button
            key={alert.id}
            type="button"
            className={`alert-item ${
              alert.isRead
                ? 'read'
                : 'unread'
            }`}
            onClick={() =>
              handleAlertClick(alert.id)
            }
          >

            <span className="alert-title">
              {alert.title}
            </span>


            <span className="alert-date">
              {alert.date}
            </span>

          </button>
        ))}

      </section>

    </main>
  );
}


export default Alert;