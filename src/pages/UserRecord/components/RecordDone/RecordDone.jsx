import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import recordProcessDone from '../../../../assets/images/record-process-done.svg';

import './RecordDone.css';

function RecordDone() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="record-done">
      <div className="record-done-content">
        <img
          className="record-done-icon"
          src={recordProcessDone}
          alt="기록 완료"
        />

        <p className="record-done-message">
          기록이 저장되었습니다.
        </p>
      </div>
    </main>
  );
}

export default RecordDone;