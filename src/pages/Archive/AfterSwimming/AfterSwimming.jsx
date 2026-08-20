import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import prevBtn from '../../../assets/images/prev-btn.svg';
import recordProcessDone from '../../../assets/images/record-process-done.svg';
import { createSwimRecord } from '../../../api/records';
import './AfterSwimming.css';

const SWIM_TIME_OPTIONS = ['30분 미만', '30~60분', '60~90분', '90분 이상'];
const SYMPTOM_OPTIONS = ['당김', '건조', '가려움', '붉음', '여드름', '없음'];
const SEVERITY_OPTIONS = ['하', '중', '상'];

function AfterSwimming() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [swimTime, setSwimTime] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [symptomSeverity, setSymptomSeverity] = useState({});
  const [memo, setMemo] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isSaved) return undefined;
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [isSaved, navigate]);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto({ file, preview: reader.result });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handlePhotoRemove = () => setPhoto(null);

  const handleSwimTimeClick = (option) => setSwimTime(option);

  const handleSymptomClick = (option) => {
    if (option === '없음') {
      setSymptoms((prev) => prev.includes('없음') ? [] : ['없음']);
      setSymptomSeverity({});
      return;
    }
    setSymptoms((prev) => {
      const withoutNone = prev.filter((item) => item !== '없음');
      if (withoutNone.includes(option)) {
        return withoutNone.filter((item) => item !== option);
      }
      return [...withoutNone, option];
    });
    setSymptomSeverity((prev) => {
      if (!prev[option]) return prev;
      const next = { ...prev };
      delete next[option];
      return next;
    });
  };

  const handleSeverityClick = (symptom, severity) => {
    setSymptomSeverity((prev) => ({ ...prev, [symptom]: severity }));
  };

  const hasAllSeverity = symptoms.length === 0 || symptoms.includes('없음') || symptoms.every((symptom) => Boolean(symptomSeverity[symptom]));
  const isComplete = photo !== null && swimTime !== '' && hasAllSeverity;

  const buildSymptomsPayload = () => {
    if (symptoms.length === 0 || symptoms.includes('없음')) return [];
    return symptoms.map((symptom) => ({ type: symptom, score: symptomSeverity[symptom] }));
  };

  const handleSave = async () => {
    if (!isComplete || isSaved || isSaving) return;
    setIsSaving(true);
    setErrorMessage('');

    try {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const startTime = now.toTimeString().slice(0, 5);

      const durationMap = { '30분 미만': 30, '30~60분': 60, '60~90분': 90, '90분 이상': 90 };
      const durationMinutes = durationMap[swimTime] ?? 0;
      const scheduleId = localStorage.getItem('currentSwimScheduleId');

      const response = await createSwimRecord({
        timing: 'AFTER',
        date,
        startTime,
        durationMinutes,
        photo: photo.file,
        schedule: scheduleId,
        swimTime,
        symptoms: buildSymptomsPayload(),
        memo,
      });

      const afterRecordId = response?.id || response?.record_id;
      if (afterRecordId) {
        localStorage.setItem('latestAfterRecordId', afterRecordId);
      }

      setIsSaved(true);
    } catch (error) {
      setErrorMessage(error?.message || '기록 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaved) {
    return (
      <main className="after-swimming-done">
        <div className="after-record-done-content">
          <img src={recordProcessDone} alt="저장 완료" className="after-record-done-icon" />
          <p>저장되었습니다</p>
        </div>
      </main>
    );
  }

  return (
    <main className="after-swimming-page">
      <header className="after-archive-record-header">
        <button type="button" className="after-archive-record-back" onClick={() => navigate(-1)} aria-label="이전">
          <img src={prevBtn} alt="이전" />
        </button>
      </header>
      <section className="after-archive-record-content">
        <section className="after-archive-record-section">
          <h2>수영 후 사진</h2>
          <div className="after-photo-upload-row">
            {photo ? (
              <div className="after-photo-preview-wrapper">
                <div className="after-photo-frame">
                  <img src={photo.preview} alt="수영 후 사진" />
                </div>
                <button type="button" className="after-photo-remove-button" onClick={handlePhotoRemove}>사진 삭제</button>
              </div>
            ) : (
              <label htmlFor="after-photo" className="after-photo-upload-box">
                <span className="after-photo-upload-plus">+</span>
                <span>이곳을 눌러<br />얼굴 사진을 첨부해 주세요</span>
                <input id="after-photo" type="file" accept="image/*" onChange={handlePhotoChange} hidden />
              </label>
            )}
            <div className="after-photo-guide">
              <strong>사진 첨부 팁</strong>
              <p>· 선명한 얼굴 사진을 첨부해 주세요.</p>
              <p>· 화장하지 않은 상태로 찍어주세요.</p>
              <p>· 피부 변화가 나타나는 부위를 포함해 주세요.</p>
            </div>
          </div>
        </section>
        <section className="after-archive-record-section">
          <h2>수영 시간</h2>
          <div className="after-swim-time-list">
            {SWIM_TIME_OPTIONS.map((option) => (
              <button key={option} type="button" className={`after-swim-time-button ${swimTime === option ? 'selected' : ''}`} onClick={() => handleSwimTimeClick(option)}>
                {option}
              </button>
            ))}
          </div>
        </section>
        <section className="after-archive-record-section">
          <h2>증상 선택</h2>
          <p className="after-archive-record-description">현재 느끼고 있는 피부 불편 증상을 선택해 주세요. (중복 선택 가능)</p>
          <div className="after-symptom-list">
            {SYMPTOM_OPTIONS.map((option) => (
              <button key={option} type="button" className={`after-symptom-button ${symptoms.includes(option) ? 'selected' : ''}`} onClick={() => handleSymptomClick(option)}>
                {option}
              </button>
            ))}
          </div>
        </section>
        {symptoms.length > 0 && !symptoms.includes('없음') && (
          <section className="after-archive-record-section">
            <h2>증상 강도</h2>
            <div className="after-severity-list">
              {symptoms.map((symptom) => (
                <div key={symptom} className="after-severity-row">
                  <span className="after-severity-name">{symptom}</span>
                  <div className="after-severity-buttons">
                    {SEVERITY_OPTIONS.map((severity) => (
                      <button key={severity} type="button" className={`after-severity-button ${symptomSeverity[symptom] === severity ? 'selected' : ''}`} onClick={() => handleSeverityClick(symptom, severity)}>
                        {severity}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <section className="after-archive-record-section">
          <h2>특이 사항</h2>
          <textarea className="after-archive-record-memo" value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="추가로 기록할 내용이 있다면 입력해 주세요." />
        </section>
        {errorMessage && <p role="alert" style={{ color: '#d33', marginBottom: '12px' }}>{errorMessage}</p>}
        <button type="button" className={`after-archive-record-save ${isComplete ? 'active' : ''}`} disabled={!isComplete || isSaving} onClick={handleSave}>
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </section>
    </main>
  );
}

export default AfterSwimming;