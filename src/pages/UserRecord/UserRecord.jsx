import { useState } from 'react';

import StepIndicator from './components/StepIndicator/StepIndicator';
import SwimmingPattern from './components/SwimmingPattern/SwimmingPattern';
import SkinType from './components/SkinType/SkinType';

import timePrev from '../../assets/images/time-prev.svg';

import './UserRecord.css';

function UserRecord() {
  const [step, setStep] = useState(1);

  const [userData, setUserData] = useState({
    swimPeriod: '',
    swimCount: '',
    swimTime: '',
    skinTypes: [],
    symptoms: [],
    symptomAreas: [],
  });

  // ========================================
  // 수영 패턴 → 피부
  // ========================================

  const handleSwimmingNext = (data) => {
    setUserData((prev) => ({
      ...prev,
      ...data,
    }));

    setStep(2);
  };

  // ========================================
  // 피부 → 온보딩 완료
  // ========================================

  const handleSkinNext = (data) => {
    const completeData = {
      ...userData,
      ...data,
    };

    setUserData(completeData);

    console.log('최종 사용자 기록:', completeData);

    // 이후 작업:
    // 1. 온보딩 API 요청
    // 2. API 성공 시 완료 화면으로 이동
  };

  // ========================================
  // 이전 버튼
  // ========================================

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
          <img
            src={timePrev}
            alt="이전 버튼"
          />
        </button>

        <StepIndicator currentStep={step} />
      </header>


      {/* ================================
          Content
      ================================= */}

      <div className="user-record-content">

        {/* 1단계: 수영 패턴 */}
        {step === 1 && (
          <SwimmingPattern
            onNext={handleSwimmingNext}
            onPrev={handlePrev}
          />
        )}

        {/* 2단계: 피부 */}
        {step === 2 && (
          <SkinType
            onNext={handleSkinNext}
            onPrev={handlePrev}
          />
        )}

      </div>

    </main>
  );
}

export default UserRecord;