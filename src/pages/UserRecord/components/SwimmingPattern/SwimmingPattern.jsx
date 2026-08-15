import { useState } from 'react';
import './SwimmingPattern.css';

const SWIM_PERIOD_OPTIONS = [
  '6개월 미만',
  '6개월~1년',
  '1~2년',
  '2~4년',
  '4년 이상',
];

const SWIM_COUNT_OPTIONS = [
  '주 1~2회',
  '주 3~4회',
  '주 5회 이상',
];

const SWIM_TIME_OPTIONS = [
  '30분 미만',
  '30~60분',
  '60~90분',
  '90분 이상',
];

function SwimmingPattern({ onNext, onPrev }) {
  const [swimPeriod, setSwimPeriod] = useState('');
  const [swimCount, setSwimCount] = useState('');
  const [swimTime, setSwimTime] = useState('');

  // 세 항목을 모두 선택했는지 확인
  const isComplete =
    swimPeriod !== '' &&
    swimCount !== '' &&
    swimTime !== '';

  const handleNext = () => {
    if (!isComplete) return;

    onNext({
      swimPeriod,
      swimCount,
      swimTime,
    });
  };

  return (
    <section className="swimming-pattern">

      {/* ================================
          1. 수영 기간
      ================================= */}

      <div className="record-question">
        <h2>1. 수영 기간 <span class="must-needed">*</span></h2>

        <div className="option-list">
          {SWIM_PERIOD_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`option-button ${
                swimPeriod === option ? 'selected' : ''
              }`}
              onClick={() => setSwimPeriod(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>


      {/* ================================
          2. 평균 수영 횟수
      ================================= */}

      <div className="record-question">
        <h2>2. 평균 수영 횟수 <span class="must-needed">*</span></h2>

        <div className="option-list">
          {SWIM_COUNT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`option-button ${
                swimCount === option ? 'selected' : ''
              }`}
              onClick={() => setSwimCount(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>


      {/* ================================
          3. 평균 수영 시간
      ================================= */}

      <div className="record-question">
        <h2>3. 평균 수영 시간 <span class="must-needed">*</span></h2>

        <div className="option-list two-two">
          {SWIM_TIME_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`option-button ${
                swimTime === option ? 'selected' : ''
              }`}
              onClick={() => setSwimTime(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>


      {/* ================================
          하단 버튼
      ================================= */}

      <div className="record-navigation">
        <button
          type="button"
          className={`record-next-button ${
            isComplete ? 'active' : ''
          }`}
          disabled={!isComplete}
          onClick={handleNext}
        >
          다음
        </button>

      </div>

    </section>
  );
}

export default SwimmingPattern;