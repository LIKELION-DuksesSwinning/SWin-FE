import {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import prevBtn from '../../assets/images/prev-btn.svg';

import {
  getNotifications,
  markNotificationAsRead,
} from '../../api/notifications';

import './Alert.css';


/* ========================================
   날짜 표시 변환

   백엔드:
   2026-08-07T11:00:00

   화면:
   2026년 8월 7일 오전 11시
======================================== */

const formatNotificationDate = (
  createdAt
) => {
  if (!createdAt) {
    return '';
  }

  const date =
    new Date(createdAt);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return createdAt;
  }

  const year =
    date.getFullYear();

  const month =
    date.getMonth() + 1;

  const day =
    date.getDate();

  const hour =
    date.getHours();

  const minute =
    date.getMinutes();

  const period =
    hour < 12
      ? '오전'
      : '오후';

  const displayHour =
    hour % 12 || 12;

  const paddedMinute =
    String(minute).padStart(
      2,
      '0'
    );

  return `${year}년 ${month}월 ${day}일 ${period} ${displayHour}시 ${paddedMinute}분`;
};


/* ========================================
   알림 데이터 변환

   API → 화면에서 사용하는 구조
======================================== */

const mapNotification =
  (notification) => ({
    id:
      notification.id,

    category:
      notification.category,

    categoryDisplay:
      notification.category_display,

    title:
      notification.title,

    content:
      notification.content,

    isRead:
      notification.is_read,

    createdAt:
      notification.created_at,

    date:
      formatNotificationDate(
        notification.created_at
      ),
  });


function Alert() {
  const navigate =
    useNavigate();


  const [
    alerts,
    setAlerts,
  ] = useState([]);


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState('');


  /* ========================================
     알림 목록 조회
  ======================================== */

  useEffect(() => {
    const loadNotifications =
      async () => {
        try {
          setIsLoading(
            true
          );

          setError('');


          const data =
            await getNotifications();


          /*
           * GET 응답은 배열
           */
          const notificationList =
            Array.isArray(data)
              ? data
              : data?.notifications ||
                [];


          setAlerts(
            notificationList.map(
              mapNotification
            )
          );
        } catch (error) {
          console.error(
            '알림 목록 조회 실패:',
            error
          );

          setError(
            error?.message ||
              '알림을 불러오지 못했습니다.'
          );
        } finally {
          setIsLoading(
            false
          );
        }
      };


    loadNotifications();
  }, []);


  /* ========================================
     뒤로가기
  ======================================== */

  const handleBack =
    () => {
      navigate(-1);
    };


  /* ========================================
     알림 클릭
     → 읽음 처리 API
  ======================================== */

  const handleAlertClick =
    async (
      alert
    ) => {
      /*
       * 이미 읽은 알림이면
       * API 호출하지 않음
       */
      if (alert.isRead) {
        return;
      }


      /*
       * 화면 먼저 읽음 상태로 변경
       */
      setAlerts(
        (prev) =>
          prev.map(
            (item) =>
              item.id ===
              alert.id
                ? {
                    ...item,
                    isRead:
                      true,
                  }
                : item
          )
      );


      try {
        await markNotificationAsRead(
          alert.id
        );
      } catch (error) {
        console.error(
          '알림 읽음 처리 실패:',
          error
        );


        /*
         * API 실패 시
         * 화면 상태 원복
         */
        setAlerts(
          (prev) =>
            prev.map(
              (item) =>
                item.id ===
                alert.id
                  ? {
                      ...item,
                      isRead:
                        false,
                    }
                  : item
            )
        );
      }
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
            alt="이전"
          />
        </button>


        <h1>
          알림
        </h1>

      </header>


      {/* ================================
          Loading
      ================================= */}

      {isLoading && (
        <section className="alert-list">
          <div className="alert-empty">
            알림을 불러오는 중입니다.
          </div>
        </section>
      )}


      {/* ================================
          Error
      ================================= */}

      {!isLoading &&
        error && (
          <section className="alert-list">
            <div className="alert-empty alert-error">
              {error}
            </div>
          </section>
        )}


      {/* ================================
          Empty
      ================================= */}

      {!isLoading &&
        !error &&
        alerts.length === 0 && (
          <section className="alert-list">
            <div className="alert-empty">
              새로운 알림이 없습니다.
            </div>
          </section>
        )}


      {/* ================================
          Alert List
      ================================= */}

      {!isLoading &&
        !error &&
        alerts.length > 0 && (
          <section className="alert-list">

            {alerts.map(
              (alert) => (
                <button
                  key={alert.id}
                  type="button"
                  className={`alert-item ${
                    alert.isRead
                      ? 'read'
                      : 'unread'
                  }`}
                  onClick={() =>
                    handleAlertClick(
                      alert
                    )
                  }
                >

                  <span className="alert-title">
                    {alert.title}
                  </span>


                  <span className="alert-content">
                    {alert.content}
                  </span>


                  <span className="alert-date">
                    {alert.date}
                  </span>

                </button>
              )
            )}

          </section>
        )}

    </main>
  );
}

export default Alert;