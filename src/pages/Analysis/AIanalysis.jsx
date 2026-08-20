import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    useLocation,
    useNavigate,
} from 'react-router-dom';

import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar.jsx';
import rightArrow from '../../assets/images/arrow-next.svg';
import { apiRequest } from '../../api/axios';

import './AIanalysis.css';

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
    if (!(date instanceof Date)) {
        return '';
    }

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
        date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

function AIanalysis() {
    const navigate = useNavigate();
    const location = useLocation();

    const initialRouteState = useRef(
        location.state ?? {}
    );

    const [selectedDate, setSelectedDate] =
        useState(() => {
            const passedDate =
                initialRouteState.current
                    ?.selectedDate ??
                initialRouteState.current?.date;

            if (passedDate) {
                const parsedDate =
                    new Date(passedDate);

                if (
                    !Number.isNaN(
                        parsedDate.getTime()
                    )
                ) {
                    return parsedDate;
                }
            }

            return new Date();
        });

    const [analysisData, setAnalysisData] =
        useState(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const selectedDateKey =
        formatDateKey(selectedDate);

    useEffect(() => {
        let isMounted = true;

        async function fetchAnalysis() {
            try {
                setIsLoading(true);
                setError('');

                const routeState =
                    initialRouteState.current;

                const passedAnalysisData =
                    routeState?.analysisData;

                const passedDate =
                    routeState?.selectedDate ??
                    routeState?.date;

                const normalizedPassedData =
                    passedAnalysisData?.data ??
                    passedAnalysisData;

                if (
                    normalizedPassedData &&
                    (
                        !passedDate ||
                        formatDateKey(
                            new Date(passedDate)
                        ) === selectedDateKey
                    )
                ) {
                    if (isMounted) {
                        setAnalysisData(
                            normalizedPassedData
                        );
                    }

                    return;
                }

                const listResponse =
                    await apiRequest(
                        `/api/v1/analysis/skin/?date=${selectedDateKey}`
                    );

                const listData =
                    listResponse?.data ??
                    listResponse;

                const results =
                    Array.isArray(listData)
                        ? listData
                        : Array.isArray(
                                listData?.results
                            )
                            ? listData.results
                            : listData?.id ||
                                    listData?.analysis_id
                                ? [listData]
                                : [];

                if (results.length === 0) {
                    if (isMounted) {
                        setAnalysisData(null);

                        setError(
                            '선택하신 날짜의 분석 리포트가 없습니다.'
                        );
                    }

                    return;
                }

                const analysisId =
                    results[0]?.id ??
                    results[0]?.analysis_id;

                if (!analysisId) {
                    throw new Error(
                        '분석 결과 ID가 없습니다.'
                    );
                }

                const detailResponse =
                    await apiRequest(
                        `/api/v1/analysis/skin/${analysisId}/`
                    );

                const detailData =
                    detailResponse?.data ??
                    detailResponse;

                if (!detailData) {
                    throw new Error(
                        '분석 상세 데이터가 없습니다.'
                    );
                }

                if (isMounted) {
                    setAnalysisData(
                        detailData
                    );
                }
            } catch (requestError) {
                console.error(
                    'AI 피부 분석 조회 실패:',
                    requestError
                );

                if (isMounted) {
                    setAnalysisData(null);

                    setError(
                        '분석 데이터를 불러오지 못했습니다.'
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        if (!selectedDateKey) {
            setAnalysisData(null);
            setIsLoading(false);

            setError(
                '선택한 날짜가 올바르지 않습니다.'
            );

            return undefined;
        }

        fetchAnalysis();

        return () => {
            isMounted = false;
        };
    }, [selectedDateKey]);

    const handleDateChange = useCallback(
        (newDate) => {
            const parsedDate =
                newDate instanceof Date
                    ? newDate
                    : new Date(newDate);

            if (
                Number.isNaN(
                    parsedDate.getTime()
                )
            ) {
                return;
            }

            setSelectedDate(
                (previousDate) => {
                    const previousDateKey =
                        formatDateKey(
                            previousDate
                        );

                    const nextDateKey =
                        formatDateKey(
                            parsedDate
                        );

                    if (
                        previousDateKey ===
                        nextDateKey
                    ) {
                        return previousDate;
                    }

                    return parsedDate;
                }
            );
        },
        []
    );

    const getBarWidth = (score) => {
        const numericScore =
            Number(score) || 0;

        const safeScore = Math.min(
            Math.max(numericScore, 0),
            5
        );

        return `${
            (safeScore / 5) * 100
        }%`;
    };

    const getBarColor = (score) => {
        const numericScore =
            Number(score) || 0;

        if (numericScore >= 4) {
            return '#FF3636';
        }

        if (numericScore >= 2) {
            return '#FFA800';
        }

        return '#008AF4';
    };

    const renderCalendarAndTabs = () => (
        <>
            <WeeklyCalendar
                selectedDate={selectedDate}
                onDateChange={
                    handleDateChange
                }
            />

            <div className="analysis-tab-menu">
                <div className="tab-item active">
                    AI 피부 분석
                </div>

                <div
                    className="tab-item"
                    onClick={() =>
                        navigate(
                            '/analysis/swim-report'
                        )
                    }
                >
                    SWin 리포트
                </div>

                <div
                    className="tab-item"
                    onClick={() =>
                        navigate(
                            '/analysis/clinic-report'
                        )
                    }
                >
                    시술 리포트
                </div>
            </div>
        </>
    );

    if (isLoading) {
        return (
            <div className="analysis-container">
                {renderCalendarAndTabs()}

                <div className="analysis-content empty-state-wrapper">
                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: '40px',
                            color: '#767676',
                        }}
                    >
                        분석 데이터를 불러오는
                        중입니다...
                    </p>
                </div>
            </div>
        );
    }

    if (!analysisData) {
        return (
            <div className="analysis-container">
                {renderCalendarAndTabs()}

                <div className="analysis-content empty-state-wrapper">
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '80px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <p
                            style={{
                                color: '#111111',
                                fontSize: '16px',
                                lineHeight: '1.5',
                                marginBottom: '32px',
                                fontWeight: '500',
                            }}
                        >
                            {error ||
                                '선택하신 날짜의 리포트를 찾을 수 없습니다.'}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    '/analysis/start'
                                )
                            }
                            style={{
                                padding: '14px 40px',
                                backgroundColor:
                                    '#0056D2',
                                color: '#FFFFFF',
                                borderRadius: '12px',
                                border: 'none',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            분석 시작 화면으로 가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="analysis-container">
            {renderCalendarAndTabs()}

            <div className="analysis-content result-wrapper">
                <div className="pattern-box">
                    <span className="pattern-label">
                        관찰된 패턴
                    </span>

                    <div className="pattern-tags">
                        {analysisData.pattern_types?.map(
                            (type, index) => (
                                <h2
                                    key={`${type}-${index}`}
                                    className="pattern-title"
                                >
                                    {PATTERN_MAP[type] ||
                                        type}
                                </h2>
                            )
                        )}
                    </div>

                    <p className="pattern-desc">
                        {
                            analysisData.pattern_description
                        }
                    </p>

                    {analysisData.disclaimer && (
                        <p className="pattern-disclaimer">
                            ⚠ {analysisData.disclaimer}
                        </p>
                    )}
                </div>

                <div className="section-block">
                    <h3 className="section-title">
                        수영 전후 주요 변화
                    </h3>

                    <div className="symptom-changes-list">
                        {analysisData.symptom_changes?.map(
                            (change, index) => {
                                const symptomType =
                                    change.symptomType ??
                                    change.symptom_type;

                                const beforeScore =
                                    Number(
                                        change.before
                                    ) || 0;

                                const afterScore =
                                    Number(
                                        change.after
                                    ) || 0;

                                return (
                                    <div
                                        key={`${symptomType}-${index}`}
                                        className="symptom-row"
                                    >
                                        <span className="symptom-name">
                                            {SYMPTOM_MAP[
                                                symptomType
                                            ] ||
                                                symptomType}
                                        </span>

                                        <div className="bar-container">
                                            <div
                                                className="bar-wrapper"
                                                style={{
                                                    backgroundColor:
                                                        '#F5F5F5',
                                                }}
                                            >
                                                {beforeScore >
                                                    0 && (
                                                    <div
                                                        className="bar-fill"
                                                        style={{
                                                            width:
                                                                getBarWidth(
                                                                    beforeScore
                                                                ),
                                                            backgroundColor:
                                                                getBarColor(
                                                                    beforeScore
                                                                ),
                                                        }}
                                                    />
                                                )}
                                            </div>

                                            <span className="arrow">
                                                →
                                            </span>

                                            <div
                                                className="bar-wrapper"
                                                style={{
                                                    backgroundColor:
                                                        '#F5F5F5',
                                                }}
                                            >
                                                {afterScore >
                                                    0 && (
                                                    <div
                                                        className="bar-fill"
                                                        style={{
                                                            width:
                                                                getBarWidth(
                                                                    afterScore
                                                                ),
                                                            backgroundColor:
                                                                getBarColor(
                                                                    afterScore
                                                                ),
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                <div className="section-block">
                    <h3 className="section-title">
                        최근 4주 경향
                    </h3>

                    <div className="trend-list">
                        {analysisData.four_week_trend?.map(
                            (trend, index) => {
                                const symptomType =
                                    trend.symptomType ??
                                    trend.symptom_type;

                                return (
                                    <div
                                        key={`${symptomType}-${index}`}
                                        className="trend-row"
                                    >
                                        <span className="trend-name">
                                            {SYMPTOM_MAP[
                                                symptomType
                                            ] ||
                                                symptomType}
                                        </span>

                                        <span
                                            className={`trend-value ${
                                                trend.trend || ''
                                            }`}
                                        >
                                            {TREND_MAP[
                                                trend.trend
                                            ] ||
                                                trend.trend}
                                        </span>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                {analysisData
                    .clinic_recommendation
                    ?.shown && (
                    <div className="section-block recommendation-block">
                        <h3 className="section-title">
                            권장 사항
                        </h3>

                        <p className="recommendation-text">
                            {analysisData
                                .clinic_recommendation
                                .text
                                ?.split('\n')
                                .map(
                                    (line, index) => (
                                        <React.Fragment
                                            key={`${line}-${index}`}
                                        >
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    )
                                )}
                        </p>

                        <button
                            type="button"
                            className="clinic-reservation-btn"
                            onClick={() =>
                                navigate('/clinic')
                            }
                        >
                            {analysisData
                                .clinic_recommendation
                                .ctaLabel ??
                                analysisData
                                    .clinic_recommendation
                                    .cta_label ??
                                '클리닉 예약하기'}

                            <img
                                src={rightArrow}
                                alt=""
                                className="btn-arrow"
                            />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AIanalysis;