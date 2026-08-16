import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import prevBtn from '../../../assets/images/prev-btn.svg';
import recordProcessDone from '../../../assets/images/record-process-done.svg';

import './AfterSwimming.css';

const SWIM_TIME_OPTIONS = [
  '30분 미만',
  '30~60분',
  '60~90분',
  '90분 이상',
];

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

function AfterSwimming() {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);

  const [swimTime, setSwimTime] = useState('');

  const [symptoms, setSymptoms] = useState([]);

  const [symptomSeverity, setSymptomSeverity] = useState({});

  const [memo, setMemo] = useState('');

  const [isSaved, setIsSaved] = useState(false);


  // ========================================
  // 사진 업로드
  // ========================================

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto({
        file,
        preview: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };


  // ========================================
  // 사진 삭제
  // ========================================

  const handlePhotoRemove = () => {
    setPhoto(null);
  };


  // ========================================
  // 수영 시간 선택
  // ========================================

  const handleSwimTimeClick = (option) => {
    setSwimTime(option);
  };


  // ========================================
  // 증상 선택
  // ========================================

  const handleSymptomClick = (option) => {
    if (option === '없음') {
      setSymptoms((prev) =>
        prev.includes('없음')
          ? []
          : ['없음']
      );

      setSymptomSeverity({});

      return;
    }

    setSymptoms((prev) => {
      const withoutNone = prev.filter(
        (item) => item !== '없음'
      );

      if (withoutNone.includes(option)) {
        const nextSymptoms =
          withoutNone.filter(
            (item) => item !== option
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

      return [...withoutNone, option];
    });
  };


  // ========================================
  // 증상 강도
  // ========================================

  const handleSeverityClick = (
    symptom,
    severity
  ) => {
    setSymptomSeverity((prev) => ({
      ...prev,
      [symptom]: severity,
    }));
  };


  // ========================================
  // 저장 가능 여부
  //
  // 수영 후:
  // 사진 + 수영 시간 필수
  // 선택한 증상이 있다면 강도 필수
  // ========================================

  const hasAllSeverity =
    symptoms.length === 0 ||
    symptoms.every(
      (symptom) =>
        symptomSeverity[symptom]
    );

  const isComplete =
    photo !== null &&
    swimTime !== '' &&
    hasAllSeverity;


  // ========================================
  // 저장
  // ========================================

  const handleSave = () => {
    if (!isComplete) return;

    const recordData = {
      type: 'after-swimming',
      photo: photo.file,
      swimTime,
      symptoms,
      symptomSeverity,
      memo,
    };

    console.log(
      '수영 후 기록:',
      recordData
    );

    // TODO:
    // 다음 API 이슈에서 실제 API 연결

    setIsSaved(true);
  };


  // ========================================
  // 저장 완료 화면
  // ========================================

  if (isSaved) {
    return (
      <main className="after-swimming-done">

        <div className="record-done-content">

          <img
            src={recordProcessDone}
            alt="저장 완료"
            className="record-done-icon"
          />

          <p>
            저장되었습니다
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="after-swimming-page">

      {/* ================================
          Header
      ================================= */}

      <header className="archive-record-header">

        <button
          type="button"
          className="archive-record-back"
          onClick={() => navigate(-1)}
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

      <section className="archive-record-content">

        {/* ================================
            수영 후 사진
        ================================= */}

        <section className="archive-record-section">

          <h2>수영 후 사진</h2>

          <div className="photo-upload-row">

            {photo ? (
              <div className="photo-preview-wrapper">

                <div className="photo-frame">
                  <img
                    src={photo.preview}
                    alt="수영 후 사진"
                  />
                </div>

                <button
                  type="button"
                  className="photo-remove-button"
                  onClick={handlePhotoRemove}
                >
                  사진 삭제
                </button>

              </div>
            ) : (
              <label
                htmlFor="after-photo"
                className="photo-upload-box"
              >
                <span className="photo-upload-plus">
                  +
                </span>

                <span>
                  이곳을 눌러
                  <br />
                  얼굴 사진을 첨부해 주세요
                </span>

                <input
                  id="after-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  hidden
                />
              </label>
            )}


            <div className="photo-guide">

              <strong>
                사진 첨부 팁
              </strong>

              <p>
                · 선명한 얼굴 사진을 첨부해 주세요.
              </p>

              <p>
                · 화장하지 않은 상태로 찍어주세요.
              </p>

              <p>
                · 피부 변화가 나타나는 부위를 포함해 주세요.
              </p>

            </div>

          </div>

        </section>


        {/* ================================
            수영 시간
        ================================= */}

        <section className="archive-record-section">

          <h2>수영 시간</h2>

          <div className="swim-time-list">

            {SWIM_TIME_OPTIONS.map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  className={`swim-time-button ${
                    swimTime === option
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    handleSwimTimeClick(
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
            증상
        ================================= */}

        <section className="archive-record-section">

          <h2>증상 선택</h2>

          <p className="archive-record-description">
            현재 느끼고 있는 피부 불편 증상을 선택해 주세요.
            (중복 선택 가능)
          </p>

          <div className="symptom-list">

            {SYMPTOM_OPTIONS.map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  className={`symptom-button ${
                    symptoms.includes(option)
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
          !symptoms.includes('없음') && (
            <section className="archive-record-section">

              <h2>증상 강도</h2>

              <div className="severity-list">

                {symptoms.map(
                  (symptom) => (
                    <div
                      key={symptom}
                      className="severity-row"
                    >

                      <span className="severity-name">
                        {symptom}
                      </span>

                      <div className="severity-buttons">

                        {SEVERITY_OPTIONS.map(
                          (severity) => (
                            <button
                              key={severity}
                              type="button"
                              className={`severity-button ${
                                symptomSeverity[
                                  symptom
                                ] === severity
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

        <section className="archive-record-section">

          <h2>특이 사항</h2>

          <textarea
            className="archive-record-memo"
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
          className={`archive-record-save ${
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

export default AfterSwimming;