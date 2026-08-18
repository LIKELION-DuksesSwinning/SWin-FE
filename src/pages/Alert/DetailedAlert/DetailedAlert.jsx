import { useNavigate, useParams } from 'react-router-dom';

import prevBtn from '../../../assets/images/prev-btn.svg';

import './DetailedAlert.css';


/* ========================================
   임시 상세 알림 데이터

   TODO:
   백엔드 알림 상세 조회 API 연결 시
   이 부분을 API 응답으로 교체
======================================== */

const DETAILED_ALERTS = {
  1: {
    title: '수영 기록 미완료',
    date: '2026년 8월 10일 오후 1시',
    content:
      '수영 기록이 아직 완료되지 않았어요.\n수영 전 또는 수영 후 기록을 작성해 주세요.',
    type: 'record',
  },

  2: {
    title: 'AAC 클리닉 예약 안내',
    date: '2026년 8월 9일 오전 10시',
    content:
      '예약하신 AAC 클리닉 일정이 안내되었습니다.\n예약 일정을 확인해 주세요.',
    type: 'clinic',
  },

  3: {
    title: '내일 수영이 예정되어 있어요',
    date: '2026년 8월 9일 오전 9시',
    content:
      '내일 수영 일정이 예정되어 있어요.\n잊지 말고 수영을 준비해 주세요.',
    type: 'swimming',
  },

  4: {
    title: '내일 수영이 예정되어 있어요',
    date: '2026년 8월 8일 오전 9시',
    content:
      '내일 수영 일정이 예정되어 있어요.\n잊지 말고 수영을 준비해 주세요.',
    type: 'swimming',
  },

  5: {
    title: '내일 수영이 예정되어 있어요',
    date: '2026년 8월 7일 오전 9시',
    content:
      '내일 수영 일정이 예정되어 있어요.\n잊지 말고 수영을 준비해 주세요.',
    type: 'swimming',
  },

  6: {
    title: '내일 수영이 예정되어 있어요',
    date: '2026년 8월 6일 오전 9시',
    content:
      '내일 수영 일정이 예정되어 있어요.\n잊지 말고 수영을 준비해 주세요.',
    type: 'swimming',
  },

  7: {
    title: '주간 리포트 도착',
    date: '2026년 8월 3일 오전 9시',
    content:
      '이번 주 수영 기록을 바탕으로 한 주간 리포트가 도착했어요.\n내 기록과 분석 결과를 확인해 보세요.',
    type: 'report',
  },

  8: {
    title: '시스템 점검',
    date: '2026년 8월 1일 오후 1시',
    content:
      '서비스 안정화를 위한 시스템 점검이 진행될 예정입니다.\n점검 시간 동안 일부 서비스 이용이 제한될 수 있습니다.',
    type: 'system',
  },

  9: {
    title: '주간 리포트 도착',
    date: '2026년 7월 27일 오전 9시',
    content:
      '이번 주 수영 기록을 바탕으로 한 주간 리포트가 도착했어요.\n내 기록과 분석 결과를 확인해 보세요.',
    type: 'report',
  },

  10: {
    title: '내일 수영이 예정되어 있어요',
    date: '2026년 7월 25일 오전 9시',
    content:
      '내일 수영 일정이 예정되어 있어요.\n잊지 말고 수영을 준비해 주세요.',
    type: 'swimming',
  },
};


function DetailedAlert() {
  const navigate = useNavigate();
  const { alertId } = useParams();

  const alert =
    DETAILED_ALERTS[alertId];


  /* ========================================
     뒤로가기
  ======================================== */

  const handleBack = () => {
    navigate(-1);
  };


  /* ========================================
     존재하지 않는 알림
  ======================================== */

  if (!alert) {
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
            알림을 찾을 수 없습니다.
          </p>
        </section>

      </main>
    );
  }


  return (
    <main className="detailed-alert-page">

      {/* ================================
          Header
      ================================= */}

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


      {/* ================================
          Detail
      ================================= */}

      <article className="detailed-alert-content">

        <div className="detailed-alert-date">
          {alert.date}
        </div>


        <h2 className="detailed-alert-title">
          {alert.title}
        </h2>


        <div
          className={`detailed-alert-type ${alert.type}`}
          aria-hidden="true"
        />


        <p className="detailed-alert-message">
          {alert.content}
        </p>


        {/* ========================================
            알림 종류별 이동 버튼
            백엔드 연결 전 기본 UI만 구성
        ======================================== */}

        {alert.type === 'record' && (
          <button
            type="button"
            className="detailed-alert-action"
            onClick={() =>
              navigate('/home')
            }
          >
            기록 확인하기
          </button>
        )}


        {alert.type === 'clinic' && (
          <button
            type="button"
            className="detailed-alert-action"
            onClick={() =>
              navigate('/clinic/history')
            }
          >
            예약 내역 확인하기
          </button>
        )}


        {alert.type === 'swimming' && (
          <button
            type="button"
            className="detailed-alert-action"
            onClick={() =>
              navigate('/calendar')
            }
          >
            일정 확인하기
          </button>
        )}


        {alert.type === 'report' && (
          <button
            type="button"
            className="detailed-alert-action"
            onClick={() =>
              navigate('/analysis')
            }
          >
            리포트 확인하기
          </button>
        )}

      </article>

    </main>
  );
}

export default DetailedAlert;