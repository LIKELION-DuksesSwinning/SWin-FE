import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import MonthlyCalendar from './MonthlyCalendar/MonthlyCalendar';
import ArchiveBtn from './ArchiveBtn/ArchiveBtn';
import RecordList from './RecordList/RecordList';

import alertActivated from '../../assets/images/alert-activated.svg';
import alertDeactivated from '../../assets/images/alert-deactivated.svg';

import {
  getSwimRecords,
} from '../../api/records';

import {
  getNotifications,
} from '../../api/notifications';

import './Main.css';


function Main() {
  const navigate =
    useNavigate();


  const [
    records,
    setRecords,
  ] = useState([]);


  /* ========================================
     읽지 않은 알림 여부
  ======================================== */

  const [
    hasUnreadAlert,
    setHasUnreadAlert,
  ] = useState(false);


  const [
    isLoadingRecords,
    setIsLoadingRecords,
  ] = useState(true);


  const userName =
    localStorage.getItem(
      'userName'
    ) || '멋사님';


  /* ========================================
     수영 기록 조회
  ======================================== */

  useEffect(() => {
    let isMounted = true;


    const loadRecords =
      async () => {
        setIsLoadingRecords(
          true
        );

        try {
          const data =
            await getSwimRecords(
              'latest'
            );


          const nextRecords =
            Array.isArray(
              data?.records
            )
              ? data.records.map(
                  (record) => ({
                    id:
                      record.record_id,

                    date:
                      record.created_at
                        ?.split('T')[0] ||
                      '',

                    timing:
                      record.timing,

                    photoUrl:
                      record.photo_url,

                    swimTime:
                      record.swim_time,

                    symptoms:
                      record.symptoms ||
                      [],

                    memo:
                      record.memo ||
                      '',
                  })
                )
              : [];


          if (isMounted) {
            setRecords(
              nextRecords
            );
          }
        } catch (error) {
          console.error(
            '수영 기록 목록 조회 실패:',
            error
          );


          if (isMounted) {
            setRecords([]);
          }
        } finally {
          if (isMounted) {
            setIsLoadingRecords(
              false
            );
          }
        }
      };


    loadRecords();


    return () => {
      isMounted = false;
    };
  }, []);


  /* ========================================
     알림 조회

     읽지 않은 알림이 하나라도 있으면
     활성화 아이콘 표시
  ======================================== */

  useEffect(() => {
    let isMounted = true;


    const loadNotifications =
      async () => {
        try {
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


          const hasUnread =
            notificationList.some(
              (notification) =>
                notification.is_read ===
                false
            );


          if (isMounted) {
            setHasUnreadAlert(
              hasUnread
            );
          }
        } catch (error) {
          console.error(
            '알림 목록 조회 실패:',
            error
          );


          /*
           * 알림 API를 가져오지 못했을 때는
           * 안전하게 비활성화 아이콘 표시
           */
          if (isMounted) {
            setHasUnreadAlert(
              false
            );
          }
        }
      };


    loadNotifications();


    return () => {
      isMounted = false;
    };
  }, []);


  /* ========================================
     화면으로 돌아왔을 때
     알림 상태 다시 확인

     예:
     홈 → 알림 → 알림 클릭(읽음)
        → 뒤로가기 → 홈
  ======================================== */

  useEffect(() => {
    const handleFocus =
      () => {
        const loadNotifications =
          async () => {
            try {
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


              const hasUnread =
                notificationList.some(
                  (notification) =>
                    notification.is_read ===
                    false
                );


              setHasUnreadAlert(
                hasUnread
              );
            } catch (error) {
              console.error(
                '알림 상태 갱신 실패:',
                error
              );
            }
          };


        loadNotifications();
      };


    window.addEventListener(
      'focus',
      handleFocus
    );


    return () => {
      window.removeEventListener(
        'focus',
        handleFocus
      );
    };
  }, []);


  return (
    <main className="main-page">

      {/* Header */}

      <header className="main-header">

        <div className="main-greeting">

          <p className="main-greeting-small">
            안녕하세요, {userName}
          </p>


          <h1>
            나의 피부 상태를 기록하고,
            <br />
            지속 가능한 수영 생활을 시작해 보세요.
          </h1>

        </div>


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


      {/* Calendar */}

      <section className="main-calendar-section">

        <MonthlyCalendar />

      </section>


      {/* 수영 전/후 기록 */}

      <ArchiveBtn />


      {/* 기록 */}

      {!isLoadingRecords && (
        <RecordList
          records={records}
        />
      )}

    </main>
  );
}


export default Main;