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

import './Main.css';


function Main() {
  const navigate =
    useNavigate();


  const [
    records,
    setRecords,
  ] = useState([]);


  const [
    hasUnreadAlert,
  ] = useState(true);


  const [
    isLoadingRecords,
    setIsLoadingRecords,
  ] = useState(true);


  const userName =
    localStorage.getItem(
      'userName'
    ) || '멋사님';


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