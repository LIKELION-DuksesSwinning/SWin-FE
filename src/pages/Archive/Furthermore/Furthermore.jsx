import { useMemo, useState } from 'react';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import prevBtn from '../../../assets/images/prev-btn.svg';

import './Furthermore.css';


/* ========================================
   기록 종류
======================================== */

const RECORD_TYPES = [
  'before',
  'after',
  'additional',
];


/* ========================================
   기록 종류 표시명
======================================== */

const RECORD_TYPE_LABELS = {
  before: '수영 전 사진',
  after: '수영 후 사진',
  additional: '추가 기록',
};


/* ========================================
   증상
======================================== */

const SYMPTOMS = [
  '당김',
  '건조',
  '가려움',
  '붉음',
  '여드름',
  '없음',
];


/* ========================================
   강도
======================================== */

const SEVERITY = [
  '상',
  '중',
  '하',
];


/* ========================================
   임시 상세 기록 데이터

   TODO:
   백엔드 상세 조회 API로 교체

   구조:
   {
     before: {...},
     after: {...},
     additional: {...}
   }
======================================== */

const DEMO_DETAIL_RECORDS = {
  '2026-08-17': {
    before: {
      photo: '',
      symptoms: [
        '당김',
        '건조',
        '가려움',
        '붉음',
        '여드름',
      ],
      severity: {
        당김: '중',
        건조: '중',
        가려움: '중',
        붉음: '중',
        여드름: '중',
      },
      memo:
        '붉게 올라온 부분에서 열감이 느껴지고 가려움',
    },

    after: {
      photo: '',
      duration: '30~60분',
      symptoms: [
        '당김',
        '여드름',
      ],
      severity: {
        당김: '중',
        여드름: '중',
      },
      memo: '',
    },

    additional: {
      photo: '',
      symptoms: [
        '당김',
        '건조',
        '가려움',
        '붉음',
        '여드름',
      ],
      severity: {
        당김: '중',
        건조: '중',
        가려움: '중',
        붉음: '중',
        여드름: '중',
      },
      memo:
        '붉게 올라온 부분에서 열감이 느껴지고 가려움',
    },
  },


  /* --------------------------------------
     테스트용 두 번째 날짜
  -------------------------------------- */

  '2026-08-15': {
    before: {
      photo: '',
      symptoms: [
        '당김',
        '건조',
        '가려움',
        '붉음',
        '여드름',
      ],
      severity: {
        당김: '중',
        건조: '중',
        가려움: '중',
        붉음: '중',
        여드름: '중',
      },
      memo: '',
    },

    after: {
      photo: '',
      duration: '30~60분',
      symptoms: [
        '당김',
        '여드름',
      ],
      severity: {
        당김: '중',
        여드름: '중',
      },
      memo: '',
    },
  },
};


