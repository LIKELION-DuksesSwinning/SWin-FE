import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ClickForAnalysis.css';
import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar.jsx';
import reportGrey from '../../assets/images/report-grey.svg';
import analysisNext from '../../assets/images/analysis-next.svg';
import { getSwimRecords } from '../../api/records';
import { apiRequest } from '../../api/axios';

const API_BASE_URL = 'https://miseno.store/api/v1/analysis';

const formatDateKey = (date) => {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const ClickForAnalysis = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedDate, setSelectedDate] = useState(() => {
        const passedDate = location.state?.selectedDate;
        return passedDate ? new Date(passedDate) : new Date();
    });

    const [showNoRecordError, setShowNoRecordError] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const loadRecords = async () => {
            try {
                const data = await getSwimRecords('latest');
                const fetchedRecords = Array.isArray(data?.records) ? data.records : [];
                setRecords(fetchedRecords);
            } catch (error) {
                setRecords([]);
            }
        };
        loadRecords();
    }, []);

    useEffect(() => {
        const checkExistingAnalysis = async () => {
            try {
                const dateKey = formatDateKey(selectedDate);
                const data = await apiRequest(`/api/v1/analysis/skin/?date=${dateKey}`);
                const results = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);

                if (results.length > 0) {
                    const detailData = await apiRequest(`/api/v1/analysis/skin/${results[0].id}/`);
                    navigate('/analysis/result', {
                        state: {
                            analysisData: detailData,
                            selectedDate: selectedDate.toISOString(),
                        },
                        replace: true,
                    });
                }
            } catch (error) {
            }
        };

        checkExistingAnalysis();
    }, [selectedDate, navigate]);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        setShowNoRecordError(false);
    };

    const getAfterRecordForSelectedDate = (recordList) => {
        const selectedDateKey = formatDateKey(selectedDate);

        return recordList.find((record) => {
            if (record.timing !== 'AFTER') {
                return false;
            }

            if (!record.created_at) {
                return false;
            }

            return record.created_at.slice(0, 10) === selectedDateKey;
        });
    };

    const handleAnalysisStart = async () => {
        if (isChecking) return;

        setIsChecking(true);
        setShowNoRecordError(false);

        try {
            const data = await getSwimRecords('latest');
            const fetchedRecords = Array.isArray(data?.records) ? data.records : [];
            setRecords(fetchedRecords);

            const afterRecord = getAfterRecordForSelectedDate(fetchedRecords);

            if (!afterRecord) {
                setShowNoRecordError(true);
                return;
            }

            const recordId = afterRecord.record_id || afterRecord.id;

            if (!recordId) {
                setShowNoRecordError(true);
                return;
            }

            const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
            const headers = { 'Content-Type': 'application/json' };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/skin/`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    swim_record_id: Number(recordId),
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                navigate('/analysis/result', {
                    state: {
                        analysisData: responseData,
                        selectedDate: selectedDate.toISOString(),
                    },
                    replace: true,
                });
                return;
            }

            let errorMessage = '알 수 없는 오류';

            if (responseData?.error?.fields?.swim_record_id) {
                errorMessage = responseData.error.fields.swim_record_id[0];
            } else if (responseData?.error?.message) {
                errorMessage = responseData.error.message;
            }

            alert(`분석 실패: ${errorMessage}`);
        } catch (error) {
            alert('서버와 통신할 수 없습니다.');
        } finally {
            setIsChecking(false);
        }
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
                {!showNoRecordError ? (
                    <>
                        <div className="empty-state-info">
                            <img
                                src={reportGrey}
                                alt="노트 아이콘"
                                className="empty-icon"
                            />
                            <h3 className="empty-title">
                                아직 금일 분석이 없어요
                            </h3>
                            <p className="empty-subtitle">
                                분석을 받으시면
                                <br />
                                피부 패턴과 변화를 확인할 수 있어요
                            </p>
                        </div>

                        <button
                            className="ai-analysis-btn"
                            onClick={handleAnalysisStart}
                            disabled={isChecking}
                        >
                            <div className="btn-text-area">
                                <span className="btn-small-text">
                                    {isChecking
                                        ? '분석을 준비하고 있어요'
                                        : '내 피부 상태가 궁금하다면?'}
                                </span>
                                <div className="btn-separator">
                                    <span className="btn-large-text">
                                        {isChecking
                                            ? '잠시만 기다려 주세요'
                                            : 'AI 피부 분석 받기'}
                                    </span>
                                    {!isChecking && (
                                        <img
                                            src={analysisNext}
                                            alt="다음으로"
                                            className="btn-arrow-icon"
                                        />
                                    )}
                                </div>
                            </div>
                        </button>
                    </>
                ) : (
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
                            선택하신 날짜에 수영 전후 기록이 없어서
                            <br />
                            분석할 수 없어요.
                        </p>
                        <button
                            onClick={() => navigate('/home')}
                            style={{
                                padding: '14px 40px',
                                backgroundColor: '#F5F5F5',
                                color: '#111111',
                                borderRadius: '12px',
                                border: 'none',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            홈으로
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClickForAnalysis;