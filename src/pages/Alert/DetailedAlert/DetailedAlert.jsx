import {
    useEffect,
    useMemo,
    useState,
  } from 'react';
  
  import {
    useLocation,
    useNavigate,
    useParams,
  } from 'react-router-dom';
  
  import prevBtn from '../../../assets/images/prev-btn.svg';
  
  import {
    getNotifications,
    markNotificationAsRead,
  } from '../../../api/notifications';
  
  import './DetailedAlert.css';
  
  
  /* ========================================
     날짜 표시
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
  
    return `${year}년 ${month}월 ${day}일 ${period} ${displayHour}시 ${paddedMinute}`;
  };
  
  
  /* ========================================
     API 알림 데이터 → 상세 데이터
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
  
  
  /* ========================================
     카테고리 → 화면 이동
  ======================================== */
  
  const getActionInfo =
    (category) => {
      switch (category) {
  
        case 'SWIM_RECORD':
          return {
            label:
              '기록 확인하기',
            path:
              '/home',
          };
  
  
        case 'SWIM_SCHEDULE':
          return {
            label:
              '일정 확인하기',
            path:
              '/calendar',
          };
  
  
        case 'CLINIC':
          return {
            label:
              '예약 내역 확인하기',
            path:
              '/clinic/history',
          };
  
  
        case 'REPORT':
          return {
            label:
              '리포트 확인하기',
            path:
              '/analysis',
          };
  
  
        default:
          return null;
      }
    };
  
  
  function DetailedAlert() {
    const navigate =
      useNavigate();
  
  
    const location =
      useLocation();
  
  
    const { alertId } =
      useParams();
  
  
    /* ========================================
       state로 넘어온 알림
    ======================================== */
  
    const stateAlert =
      location.state?.alert
        ? mapNotification(
            location.state.alert
          )
        : null;
  
  
    const [
      alert,
      setAlert,
    ] = useState(
      stateAlert
    );
  
  
    const [
      isLoading,
      setIsLoading,
    ] = useState(
      !stateAlert
    );
  
  
    const [
      error,
      setError,
    ] = useState('');
  
  
    /* ========================================
       알림 정보 조회
  
       API에 상세 조회 endpoint가 없으므로
       GET /notifications/ 후
       id로 하나를 찾는다.
    ======================================== */
  
    useEffect(() => {
      let isMounted = true;
  
  
      const loadNotification =
        async () => {
          try {
            /*
             * 이미 Alert 페이지에서
             * state를 전달받았다면
             * 화면은 바로 표시한다.
             *
             * 그래도 최신 데이터를
             * API에서 다시 가져온다.
             */
            if (
              !stateAlert
            ) {
              setIsLoading(
                true
              );
            }
  
  
            const data =
              await getNotifications();
  
  
            const notificationList =
              Array.isArray(data)
                ? data
                : Array.isArray(
                    data?.notifications
                  )
                ? data.notifications
                : [];
  
  
            const target =
              notificationList.find(
                (notification) =>
                  Number(
                    notification.id
                  ) ===
                  Number(
                    alertId
                  )
              );
  
  
            if (
              target &&
              isMounted
            ) {
              setAlert(
                mapNotification(
                  target
                )
              );
            }
  
  
            if (
              !target &&
              !stateAlert &&
              isMounted
            ) {
              setError(
                '알림을 찾을 수 없습니다.'
              );
            }
          } catch (error) {
            console.error(
              '알림 상세 조회 실패:',
              error
            );
  
  
            /*
             * state로 알림을 받은 경우에는
             * API 조회가 실패해도
             * 현재 내용을 보여준다.
             */
            if (
              !stateAlert &&
              isMounted
            ) {
              setError(
                error?.message ||
                  '알림을 불러오지 못했습니다.'
              );
            }
          } finally {
            if (
              isMounted
            ) {
              setIsLoading(
                false
              );
            }
          }
        };
  
  
      if (alertId) {
        loadNotification();
      }
  
  
      return () => {
        isMounted = false;
      };
    }, [
      alertId,
      stateAlert,
    ]);
  
  
    /* ========================================
       상세 페이지 진입
       → 읽음 처리
    ======================================== */
  
    useEffect(() => {
      const readNotification =
        async () => {
          if (
            !alertId ||
            !alert ||
            alert.isRead
          ) {
            return;
          }
  
  
          try {
            await markNotificationAsRead(
              alertId
            );
  
  
            setAlert(
              (prev) =>
                prev
                  ? {
                      ...prev,
                      isRead:
                        true,
                    }
                  : prev
            );
          } catch (error) {
            console.error(
              '알림 읽음 처리 실패:',
              error
            );
          }
        };
  
  
      readNotification();
    }, [
      alertId,
      alert,
    ]);
  
  
    /* ========================================
       액션 정보
    ======================================== */
  
    const actionInfo =
      useMemo(
        () =>
          getActionInfo(
            alert?.category
          ),
        [alert]
      );
  
  
    /* ========================================
       뒤로가기
    ======================================== */
  
    const handleBack =
      () => {
        navigate(-1);
      };
  
  
    /* ========================================
       Loading
    ======================================== */
  
    if (
      isLoading &&
      !alert
    ) {
      return (
        <main className="detailed-alert-page">
  
          <header className="detailed-alert-header">
  
            <button
              type="button"
              className="detailed-alert-back-button"
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
  
  
          <section className="detailed-alert-empty">
  
            <p>
              알림을 불러오는 중입니다.
            </p>
  
          </section>
  
        </main>
      );
    }
  
  
    /* ========================================
       Error / 없는 알림
    ======================================== */
  
    if (
      error ||
      !alert
    ) {
      return (
        <main className="detailed-alert-page">
  
          <header className="detailed-alert-header">
  
            <button
              type="button"
              className="detailed-alert-back-button"
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
  
  
          <section className="detailed-alert-empty">
  
            <p>
              {error ||
                '알림을 찾을 수 없습니다.'}
            </p>
  
          </section>
  
        </main>
      );
    }
  
  
    return (
      <main className="detailed-alert-page">
  
        {/* Header */}
  
        <header className="detailed-alert-header">
  
          <button
            type="button"
            className="detailed-alert-back-button"
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
  
  
        {/* Detail */}
  
        <article className="detailed-alert-content">
  
          <div className="detailed-alert-date">
            {alert.date}
          </div>
  
  
          <h2 className="detailed-alert-title">
            {alert.title}
          </h2>
  
  
          <div className="detailed-alert-type" />
  
  
          <p className="detailed-alert-message">
            {alert.content}
          </p>
  
  
          {/* 종류별 이동 버튼 */}
  
          {actionInfo && (
            <button
              type="button"
              className="detailed-alert-action"
              onClick={() =>
                navigate(
                  actionInfo.path
                )
              }
            >
              {actionInfo.label}
            </button>
          )}
  
        </article>
  
      </main>
    );
  }
  
  
  export default DetailedAlert;
