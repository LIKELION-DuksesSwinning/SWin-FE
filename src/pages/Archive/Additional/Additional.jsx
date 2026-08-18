import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import prevBtn from '../../../assets/images/prev-btn.svg';
import recordProcessDone from '../../../assets/images/record-process-done.svg';

import './Additional.css';


const SYMPTOM_OPTIONS = [
  '당김',
  '건조',
  '가려움',
  '붉음',
  '여드름',
  '없음',
];


const SEVERITY_OPTIONS = [
  '상',
  '중',
  '하',
];


function Additional() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams =
    new URLSearchParams(
      location.search
    );

  const recordDate =
    searchParams.get('date') || '';


  /* ========================================
     State
  ======================================== */

  const [photo, setPhoto] =
    useState(null);

  const [symptoms, setSymptoms] =
    useState([]);

  const [symptomSeverity, setSymptomSeverity] =
    useState({});

  const [memo, setMemo] =
    useState('');

  const [isSaved, setIsSaved] =
    useState(false);


  /* ========================================
     사진 업로드
  ======================================== */

  const handlePhotoChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;


    if (
      !file.type.startsWith(
        'image/'
      )
    ) {
      alert(
        '이미지 파일만 업로드할 수 있습니다.'
      );

      return;
    }


    const reader =
      new FileReader();


    reader.onload = () => {
      setPhoto({
        file,
        preview: reader.result,
      });
    };


    reader.readAsDataURL(file);


    // 같은 파일을 다시 선택할 수 있도록 초기화
    event.target.value = '';
  };


  /* ========================================
     사진 삭제
  ======================================== */

  const handlePhotoRemove = () => {
    setPhoto(null);
  };


  /* ========================================
     증상 선택
  ======================================== */

  const handleSymptomClick = (
    option
  ) => {

    /* ----------------------------
       없음
    ---------------------------- */

    if (option === '없음') {

      setSymptoms((prev) => {

        if (
          prev.includes('없음')
        ) {
          return [];
        }

        return ['없음'];
      });


      setSymptomSeverity({});

      return;
    }


    /* ----------------------------
       일반 증상
    ---------------------------- */

    setSymptoms((prev) => {

      const withoutNone =
        prev.filter(
          (item) =>
            item !== '없음'
        );


      if (
        withoutNone.includes(
          option
        )
      ) {

        const nextSymptoms =
          withoutNone.filter(
            (item) =>
              item !== option
          );


        setSymptomSeverity(
          (prevSeverity) => {

            const next = {
              ...prevSeverity,
            };

            delete next[option];

            return next;
          }
        );


        return nextSymptoms;
      }


      return [
        ...withoutNone,
        option,
      ];
    });
  };


  /* ========================================
     증상 강도 선택
  ======================================== */

  const handleSeverityClick = (
    symptom,
    severity
  ) => {

    setSymptomSeverity(
      (prev) => ({
        ...prev,
        [symptom]:
          severity,
      })
    );
  };


  /* ========================================
     저장 가능 여부
  ======================================== */

  const hasAllSeverity =
    symptoms.includes('없음') ||
    (
      symptoms.length > 0 &&
      symptoms.every(
        (symptom) =>
          Boolean(
            symptomSeverity[
              symptom
            ]
          )
      )
    );


  const isComplete =
    photo !== null &&
    symptoms.length > 0 &&
    hasAllSeverity;


  /* ========================================
     저장
  ======================================== */

  const handleSave = () => {

    if (
      !isComplete ||
      isSaved
    ) {
      return;
    }


    const recordData = {
      type: 'additional',

      date:
        recordDate || null,

      photo:
        photo.file,

      symptoms,

      symptomSeverity,

      memo,
    };


    console.log(
      '추가 기록:',
      recordData
    );


    // TODO:
    // 실제 추가 기록 API 연결


    setIsSaved(true);


    setTimeout(() => {
      navigate(
        '/home',
        {
          replace: true,
        }
      );
    }, 2000);
  };


  /* ========================================
     저장 완료
  ======================================== */

  if (isSaved) {
    return (
      <main className="additional-done">

        <div className="additional-done-content">

          <img
            src={
              recordProcessDone
            }
            alt="저장 완료"
            className="additional-done-icon"
          />

          <p>
            저장되었습니다
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="additional-page">

      {/* ================================
          Header
      ================================= */}

      <header className="additional-header">

        <button
          type="button"
          className="additional-back-button"
          onClick={() =>
            navigate(-1)
          }
          aria-label="이전"
        >

          <img
            src={prevBtn}
            alt="이전"
          />

        </button>

      </header>


      {/* ================================
          Content
      ================================= */}

      <section className="additional-content">


        {/* ================================
            추가 기록 사진
        ================================= */}

        <section className="additional-section">

          <h2>
            추가 기록
          </h2>


          <div className="additional-photo-row">

            {photo ? (

              <div className="additional-photo-preview-wrapper">

                <div className="additional-photo-frame">

                  <img
                    src={
                      photo.preview
                    }
                    alt="추가 기록 사진"
                  />

                </div>


                <button
                  type="button"
                  className="additional-photo-remove"
                  onClick={
                    handlePhotoRemove
                  }
                >
                  사진 삭제
                </button>

              </div>

            ) : (

              <label
                htmlFor="additional-photo"
                className="additional-photo-upload"
              >

                <span className="additional-photo-plus">
                  +
                </span>

                <span>
                  이곳을 눌러
                  <br />
                  얼굴 사진을 첨부해 주세요
                </span>

                <input
                  id="additional-photo"
                  type="file"
                  accept="image/*"
                  onChange={
                    handlePhotoChange
                  }
                  hidden
                />

              </label>

            )}


            <div className="additional-photo-guide">

              <strong>
                사진 첨부 팁
              </strong>

              <p>
                · 선명한 얼굴 사진을 첨부해 주세요.
              </p>

              <p>
                · 화장하지 않은 상태로 찍어주세요.
              </p>

            </div>

          </div>

        </section>


        {/* ================================
            증상 선택
        ================================= */}

        <section className="additional-section">

          <h2>
            증상 선택
          </h2>


          <p className="additional-description">
            현재 느끼고 있는 피부 불편 증상을
            선택해 주세요.
            (중복 선택 가능)
          </p>


          <div className="additional-symptom-list">

            {SYMPTOM_OPTIONS.map(
              (option) => (

                <button
                  key={option}
                  type="button"
                  className={`additional-symptom-button ${
                    symptoms.includes(
                      option
                    )
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    handleSymptomClick(
                      option
                    )
                  }
                >
                  {option}
                </button>

              )
            )}

          </div>

        </section>


        {/* ================================
            증상 강도
        ================================= */}

        {symptoms.length > 0 &&
          !symptoms.includes(
            '없음'
          ) && (

            <section className="additional-section">

              <h2>
                증상 강도
              </h2>


              <div className="additional-severity-list">

                {symptoms.map(
                  (symptom) => (

                    <div
                      key={symptom}
                      className="additional-severity-row"
                    >

                      <span className="additional-severity-name">
                        {symptom}
                      </span>


                      <div className="additional-severity-buttons">

                        {SEVERITY_OPTIONS.map(
                          (severity) => (

                            <button
                              key={
                                severity
                              }
                              type="button"
                              className={`additional-severity-button ${
                                symptomSeverity[
                                  symptom
                                ] ===
                                severity
                                  ? 'selected'
                                  : ''
                              }`}
                              onClick={() =>
                                handleSeverityClick(
                                  symptom,
                                  severity
                                )
                              }
                            >
                              {severity}
                            </button>

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

        <section className="additional-section">

          <h2>
            특이 사항
          </h2>


          <textarea
            className="additional-memo"
            value={memo}
            onChange={(event) =>
              setMemo(
                event.target.value
              )
            }
            placeholder="추가로 기록할 내용이 있다면 입력해 주세요."
          />

        </section>


        {/* ================================
            저장
        ================================= */}

        <button
          type="button"
          className={`additional-save-button ${
            isComplete
              ? 'active'
              : ''
          }`}
          disabled={!isComplete}
          onClick={handleSave}
        >
          저장
        </button>

      </section>

    </main>
  );
}

export default Additional;