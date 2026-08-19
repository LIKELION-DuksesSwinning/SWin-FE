import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AIanalysis.css';
import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar.jsx';
import rightArrow from '../../assets/images/arrow-next.svg';

const PATTERN_MAP = {
    'redness_type': '붉음 반응형',
    'dry_tight_type': '건조·당김형',
    'itch_type': '가려움 반응형',
    'trouble_type': '트러블 반응형',
    'normal': '이상 없음',
    'need_expert': '전문 확인 필요'
};

const SYMPTOM_MAP = {
    'redness': '붉음',
    'dry': '건조',
    'tight': '당김',
    'itchy': '가려움',
    'trouble': '트러블'
};

const TREND_MAP = {
    'worsened': '악화',
    'improved': '호전',
    'maintained': '유지',
    'no_record': '기록 없음'
};

const AIanalysis = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [analysisData] = useState(() => {
        const realData = location.state?.analysisData;
        if (!realData) return null;

        return {
            ...realData,
            symptom_changes: [
                { symptomType: "itchy", before: 2, after: 5 },
                { symptomType: "redness", before: 3, after: 4 },
                { symptomType: "trouble", before: 1, after: 5 }
            ],
            four_week_trend: [
                { symptomType: "dry", trend: "no_record" },
                { symptomType: "tight", trend: "no_record" },
                { symptomType: "itchy", trend: "worsened" },
                { symptomType: "redness", trend: "maintained" },
                { symptomType: "trouble", trend: "worsened" }
            ],
            clinic_recommendation: {
                shown: true,
                text: "최근 수영 후 붉음이 4회 이상 기록되었습니다.\n정확한 피부 분석을 위해 더나 클리닉 상담을 추천드려요.",
                ctaLabel: "더나 클리닉 예약 바로가기"
            }
        };
    });

    if (!analysisData) {
        return (
            <div className="analysis-container">
                <WeeklyCalendar />
                <div className="analysis-tab-menu">
                    <div className="tab-item active">AI 피부 분석</div>
                    <div className="tab-item" onClick={() => navigate('/analysis/swim-report')}>SWin 리포트</div>
                    <div className="tab-item disabled">시술 리포트</div>
                </div>
                <div className="analysis-content empty-state-wrapper">
                    <p style={{ textAlign: 'center', marginTop: '40px', color: '#767676' }}>
                        분석 데이터를 불러오지 못했습니다. 다시 시도해 주세요.
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
            <WeeklyCalendar />

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

            <div className="analysis-content result-wrapper">

                <div className="pattern-box">
                    <span className="pattern-label">관찰된 패턴</span>
                    <div className="pattern-tags">
                        {analysisData.pattern_types.map((type, idx) => (
                            <h2 key={idx} className="pattern-title">
                                {PATTERN_MAP[type] || type}
                            </h2>
                        ))}
                    </div>
                    <p className="pattern-desc">{analysisData.pattern_description}</p>
                    <p className="pattern-disclaimer">⚠ {analysisData.disclaimer}</p>
                </div>

                <div className="graph-trend">

                </div>
                <div className="section-block">
                    <h3 className="section-title">수영 전후 주요 변화</h3>
                    <div className="symptom-changes-list">
                        {analysisData.symptom_changes.map((change, idx) => (
                            <div key={idx} className="symptom-row">
                                <span className="symptom-name">{SYMPTOM_MAP[change.symptomType] || change.symptomType}</span>
                                <div className="bar-container">
                                    <div className="bar-wrapper before-bar">
                                        <div
                                            className="bar-fill"
                                            style={{ width: getBarWidth(change.before), backgroundColor: getBarColor(change.before) }}
                                        />
                                    </div>
                                    <span className="arrow">→</span>
                                    <div className="bar-wrapper after-bar">
                                        <div
                                            className="bar-fill"
                                            style={{ width: getBarWidth(change.after), backgroundColor: getBarColor(change.after) }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="section-block">
                    <h3 className="section-title">최근 4주 경향</h3>
                    <div className="trend-list">
                        {analysisData.four_week_trend.map((trend, idx) => (
                            <div key={idx} className="trend-row">
                                <span className="trend-name">{SYMPTOM_MAP[trend.symptomType] || trend.symptomType}</span>
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
                            {analysisData.clinic_recommendation.text.split('\n').map((line, i) => (
                                <React.Fragment key={i}>{line}<br /></React.Fragment>
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