function Furthermore() {
  const navigate = useNavigate();
  const location = useLocation();


  /* ========================================
     Query Parameter
  ======================================== */

  const searchParams = new URLSearchParams(
    location.search
  );

  const dateParam =
    searchParams.get('date');

  const recordId =
    searchParams.get('id');


  /* ========================================
     선택 날짜
  ======================================== */

  const selectedDate =
    dateParam || '2026-08-17';


  /* ========================================
     현재 페이지
  ======================================== */

  const [
    currentTypeIndex,
    setCurrentTypeIndex,
  ] = useState(0);


  /* ========================================
     해당 날짜 기록
  ======================================== */

  const dayRecord =
    DEMO_DETAIL_RECORDS[
      selectedDate
    ] || null;


  /* ========================================
     실제 존재하는 기록만 구성

     예:
     before + after + additional
     → 3페이지

     before + after
     → 2페이지
  ======================================== */

  const availableTypes =
    useMemo(() => {
      if (!dayRecord) {
        return [];
      }

      return RECORD_TYPES.filter(
        (type) =>
          dayRecord[type]
      );
    }, [dayRecord]);


  /* ========================================
     현재 기록 종류
  ======================================== */

  const currentType =
    availableTypes.length > 0
      ? availableTypes[
          Math.min(
            currentTypeIndex,
            availableTypes.length - 1
          )
        ]
      : null;


  /* ========================================
     현재 기록 데이터
  ======================================== */

  const currentRecord =
    currentType
      ? dayRecord[currentType]
      : null;


  /* ========================================
     현재 날짜 표시
  ======================================== */

  const formattedDate =
    selectedDate
      ? selectedDate.replace(
          /-/g,
          '.'
        )
      : '-';


  /* ========================================
     이전 기록
  ======================================== */

  const handlePrevious = () => {
    if (currentTypeIndex <= 0) {
      return;
    }

    setCurrentTypeIndex(
      (prev) => prev - 1
    );
  };


  /* ========================================
     다음 기록
  ======================================== */

  const handleNext = () => {
    if (
      currentTypeIndex >=
      availableTypes.length - 1
    ) {
      return;
    }

    setCurrentTypeIndex(
      (prev) => prev + 1
    );
  };


  /* ========================================
     뒤로가기
  ======================================== */

  const handleBack = () => {
    navigate(-1);
  };


  /* ========================================
     저장
     → 실제 API 연결 전 임시 처리
  ======================================== */

  const handleSave = () => {
    console.log(
      '현재 상세 기록 저장:',
      {
        recordId,
        date: selectedDate,
        type: currentType,
        data: currentRecord,
      }
    );

    // TODO:
    // 상세 기록 저장 API 연결
  };


  /* ========================================
     기록이 없는 경우
  ======================================== */

  if (
    !dayRecord ||
    availableTypes.length === 0
  ) {
    return (
      <main className="furthermore-page">

        <header className="furthermore-header">

          <button
            type="button"
            className="furthermore-back-button"
            onClick={handleBack}
            aria-label="이전"
          >
            <img
              src={prevBtn}
              alt=""
            />
          </button>

        </header>


        <div className="furthermore-empty">

          <p>
            해당 날짜의 기록이 없습니다.
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="furthermore-page">

      {/* ================================
          Header
      ================================= */}

      <header className="furthermore-header">

        <button
          type="button"
          className="furthermore-back-button"
          onClick={handleBack}
          aria-label="이전"
        >
          <img
            src={prevBtn}
            alt=""
          />
        </button>

      </header>


      {/* ================================
          Content
      ================================= */}

      <section className="furthermore-content">

        {/* ================================
            Date / Type
        ================================= */}

        <div className="furthermore-date">
          {formattedDate}
        </div>

        <h1 className="furthermore-title">
          {RECORD_TYPE_LABELS[currentType]}
        </h1>


        {/* ================================
            Photo
        ================================= */}

        <section className="furthermore-section">

          <h2 className="furthermore-section-title">
            {RECORD_TYPE_LABELS[currentType]}
          </h2>


          <div className="furthermore-photo-row">

            <div className="furthermore-photo-frame">

              {currentRecord?.photo ? (
                <img
                  src={currentRecord.photo}
                  alt={
                    RECORD_TYPE_LABELS[
                      currentType
                    ]
                  }
                />
              ) : (
                <div className="furthermore-photo-placeholder">
                  사진
                </div>
              )}

            </div>


            <div className="furthermore-photo-guide">

              <strong>
                사진 첨부 팁
              </strong>

              <p>
                · 선명한 얼굴 사진을 첨부해 주세요.
              </p>

              <p>
                · 화장하지 않은 상태로 찍어주세요.
              </p>

              {currentType === 'after' && (
                <p>
                  · 피부 변화가 나타나는 부위를 포함해 주세요.
                </p>
              )}

            </div>

          </div>

        </section>


        {/* ================================
            수영 시간
            → 수영 후에만 표시
        ================================= */}

        {currentType === 'after' &&
          currentRecord?.duration && (
            <section className="furthermore-section">

              <h2 className="furthermore-section-title">
                수영 시간
              </h2>


              {/* ★ 핵심 수정:
                  수영 시간은 2열 × 2행 */}
              <div className="furthermore-option-grid furthermore-duration-grid">

                {[
                  '30분 미만',
                  '30~60분',
                  '60~90분',
                  '90분 이상',
                ].map(
                  (option) => (
                    <div
                      key={option}
                      className={`furthermore-option ${
                        option ===
                        currentRecord.duration
                          ? 'selected'
                          : ''
                      }`}
                    >
                      {option}
                    </div>
                  )
                )}

              </div>

            </section>
          )}


        {/* ================================
            증상 선택
        ================================= */}

        <section className="furthermore-section">

          <h2 className="furthermore-section-title">
            증상 선택
          </h2>

          <p className="furthermore-description">
            현재 느끼고 있는 피부 불편 증상을 확인하세요.
          </p>


          {/* 증상은 기존대로 3열 × 2행 */}
          <div className="furthermore-option-grid">

            {SYMPTOMS.map(
              (symptom) => {

                const selected =
                  currentRecord?.symptoms?.includes(
                    symptom
                  );

                return (
                  <div
                    key={symptom}
                    className={`furthermore-option ${
                      selected
                        ? 'selected'
                        : ''
                    }`}
                  >
                    {symptom}
                  </div>
                );
              }
            )}

          </div>

        </section>


        {/* ================================
            증상 강도
        ================================= */}

        {currentRecord?.symptoms?.length > 0 &&
          !currentRecord.symptoms.includes(
            '없음'
          ) && (
            <section className="furthermore-section">

              <h2 className="furthermore-section-title">
                증상 강도
              </h2>


              <div className="furthermore-severity-list">

                {currentRecord.symptoms
                  .filter(
                    (symptom) =>
                      symptom !== '없음'
                  )
                  .map(
                    (symptom) => (
                      <div
                        key={symptom}
                        className="furthermore-severity-row"
                      >

                        <span className="furthermore-severity-name">
                          {symptom}
                        </span>


                        <div className="furthermore-severity-buttons">

                          {SEVERITY.map(
                            (severity) => (
                              <div
                                key={severity}
                                className={`furthermore-severity-button ${
                                  currentRecord
                                    ?.severity?.[
                                    symptom
                                  ] ===
                                  severity
                                    ? 'selected'
                                    : ''
                                }`}
                              >
                                {severity}
                              </div>
                            )
                          )}

                        </div>

                      </div>
                    )
                  )}

              </div>

            </section>
          )}


        {/* ================================
            특이 사항
        ================================= */}

        <section className="furthermore-section">

          <h2 className="furthermore-section-title">
            특이 사항
          </h2>

          <div className="furthermore-memo">
            {currentRecord?.memo ||
              '기록된 특이 사항이 없습니다.'}
          </div>

        </section>

      </section>


      {/* ================================
          Bottom Navigation
          기획 디자인:
          ←  저장  →
      ================================= */}

      <div className="furthermore-navigation">

        <button
          type="button"
          className="furthermore-arrow-button"
          onClick={handlePrevious}
          disabled={
            currentTypeIndex === 0
          }
          aria-label="이전 기록"
        >
          ‹
        </button>


        <button
          type="button"
          className="furthermore-save-button"
          onClick={handleSave}
        >
          저장
        </button>


        <button
          type="button"
          className="furthermore-arrow-button"
          onClick={handleNext}
          disabled={
            currentTypeIndex >=
            availableTypes.length - 1
          }
          aria-label="다음 기록"
        >
          ›
        </button>

      </div>

    </main>
  );
}

export default Furthermore;