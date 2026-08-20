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

    useEffect(() => {
        let isMounted = true;
        const dateKey = formatDateKey(selectedDate);

        // 🌟 1. 버튼 화면에서 넘어온 따끈따끈한 분석 데이터가 있다면 그대로 사용!
        const passedData = location.state?.analysisData;
        const passedDateStr = location.state?.selectedDate 
            ? formatDateKey(new Date(location.state.selectedDate)) 
            : null;

        if (passedData && passedDateStr === dateKey) {
            setAnalysisData(passedData);
            return; // 🚨 무한 루프를 막기 위해 여기서 딱 멈춥니다! (API 재호출 X)
        }

        // 🌟 2. 탭을 왔다 갔다 했거나, 달력 날짜를 바꿔서 데이터가 없다면 API로 정석 조회!
        const fetchAnalysis = async () => {
            // 새 날짜 조회 시 잠깐 빈 화면(로딩)을 보여주기 위해 상태 비움
            setAnalysisData(null); 
            
            try {
                const data = await apiRequest(`/api/v1/analysis/skin/?date=${dateKey}`);
                const results = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);

                if (results.length > 0) {
                    // 결과가 있으면 상세 API 찌르고 리포트 세팅!
                    const detailData = await apiRequest(`/api/v1/analysis/skin/${results[0].id}/`);
                    if (isMounted) setAnalysisData(detailData);
                } else {
                    // 결과가 없으면 백엔드 지침대로 버튼 화면(/analysis)으로 돌려보냄!
                    if (isMounted) {
                        navigate('/analysis', {
                            state: { selectedDate: selectedDate.toISOString() },
                            replace: true
                        });
                    }
                }
            } catch (error) {
                if (isMounted) {
                    navigate('/analysis', {
                        state: { selectedDate: selectedDate.toISOString() },
                        replace: true
                    });
                }
            }
        };

        fetchAnalysis();

        return () => {
            isMounted = false; // 컴포넌트가 사라지면 멈춤
        };
    }, [selectedDate, location.state, navigate]);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    if (!analysisData) {
        return (
            <div className="analysis-container">
                <WeeklyCalendar
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                />

                <div className="analysis-tab-menu">
                    <div
                        className="tab-item active"
                        onClick={() => navigate('/analysis')}
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

                <div className="analysis-content empty-state-wrapper">
                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: '40px',
                            color: '#767676',
                        }}
                    >
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