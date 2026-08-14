import { useState } from 'react';

import StepIndicator from './components/StepIndicator/StepIndicator';
import SwimmingPattern from './components/SwimmingPattern/SwimmingPattern';

import timePrev from '../../assets/images/time-prev.svg';

import './UserRecord.css';

function UserRecord() {
  const [step, setStep] = useState(1);

  const [userData, setUserData] = useState({
    swimPeriod: '',
    swimCount: '',
    swimTime: '',
  });


  // 수영 패턴 → 다음 단계
  const handleSwimmingNext = (data) => {
    setUserData((prev) => ({
      ...prev,
      ...data,
    }));

    setStep(2);
  };


  // 이전 버튼
  const handlePrev = () => {
    if (step === 1) {
      window.history.back();
      return;
    }

    setStep((prev) => prev - 1);
  };


  return (
    <main className="user-record">

      {/* ================================
          Header
      ================================= */}

      <header className="user-record-header">

        <button
          type="button"
          className="user-record-back"
          onClick={handlePrev}
          aria-label="이전"
        >
          <img src={timePrev} alt="이전 버튼"/>
        </button>

        <StepIndicator currentStep={step} />

      </header>


      {/* ================================
          Content
      ================================= */}

      <div className="user-record-content">

        {step === 1 && (
          <SwimmingPattern
            onNext={handleSwimmingNext}
            onPrev={handlePrev}
          />
        )}

      </div>

    </main>
  );
}

export default UserRecord;