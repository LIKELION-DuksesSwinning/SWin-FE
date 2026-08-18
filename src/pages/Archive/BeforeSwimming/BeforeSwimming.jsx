import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import prevBtn from '../../../assets/images/prev-btn.svg';
import recordProcessDone from '../../../assets/images/record-process-done.svg';

import {
  createSwimRecord,
} from '../../../api/records';

import './BeforeSwimming.css';


const SYMPTOM_OPTIONS = [
  '당김',
  '건조',
  '가려움',
  '붉음',
  '여드름',
  '없음',
];


const SEVERITY_OPTIONS = [
  '하',
  '중',
  '상',
];


function BeforeSwimming() {
  const navigate =
    useNavigate();

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

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');


  useEffect(() => {
    if (!isSaved) {
      return undefined;
    }

    const timer =
      setTimeout(() => {
        navigate('/home');
      }, 2000);

    return () =>
      clearTimeout(timer);
  }, [
    isSaved,
    navigate,
  ]);


  /* 사진 */

  const handlePhotoChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        'image/'
      )
    ) {
      alert(
        '이미지 파일만 업로드할 수 있습니다.'
      );

      event.target.value = '';

      return;
    }

    const reader =
      new FileReader();

      console.log('선택한 실제 파일:', {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      window.__testPhotoFile = file;

    reader.onload = () => {
      setPhoto({
        file,
        preview:
          reader.result,
      });
    };

    reader.readAsDataURL(file);

    event.target.value = '';
  };


  const handlePhotoRemove =
    () => {
      setPhoto(null);
    };


  /* 증상 */

  const handleSymptomClick = (
    option
  ) => {
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
        return withoutNone.filter(
          (item) =>
            item !== option
        );
      }

      return [
        ...withoutNone,
        option,
      ];
    });


    setSymptomSeverity(
      (prev) => {
        if (!prev[option]) {
          return prev;
        }

        const next = {
          ...prev,
        };

        delete next[option];

        return next;
      }
    );
  };


  /* 강도 */

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


  const hasAllSeverity =
    symptoms.length === 0 ||
    symptoms.includes('없음') ||
    symptoms.every(
      (symptom) =>
        Boolean(
          symptomSeverity[
            symptom
          ]
        )
    );


  const isComplete =
    photo !== null &&
    hasAllSeverity;

  // const isComplete =
  // hasAllSeverity;


  /* API용 symptoms */

  const buildSymptomsPayload =
    () => {
      if (
        symptoms.length === 0 ||
        symptoms.includes(
          '없음'
        )
      ) {
        return [];
      }

      return symptoms.map(
        (symptom) => ({
          type: symptom,
          score:
            symptomSeverity[
              symptom
            ],
        })
      );
    };


  /* 저장 */

  const handleSave =
  async () => {
    if (
      !isComplete ||
      isSaved ||
      isSaving
    ) {
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const now =
        new Date();

      const date =
        now
          .toISOString()
          .slice(0, 10);

      const startTime =
        now
          .toTimeString()
          .slice(0, 5);

      await createSwimRecord({
        timing: 'BEFORE',

        date,

        startTime,

        durationMinutes: 60,

        photo:
          photo?.file,

        symptoms:
          buildSymptomsPayload(),

        memo,
      });

      setIsSaved(true);
    } catch (error) {
      console.error(
        '수영 전 기록 저장 오류:',
        error
      );

      setErrorMessage(
        error?.message ||
          '기록 저장에 실패했습니다.'
      );
    } finally {
      setIsSaving(false);
    }
  };


  if (isSaved) {
    return (
      <main className="before-swimming-done">

        <div className="before-record-done-content">

          <img
            src={
              recordProcessDone
            }
            alt="저장 완료"
            className="before-record-done-icon"
          />

          <p>
            저장되었습니다
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="before-swimming-page">

      <header className="before-archive-record-header">

        <button
          type="button"
          className="before-archive-record-back"
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


      <section className="before-archive-record-content">

        {/* 사진 */}

        <section className="before-archive-record-section">

          <h2>
            수영 전 사진
          </h2>

          <div className="before-photo-upload-row">

            {photo ? (
              <div className="before-photo-preview-wrapper">

                <div className="before-photo-frame">

                  <img
                    src={
                      photo.preview
                    }
                    alt="수영 전 사진"
                  />

                </div>

                <button
                  type="button"
                  className="before-photo-remove-button"
                  onClick={
                    handlePhotoRemove
                  }
                >
                  사진 삭제
                </button>

              </div>
            ) : (
              <label
                htmlFor="before-photo"
                className="before-photo-upload-box"
              >
                <span className="before-photo-upload-plus">
                  +
                </span>

                <span>
                  이곳을 눌러
                  <br />
                  얼굴 사진을 첨부해 주세요
                </span>

                <input
                  id="before-photo"
                  type="file"
                  accept="image/*"
                  onChange={
                    handlePhotoChange
                  }
                  hidden
                />

              </label>
            )}

            <div className="before-photo-guide">

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


        {/* 증상 */}

        <section className="before-archive-record-section">

          <h2>
            증상 선택
          </h2>

          <p className="before-archive-record-description">
            현재 느끼고 있는 피부 불편 증상을
            선택해 주세요.
            (중복 선택 가능)
          </p>

          <div className="before-symptom-list">

            {SYMPTOM_OPTIONS.map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  className={`before-symptom-button ${
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


        {/* 강도 */}

        {symptoms.length > 0 &&
          !symptoms.includes(
            '없음'
          ) && (
            <section className="before-archive-record-section">

              <h2>
                증상 강도
              </h2>

              <div className="before-severity-list">

                {symptoms.map(
                  (symptom) => (
                    <div
                      key={symptom}
                      className="before-severity-row"
                    >

                      <span className="before-severity-name">
                        {symptom}
                      </span>

                      <div className="before-severity-buttons">

                        {SEVERITY_OPTIONS.map(
                          (severity) => (
                            <button
                              key={severity}
                              type="button"
                              className={`before-severity-button ${
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


        {/* 메모 */}

        <section className="before-archive-record-section">

          <h2>
            특이 사항
          </h2>

          <textarea
            className="before-archive-record-memo"
            value={memo}
            onChange={(event) =>
              setMemo(
                event.target.value
              )
            }
            placeholder="추가로 기록할 내용이 있다면 입력해 주세요."
          />

        </section>


        {errorMessage && (
          <p
            role="alert"
            style={{
              color: '#d33',
              marginBottom:
                '12px',
            }}
          >
            {errorMessage}
          </p>
        )}


        <button
          type="button"
          className={`before-archive-record-save ${
            isComplete
              ? 'active'
              : ''
          }`}
          disabled={
            !isComplete ||
            isSaving
          }
          onClick={
            handleSave
          }
        >
          {isSaving
            ? '저장 중...'
            : '저장'}
        </button>

      </section>

    </main>
  );
}


export default BeforeSwimming;