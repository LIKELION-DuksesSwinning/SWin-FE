import {
  useEffect,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import prevBtn from '../../../assets/images/prev-btn.svg';

import {
  getSwimRecord,
} from '../../../api/records';

import './Furthermore.css';


const RECORD_TYPE_LABELS = {
  BEFORE: '수영 전 사진',
  AFTER: '수영 후 사진',
  ADD: '추가 기록',
};


const SYMPTOMS = [
  '당김',
  '건조',
  '가려움',
  '붉음',
  '여드름',
  '없음',
];


const SEVERITY = [
  '상',
  '중',
  '하',
];


function Furthermore() {
  const navigate =
    useNavigate();

  const location =
    useLocation();


  const searchParams =
    new URLSearchParams(
      location.search
    );


  const recordId =
    searchParams.get('id');

  const dateParam =
    searchParams.get('date');


  const [
    record,
    setRecord,
  ] = useState(null);


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');


  useEffect(() => {
    if (!recordId) {
      setErrorMessage(
        '기록 ID가 없습니다.'
      );

      setIsLoading(false);

      return;
    }


    let isMounted = true;


    const loadRecord =
      async () => {
        setIsLoading(true);
        setErrorMessage('');


        try {
          const data =
            await getSwimRecord(
              recordId
            );

          if (isMounted) {
            setRecord(data);
          }
        } catch (error) {
          console.error(
            '기록 상세 조회 실패:',
            error
          );

          if (isMounted) {
            setErrorMessage(
              error?.message ||
                '기록을 불러오지 못했습니다.'
            );
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };


    loadRecord();


    return () => {
      isMounted = false;
    };
  }, [recordId]);


  const selectedDate =
    dateParam ||
    (
      record?.created_at
        ? record.created_at
            .split('T')[0]
        : ''
    );


  const formattedDate =
    selectedDate
      ? selectedDate.replace(
          /-/g,
          '.'
        )
      : '-';


  const timing =
    record?.timing;


  const typeLabel =
    RECORD_TYPE_LABELS[
      timing
    ] || '수영 기록';


  const symptomList =
    Array.isArray(
      record?.symptoms
    )
      ? record.symptoms
      : [];


  const selectedSymptoms =
    symptomList
      .map(
        (item) =>
          item?.type
      )
      .filter(Boolean);


  const severityMap =
    symptomList.reduce(
      (
        accumulator,
        item
      ) => {
        if (item?.type) {
          accumulator[
            item.type
          ] =
            item.score || '';
        }

        return accumulator;
      },
      {}
    );


  const handleBack =
    () => {
      navigate(-1);
    };


  if (isLoading) {
    return (
      <main className="furthermore-page">

        <header className="furthermore-header">

          <button
            type="button"
            className="furthermore-back-button"
            onClick={
              handleBack
            }
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
            기록을 불러오는 중입니다.
          </p>
        </div>

      </main>
    );
  }


  if (
    !record ||
    errorMessage
  ) {
    return (
      <main className="furthermore-page">

        <header className="furthermore-header">

          <button
            type="button"
            className="furthermore-back-button"
            onClick={
              handleBack
            }
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
            {errorMessage ||
              '해당 기록이 없습니다.'}
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="furthermore-page">

      <header className="furthermore-header">

        <button
          type="button"
          className="furthermore-back-button"
          onClick={
            handleBack
          }
          aria-label="이전"
        >
          <img
            src={prevBtn}
            alt=""
          />
        </button>

      </header>


      <section className="furthermore-content">

        <div className="furthermore-date">
          {formattedDate}
        </div>

        <h1 className="furthermore-title">
          {typeLabel}
        </h1>


        {/* 사진 */}

        <section className="furthermore-section">

          <h2 className="furthermore-section-title">
            {typeLabel}
          </h2>

          <div className="furthermore-photo-row">

            <div className="furthermore-photo-frame">

              {record.photo_url ? (
                <img
                  src={
                    record.photo_url
                  }
                  alt={typeLabel}
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

              {timing ===
                'AFTER' && (
                <p>
                  · 피부 변화가 나타나는 부위를 포함해 주세요.
                </p>
              )}

            </div>

          </div>

        </section>


        {/* 수영 시간 */}

        {timing ===
          'AFTER' &&
          record.swim_time && (
            <section className="furthermore-section">

              <h2 className="furthermore-section-title">
                수영 시간
              </h2>

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
                        record.swim_time ===
                        option
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


        {/* 증상 */}

        <section className="furthermore-section">

          <h2 className="furthermore-section-title">
            증상 선택
          </h2>

          <p className="furthermore-description">
            현재 느끼고 있는 피부 불편 증상을 확인하세요.
          </p>

          <div className="furthermore-option-grid">

            {SYMPTOMS.map(
              (symptom) => {
                const selected =
                  selectedSymptoms.includes(
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


        {/* 강도 */}

        {selectedSymptoms.length >
          0 &&
          !selectedSymptoms.includes(
            '없음'
          ) && (
            <section className="furthermore-section">

              <h2 className="furthermore-section-title">
                증상 강도
              </h2>

              <div className="furthermore-severity-list">

                {selectedSymptoms.map(
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
                                severityMap[
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


        {/* 메모 */}

        <section className="furthermore-section">

          <h2 className="furthermore-section-title">
            특이 사항
          </h2>

          <div className="furthermore-memo">
            {record.memo ||
              '기록된 특이 사항이 없습니다.'}
          </div>

        </section>

      </section>


      <div className="furthermore-navigation">

        <button
          type="button"
          className="furthermore-arrow-button"
          disabled
          aria-label="이전 기록"
        >
          ‹
        </button>


        <button
          type="button"
          className="furthermore-save-button"
          onClick={
            handleBack
          }
        >
          확인
        </button>


        <button
          type="button"
          className="furthermore-arrow-button"
          disabled
          aria-label="다음 기록"
        >
          ›
        </button>

      </div>

    </main>
  );
}


export default Furthermore;