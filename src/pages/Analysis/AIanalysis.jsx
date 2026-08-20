import React, {
    useCallback,
    useEffect,
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

    const [selectedDate, setSelectedDate] = useState(() => {
        const passedDate =
            location.state?.selectedDate ??
            location.state?.date;

        if (passedDate) {
            const parsedDate = new Date(passedDate);

            if (!Number.isNaN(parsedDate.getTime())) {
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
        let cancelled = false;

        async function fetchAnalysis() {
            const passedAnalysisData =
                location.state?.analysisData;

            const passedDate =
                location.state?.selectedDate ??
                location.state?.date;

            try {
                setIsLoading(true);
                setError('');

                /*
                 * 이전 페이지에서 분석 결과와 날짜를 함께
                 * 전달받은 경우에는 API를 다시 호출하지 않고
                 * 전달받은 데이터를 사용합니다.
                 */
                if (
                    passedAnalysisData &&
                    passedDate &&
                    formatDateKey(
                        new Date(passedDate)
                    ) === selectedDateKey
                ) {
                    if (!cancelled) {
                        setAnalysisData(
                            passedAnalysisData
                        );
                    }

                    return;
                }

                /*
                 * 선택한 날짜의 피부 분석 목록을 조회합니다.
                 */
                const listResponse =
                    await apiRequest(
                        `/api/v1/analysis/skin/?date=${selectedDateKey}`
                    );

                /*
                 * apiRequest가 Axios 응답 전체를 반환하는 경우와
                 * data만 반환하는 경우를 모두 처리합니다.
                 */
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
                            : listData?.id
                                ? [listData]
                                : [];

                /*
                 * 해당 날짜의 분석 결과가 없는 경우입니다.
                 */
                if (results.length === 0) {
                    if (!cancelled) {
                        setAnalysisData(null);
                    }

                    return;
                }

                const analysisId =
                    results[0]?.id;

                if (!analysisId) {
                    throw new Error(
                        '분석 결과 ID가 없습니다.'
                    );
                }

                /*
                 * 목록에서 가져온 ID로 상세 결과를 조회합니다.
                 */
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

                if (!cancelled) {
                    setAnalysisData(
                        detailData
                    );
                }
            } catch (requestError) {
                console.error(
                    'AI 피부 분석 조회 실패:',
                    requestError
                );

                if (!cancelled) {
                    setAnalysisData(null);

                    setError(
                        '분석 데이터를 불러오지 못했습니다.'
                    );
                }
            } finally {
                if (!cancelled) {
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
            cancelled = true;
        };
    }, [
        selectedDateKey,
        location.key,
        location.state,
    ]);

    /*
     * WeeklyCalendar가 같은 날짜를 새로운 Date 객체로
     * 반복 전달하더라도 상태를 변경하지 않습니다.
     */
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

        return `${(safeScore / 5) * 100}%`;
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
                <div
                    className="tab-item active"
                    onClick={() =>
                        navigate('/analysis')
                    }
                >
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

    /*
     * API 요청 중에만 로딩 문구를 표시합니다.
     */
    if (isLoading) {
        return (
            <div className="analysis-container">
                {renderCalendarAndTabs()}

                <div className="analysis-content empty-state-wrapper">
                    <p
                        style={{
                            textAlign:
                                'center',
                            marginTop:
                                '40px',
                            color:
                                '#767676',
                        }}
                    >
                        분석 데이터를 불러오는
                        중입니다...
                    </p>
                </div>
            </div>
        );
    }

    /*
     * 요청에 실패했거나 선택 날짜에 결과가 없는 경우입니다.
     */
    if (!analysisData) {
        return (
            <div className="analysis-container">
                {renderCalendarAndTabs()}

                <div className="analysis-content empty-state-wrapper">
                    <p
                        style={{
                            textAlign:
                                'center',
                            marginTop:
                                '40px',
                            color:
                                '#767676',
                        }}
                    >
                        {error ||
                            '선택하신 날짜의 분석 리포트가 없습니다.'}
                    </p>
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
                            (type) => (
                                <h2
                                    key={type}
                                    className="pattern-title"
                                >
                                    {PATTERN_MAP[
                                        type
                                    ] || type}
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
                            ⚠{' '}
                            {
                                analysisData.disclaimer
                            }
                        </p>
                    )}
                </div>

                <div className="section-block">
                    <h3 className="section-title">
                        수영 전후 주요 변화
                    </h3>

                    <div className="symptom-changes-list">
                        {analysisData.symptom_changes?.map(
                            (
                                change,
                                index
                            ) => {
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
                            (
                                trend,
                                index
                            ) => {
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
                                                trend.trend ||
                                                ''
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
                            {analysisData.clinic_recommendation.text
                                ?.split('\n')
                                .map(
                                    (
                                        line,
                                        index
                                    ) => (
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
                                navigate(
                                    '/clinic'
                                )
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
                                src={
                                    rightArrow
                                }
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