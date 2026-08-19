import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import prevBtn from '../../assets/images/prev-btn.svg';

import {
  getNotifications,
  markNotificationAsRead,
} from '../../api/notifications';

import './Alert.css';

function Alert() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 알림 불러오기
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await getNotifications();

        const notificationList =
          response?.data?.notifications ??
          response?.data ??
          [];

        const formattedAlerts = notificationList.map((notification) => ({
          id: notification.id,
          title: notification.title ?? '',
          content: notification.content ?? '',
          date: notification.createdAt ?? notification.created_at ?? '',
          isRead: notification.isRead ?? notification.is_read ?? false,
        }));

        setAlerts(formattedAlerts);
      } catch (err) {
        console.error('알림 조회 실패:', err);
        setError('알림을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  // 알림 클릭
  const handleAlertClick = async (alert) => {
    try {
      if (!alert.isRead) {
        await markNotificationAsRead(alert.id);

        setAlerts((prevAlerts) =>
          prevAlerts.map((item) =>
            item.id === alert.id
              ? { ...item, isRead: true }
              : item
          )
        );
      }
    } catch (err) {
      console.error('알림 읽음 처리 실패:', err);
    }
  };

  // 날짜 표시
  const formatDate = (date) => {
    if (!date) return '';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
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
            alt=""
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
      {!isLoading && error && (
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
          <section className="alert-list">

            {alerts.map((alert) => (
              <button
                key={alert.id}
                type="button"
                className={`alert-item ${
                  alert.isRead ? 'read' : 'unread'
                }`}
                onClick={() => handleAlertClick(alert)}
              >
                <span className="alert-title">
                  {alert.title}
                </span>

                <span className="alert-content">
                  {alert.content}
                </span>

                <span className="alert-date">
                  {formatDate(alert.date)}
                </span>
              </button>
            ))}

          </section>
        )}
    </main>
  );
}

export default Alert;