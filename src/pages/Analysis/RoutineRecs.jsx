import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestRoutineRecs } from '../../api/report';
import './RoutineRecs.css';
import prevBtn from '../../assets/images/prev-btn.svg';
import arrowPrev from '../../assets/images/arrow-prev.svg';
import arrowNext from '../../assets/images/arrow-next.svg';

function RoutineRecs() {
    const navigate = useNavigate();
    const [routineData, setRoutineData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const data = await getLatestRoutineRecs();
                setRoutineData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoutine();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.replace(/-/g, '.');
    };

    if (isLoading) {
        return <div className="routine-recs-loading" style={{ textAlign: 'center', marginTop: '50px', color: '#767676' }}>루틴을 불러오는 중입니다...</div>;
    }

    if (!routineData) {
        return (
            <div className="routine-recs-empty">
                <header className="routine-header">
                    <button type="button" className="back-btn" onClick={() => navigate(-1)} style={{ zIndex: 10, position: 'relative' }}>
                        <img src={prevBtn} alt="뒤로가기" />
                    </button>
                    <h1 className="header-title">수영 루틴 추천</h1>
                    <div className="header-spacer" />
                </header>
                <div className="empty-message" style={{ textAlign: 'center', marginTop: '50px', color: '#767676' }}>
                    아직 생성된 수영·피부 루틴이 없습니다.
                </div>
            </div>
        );
    }

    const {
        week_start,
        week_end,
        intensity_note,
        recommended_swim_count,
        recommended_swim_minutes,
        condition_text,
        skin_care_routine
    } = routineData;

    const displaySwimCount = typeof recommended_swim_count === 'number' ? `주 ${recommended_swim_count}회` : recommended_swim_count;
    const displaySwimMinutes = typeof recommended_swim_minutes === 'number' ? `${recommended_swim_minutes}분` : recommended_swim_minutes;

    return (
        <div className="routine-recs-container">
            <header className="routine-header">
                <button type="button" className="back-btn" onClick={() => navigate(-1)} style={{ zIndex: 10, position: 'relative' }}>
                    <img src={prevBtn} alt="뒤로가기" />
                </button>
                <h1 className="header-title">수영 루틴 추천</h1>
                <div className="header-spacer" />
            </header>

            <div className="routine-date-selector">
                <img src={arrowPrev} alt="이전 주" className="date-arrow" />
                <span className="date-range">
                    {formatDate(week_start || '2026-08-10')} ~ {formatDate(week_end || '2026-08-16')}
                </span>
                <img src={arrowNext} alt="다음 주" className="date-arrow" />
            </div>

            <section className="routine-section">
                <h2 className="section-title">수영 플랜 추천</h2>
                <div className="plan-card">
                    <h3 className="plan-intensity">{intensity_note || '회복 전까지 강도는 가볍게'}</h3>

                    <div className="plan-stats-row">
                        <div className="plan-stat">
                            <span className="stat-label">권장 횟수</span>
                            <span className="stat-value">{displaySwimCount || '주 2회'}</span>
                        </div>
                        <div className="plan-stat">
                            <span className="stat-label">권장 시간</span>
                            <span className="stat-value">{displaySwimMinutes || '30~40분'}</span>
                        </div>
                    </div>

                    <p className="plan-condition">{condition_text || '붉음·당김이 2일 연속 감소하면 기존 루틴으로 돌아가세요.'}</p>
                </div>
            </section>

            <section className="routine-section">
                <h2 className="section-title">피부 관리 루틴 추천</h2>
                <p className="section-subtitle">복합성·민감 피부와 최근 일주일 기록을 반영했어요.</p>

                <div className="skincare-routine-list">
                    {skin_care_routine && skin_care_routine.map((routine, idx) => (
                        <div key={idx} className="skincare-card">
                            <h4 className="skincare-title">{routine.name || `${routine.priority}순위 루틴`}</h4>
                            <ul className="skincare-steps">
                                {routine.steps && routine.steps.map((step, stepIdx) => (
                                    <li key={stepIdx}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default RoutineRecs;