import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import prevBtn from '../../assets/images/prev-btn.svg';

import {
  getNotifications,
  markNotificationAsRead,
} from '../../api/notifications';

import './Alert.css';

/* ========================================
   날짜 표시 변환
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
   API → 화면 데이터 변환
======================================== */

const mapNotification = (
  notification
) => {
  const createdAt =
    notification?.created_at ??
    notification?.createdAt ??
    '';

  return {
    id:
      notification?.id,

    category:
      notification?.category ?? null,

    categoryDisplay:
      notification?.category_display ??
      notification?.categoryDisplay ??
      '',

    title:
      notification?.title ?? '',

    content:
      notification?.content ?? '',

    isRead:
      Boolean(
        notification?.is_read ??
        notification?.isRead ??
        false
      ),

    createdAt,

    date:
      formatNotificationDate(
        createdAt
      ),
  };
};

/* ========================================
   응답에서 알림 배열 추출
======================================== */

const getNotificationList = (
  response
) => {
  if (
    Array.isArray(response)
  ) {
    return response;
  }

  if (
    Array.isArray(
      response?.notifications
    )
  ) {
    return response.notifications;
  }

  if (
    Array.isArray(
      response?.data?.notifications
    )
  ) {
    return response.data.notifications;
  }

  if (
    Array.isArray(
      response?.data
    )
  ) {
    return response.data;
  }

  return [];
};

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

          const response =
            await getNotifications();

          const notificationList =
            getNotificationList(
              response
            );

          setAlerts(
            notificationList.map(
              mapNotification
            )
          );
        } catch (loadError) {
          console.error(
            '알림 목록 조회 실패:',
            loadError
          );

          setError(
            loadError?.message ||
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

  const handleBack = () => {
    navigate(-1);
  };

  /* ========================================
     알림 클릭
  ======================================== */

  const handleAlertClick =
    async (
      alert
    ) => {
      const wasUnread =
        !alert.isRead;

      const updatedAlert = {
        ...alert,
        isRead: true,
      };

      try {
        if (wasUnread) {
          setAlerts(
            (prevAlerts) =>
              prevAlerts.map(
                (item) =>
                  item.id === alert.id
                    ? updatedAlert
                    : item
              )
          );

          await markNotificationAsRead(
            alert.id
          );
        }

        navigate(
          `/alert/${alert.id}`,
          {
            state: {
              alert: updatedAlert,
            },
          }
        );
      } catch (readError) {
        console.error(
          '알림 읽음 처리 실패:',
          readError
        );

        if (wasUnread) {
          setAlerts(
            (prevAlerts) =>
              prevAlerts.map(
                (item) =>
                  item.id === alert.id
                    ? {
                        ...item,
                        isRead: false,
                      }
                    : item
              )
          );
        }

        navigate(
          `/alert/${alert.id}`,
          {
            state: {
              alert,
            },
          }
        );
      }
    };

  return (
    <main className="alert-page">
      {/* Header */}
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

        <h1>알림</h1>
      </header>

      {/* Loading */}
      {isLoading && (
        <section className="alert-list">
          <div className="alert-empty">
            알림을 불러오는 중입니다.
          </div>
        </section>
      )}

      {/* Error */}
      {!isLoading &&
        error && (
          <section className="alert-list">
            <div className="alert-empty alert-error">
              {error}
            </div>
          </section>
        )}

      {/* Empty */}
      {!isLoading &&
        !error &&
        alerts.length === 0 && (
          <section className="alert-list">
            <div className="alert-empty">
              새로운 알림이 없습니다.
            </div>
          </section>
        )}

      {/* Alert List */}
      {!isLoading &&
        !error &&
        alerts.length > 0 && (
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
            ))}
          </section>
        )}
    </main>
  );
}

export default Alert;