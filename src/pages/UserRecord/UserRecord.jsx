import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StepIndicator from './components/StepIndicator/StepIndicator';
import SwimmingPattern from './components/SwimmingPattern/SwimmingPattern';
import SkinType from './components/SkinType/SkinType';

import timePrev from '../../assets/images/time-prev.svg';

import './UserRecord.css';

const API_URL =
  'https://miseno.store/api/v1/accounts/onboarding/';

function UserRecord() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [userData, setUserData] = useState({
    swimPeriod: '',
    swimCount: '',
    swimTime: '',
    skinTypes: [],
    symptoms: [],
    symptomAreas: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
  // 피부 → 사용자 기록 API
  // ========================================

  const handleSkinNext = async (data) => {
    // 중복 제출 방지
    if (isSubmitting) return;

    // 수영 + 피부 데이터 합치기
    const completeData = {
      ...userData,
      ...data,
    };

    // 로그인 시 저장한 JWT 가져오기
    const accessToken =
      localStorage.getItem('accessToken');

    // 토큰이 없는 경우
    if (!accessToken) {
      alert('로그인 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/');
      return;
    }

    // ========================================
    // API Request Body
    // ========================================

    const requestBody = {
      weekly_swim_count: completeData.swimCount,
      avg_swim_time: completeData.swimTime,
      swim_period: completeData.swimPeriod,
      skin_types: completeData.skinTypes,
      symptoms: completeData.symptoms,
      symptom_areas: completeData.symptomAreas,
    };

    console.log('사용자 기록 API 요청:', requestBody);

    try {
      setIsSubmitting(true);

      const response = await fetch(API_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      console.log(
        '사용자 기록 API 응답 상태:',
        response.status
      );

      console.log(
        '사용자 기록 API 응답:',
        responseData
      );

      // ========================================
      // 201 Created
      // → 기록 저장 성공
      // → RecordDone으로 이동
      // ========================================

      if (response.status === 201) {
        setUserData(completeData);

        navigate('/record-done');
        return;
      }

      // ========================================
      // 400 Bad Request
      // → 필수 항목 누락 등
      // ========================================

      if (response.status === 400) {
        alert(
          responseData.detail ||
            '필수 항목을 모두 입력해 주세요.'
        );
        return;
      }

      // ========================================
      // 401 Unauthorized
      // → 토큰 문제
      // ========================================

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');

        alert(
          '로그인 정보가 만료되었습니다. 다시 로그인해 주세요.'
        );

        navigate('/');
        return;
      }

      // ========================================
      // 그 외 서버 오류
      // ========================================

      console.error(
        '사용자 기록 저장 실패:',
        response.status,
        responseData
      );

      alert(
        responseData.detail ||
          '사용자 기록을 저장하지 못했습니다.'
      );
    } catch (error) {
      console.error(
        '사용자 기록 API 연결 오류:',
        error
      );

      alert('서버와 연결할 수 없습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================
  // 이전 버튼
  // ========================================

  const handlePrev = () => {
    if (isSubmitting) return;

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
          disabled={isSubmitting}
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