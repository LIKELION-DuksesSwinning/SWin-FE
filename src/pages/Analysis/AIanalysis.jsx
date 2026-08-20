import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AIanalysis.css';
import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar.jsx';
import rightArrow from '../../assets/images/arrow-next.svg';
import { apiRequest } from '../../api/axios';

const PATTERN_MAP = {
    redness_type: '붉음 반응형',
    dry_tight_type: '건조·당김형',
    itch_type: '가려움 반응형',
    trouble_type: '트러블 반응형',
    normal: '이상 없음',
    need_expert: '전문 확인 필요',
};

const SYMPTOM_MAP = {
    redness: '붉음',
    dry: '건조',
    tight: '당김',
    itchy: '가려움',
    trouble: '트러블',
};

const TREND_MAP = {
    worsened: '악화',
    improved: '호전',
    maintained: '유지',
    no_record: '기록 없음',
};

const formatDateKey = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const AIanalysis = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedDate, setSelectedDate] = useState(() => {
        const passedDate = location.state?.selectedDate || location.state?.date;
        return passedDate ? new Date(passedDate) : new Date();
    });

    const [analysisData, setAnalysisData] = useState(null);
    // 🌟 무한 루프를 막기 위한 에러 상태 추가
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setHasError(false); // 날짜가 바뀌면 에러 리셋

        const dateKey = formatDateKey(selectedDate);
        const passedData = location.state?.analysisData;
        const passedDateStr = location.state?.selectedDate 
            ? formatDateKey(new Date(location.state.selectedDate)) 
            : null;

        // 🌟 1. 방금 분석 버튼을 눌러서 넘어온 따끈따끈한 데이터가 있다면!
        // 🚨 절대 navigate로 state를 지우지 않습니다. 
        if (passedData && passedDateStr === dateKey) {
            setAnalysisData(passedData);
            return; // 여기서 멈춤 (API 재호출 X)
        }

        // 🌟 2. 탭을 이동했거나, 달력에서 새 날짜를 누른 경우
        const fetchAnalysis = async () => {
            setAnalysisData(null); 
            
            try {
                const data = await apiRequest(`/api/v1/analysis/skin/?date=${dateKey}`);
                const results = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);

                if (results.length > 0) {
                    const detailData = await apiRequest(`/api/v1/analysis/skin/${results[0].id}/`);
                    if (isMounted) setAnalysisData(detailData);
                } else {
                    // 🚨 [핵심 해결] 결과가 없어도 강제로 navigate 하지 않습니다!! (무한루프 방지)
                    if (isMounted) setHasError(true);
                }
            } catch (error) {
                // 🚨 에러가 나도 강제로 navigate 하지 않습니다!!
                if (isMounted) setHasError(true);
            }
        };

        fetchAnalysis();

        return () => { isMounted = false; };
    }, [selectedDate, location.state]); // navigate 의존성 제거

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    // 🌟 에러 발생 시 UI (사용자가 버튼을 눌러야만 이동함 = 무한 루프 절대 발생 불가)
    if (hasError) {
        return (
            <div className="analysis-container">
                <WeeklyCalendar selectedDate={selectedDate} onDateChange={handleDateChange} />
                <div className="analysis-tab-menu">
                    <div className="tab-item active" onClick={() => navigate('/analysis')}>AI 피부 분석</div>
                    <div className="tab-item" onClick={() => navigate('/analysis/swim-report')}>SWin 리포트</div>
                    <div className="tab-item" onClick={() => navigate('/analysis/clinic-report')}>시술 리포트</div>
                </div>
                <div className="analysis-content empty-state-wrapper">
                    <div style={{ textAlign: 'center', marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <p style={{ color: '#111111', fontSize: '16px', lineHeight: '1.5', marginBottom: '32px', fontWeight: '500' }}>
                            선택하신 날짜의 리포트를 찾을 수 없습니다.<br />다시 시도해 주세요.
                        </p>
                        <button
                            onClick={() => navigate('/analysis')}
                            style={{
                                padding: '14px 40px',
                                backgroundColor: '#0056D2',
                                color: '#FFFFFF',
                                borderRadius: '12px',
                                border: 'none',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            분석 화면으로 가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 로딩 중 UI
    if (!analysisData) {
        return (
            <div className="analysis-container">
                <WeeklyCalendar selectedDate={selectedDate} onDateChange={handleDateChange} />
                <div className="analysis-tab-menu">
                    <div className="tab-item active" onClick={() => navigate('/analysis')}>AI 피부 분석</div>
                    <div className="tab-item" onClick={() => navigate('/analysis/swim-report')}>SWin 리포트</div>
                    <div className="tab-item" onClick={() => navigate('/analysis/clinic-report')}>시술 리포트</div>
                </div>
                <div className="analysis-content empty-state-wrapper">
                    <p style={{ textAlign: 'center', marginTop: '40px', color: '#767676' }}>
                        분석 데이터를 불러오는 중입니다...
                    </p>
                </div>
            </div>
        );
    }

    const getBarWidth = (score) => {
        return `${(score / 5) * 100}%`;
    };

    const getBarColor = (score) => {
        if (score >= 4) return '#FF3636';
        if (score >= 2) return '#FFA800';
        return '#008AF4';
    };

    return (
        <div className="analysis-container">
            <WeeklyCalendar
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />

            <div className="analysis-tab-menu">
                <div
                    className="tab-item active"
                    onClick={() => navigate('/analysis/result')}
                >
                    AI 피부 분석
                </div>
                <div
                    className="tab-item"
                    onClick={() => navigate('/analysis/swim-report')}
                >
                    SWin 리포트
                </div>
                <div
                    className="tab-item"
                    onClick={() => navigate('/analysis/clinic-report')}
                >
                    시술 리포트
                </div>
            </div>

            <div className="analysis-content result-wrapper">
                <div className="pattern-box">
                    <span className="pattern-label">관찰된 패턴</span>
                    <div className="pattern-tags">
                        {analysisData.pattern_types?.map((type, idx) => (
                            <h2 key={idx} className="pattern-title">
                                {PATTERN_MAP[type] || type}
                            </h2>
                        ))}
                    </div>
                    <p className="pattern-desc">
                        {analysisData.pattern_description}
                    </p>
                    <p className="pattern-disclaimer">
                        ⚠ {analysisData.disclaimer}
                    </p>
                </div>

                <div className="section-block">
                    <h3 className="section-title">수영 전후 주요 변화</h3>
                    <div className="symptom-changes-list">
                        {analysisData.symptom_changes?.map((change, idx) => (
                            <div key={idx} className="symptom-row">
                                <span className="symptom-name">
                                    {SYMPTOM_MAP[change.symptomType] || change.symptomType}
                                </span>
                                <div className="bar-container">
                                    <div className="bar-wrapper" style={{ backgroundColor: '#F5F5F5' }}>
                                        {change.before > 0 && (
                                            <div
                                                className="bar-fill"
                                                style={{
                                                    width: getBarWidth(change.before),
                                                    backgroundColor: getBarColor(change.before),
                                                }}
                                            />
                                        )}
                                    </div>
                                    <span className="arrow">→</span>
                                    <div className="bar-wrapper" style={{ backgroundColor: '#F5F5F5' }}>
                                        {change.after > 0 && (
                                            <div
                                                className="bar-fill"
                                                style={{
                                                    width: getBarWidth(change.after),
                                                    backgroundColor: getBarColor(change.after),
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="section-block">
                    <h3 className="section-title">최근 4주 경향</h3>
                    <div className="trend-list">
                        {analysisData.four_week_trend?.map((trend, idx) => (
                            <div key={idx} className="trend-row">
                                <span className="trend-name">
                                    {SYMPTOM_MAP[trend.symptomType] || trend.symptomType}
                                </span>
                                <span className={`trend-value ${trend.trend}`}>
                                    {TREND_MAP[trend.trend] || trend.trend}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {analysisData.clinic_recommendation?.shown && (
                    <div className="section-block recommendation-block">
                        <h3 className="section-title">권장 사항</h3>
                        <p className="recommendation-text">
                            {analysisData.clinic_recommendation.text?.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </p>
                        <button
                            className="clinic-reservation-btn"
                            onClick={() => navigate('/clinic')}
                        >
                            {analysisData.clinic_recommendation.ctaLabel}
                            <img src={rightArrow} alt="이동" className="btn-arrow" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIanalysis;