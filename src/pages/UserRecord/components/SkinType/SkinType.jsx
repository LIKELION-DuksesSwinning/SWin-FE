import { useState } from 'react';

import prevBtn from '../../../../assets/images/prev-btn.svg';

import './SkinType.css';

const SKIN_TYPE_OPTIONS = [
  '건성',
  '지성',
  '복합성',
  '수부지',
  '민감성',
];

const SKIN_SYMPTOM_OPTIONS = [
  '당김',
  '건조',
  '가려움',
  '붉음',
  '여드름',
  '없음',
];

const SKIN_AREA_OPTIONS = [
  '이마',
  '왼쪽 볼',
  '오른쪽 볼',
  '나비존',
  '하관',
  '전체',
];

function SkinType({ onNext, onPrev }) {
  const [skinTypes, setSkinTypes] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [symptomAreas, setSymptomAreas] = useState([]);

  // ========================================
  // 1. 피부 타입
  // API: skin_types → Array[String]
  // 중복 선택 가능
  // ========================================

  const handleSkinTypeClick = (option) => {
    setSkinTypes((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // ========================================
  // 2. 반복 증상
  // API: symptoms → Array[String]
  //
  // '없음' 선택 시 다른 증상 해제
  // ========================================

  const handleSymptomClick = (option) => {
    if (option === '없음') {
      setSymptoms((prev) =>
        prev.includes('없음') ? [] : ['없음']
      );
      return;
    }

    setSymptoms((prev) => {
      const withoutNone = prev.filter(
        (item) => item !== '없음'
      );

      return withoutNone.includes(option)
        ? withoutNone.filter((item) => item !== option)
        : [...withoutNone, option];
    });
  };

  // ========================================
  // 3. 증상 발생 부위
  // API: symptom_areas → Array[String]
  // 선택 사항
  //
  // '전체' 선택 시 다른 부위 해제
  // ========================================

  const handleAreaClick = (option) => {
    if (option === '전체') {
      setSymptomAreas((prev) =>
        prev.includes('전체') ? [] : ['전체']
      );
      return;
    }

    setSymptomAreas((prev) => {
      const withoutAll = prev.filter(
        (item) => item !== '전체'
      );

      return withoutAll.includes(option)
        ? withoutAll.filter((item) => item !== option)
        : [...withoutAll, option];
    });
  };

  // ========================================
  // 완료 버튼 활성화 조건
  //
  // 필수:
  // 1. 피부 타입
  // 2. 반복 증상
  //
  // 선택:
  // 3. 증상 발생 부위
  // ========================================

  const isComplete =
    skinTypes.length > 0 &&
    symptoms.length > 0;

  // ========================================
  // 완료
  // ========================================

  const handleNext = () => {
    if (!isComplete) return;

    // UserRecord.jsx로 최종 데이터 전달
    onNext({
      skinTypes,
      symptoms,
      symptomAreas,
    });
  };

  return (
    <section className="skin-type">

      {/* ========================================
          1. 피부 타입
      ======================================== */}

      <div className="skin-question">
        <h2>
          1. 피부 타입{' '}
          <span className="must-needed">*</span>
        </h2>

        <p>중복 선택 가능</p>

        <div className="skin-option-list max-three">
          {SKIN_TYPE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`skin-option-button ${
                skinTypes.includes(option)
                  ? 'selected'
                  : ''
              }`}
              onClick={() => handleSkinTypeClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>


      {/* ========================================
          2. 반복 증상
      ======================================== */}

      <div className="skin-question">
        <h2>
          2. 반복 증상{' '}
          <span className="must-needed">*</span>
        </h2>

        <p>
          수영 후 자주 나타나는 증상을 선택하세요.
          (중복 선택 가능)
        </p>

        <div className="skin-option-list max-three">
          {SKIN_SYMPTOM_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`skin-option-button ${
                symptoms.includes(option)
                  ? 'selected'
                  : ''
              }`}
              onClick={() => handleSymptomClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>


      {/* ========================================
          3. 증상 발생 부위
      ======================================== */}

      <div className="skin-question">
        <h2>3. 증상 발생 부위</h2>

        <p>
          수영 후 나타나는 증상이 발생하는 부위를
          선택하세요. (중복 선택 가능)
        </p>

        <div className="skin-option-list max-three">
          {SKIN_AREA_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`skin-option-button ${
                symptomAreas.includes(option)
                  ? 'selected'
                  : ''
              }`}
              onClick={() => handleAreaClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>


      {/* ========================================
          하단 버튼
      ======================================== */}

      <div className="skin-navigation">

        <button
          type="button"
          className="skin-prev-button"
          onClick={onPrev}
          aria-label="이전"
        >
          <img
            src={prevBtn}
            alt="이전"
          />
        </button>

        <button
          type="button"
          className={`skin-next-button ${
            isComplete ? 'active' : ''
          }`}
          disabled={!isComplete}
          onClick={handleNext}
        >
          완료
        </button>

      </div>

    </section>
  );
}

export default SkinType;