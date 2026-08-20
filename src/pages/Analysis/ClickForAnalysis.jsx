import { useNavigate } from 'react-router-dom';
import './ClickForAnalysis.css';
import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar.jsx';
import reportGrey from '../../assets/images/report-grey.svg';
import analysisNext from '../../assets/images/analysis-next.svg';

const API_BASE_URL = 'https://miseno.store/api/v1/analysis';

const ClickForAnalysis = () => {
    const navigate = useNavigate();

    const handleAnalysisStart = async () => {
        navigate('/analysis/loading');

        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
            const targetRecordId = localStorage.getItem('latestAfterRecordId');
            const headers = { 'Content-Type': 'application/json' };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const payload = {
                swim_record_id: Number(targetRecordId)
            };

            const response = await fetch(`${API_BASE_URL}/skin/`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const analysisData = await response.json();
                navigate('/analysis/result', { state: { analysisData }, replace: true });
            } else {
                const errorData = await response.json();
                let errorMessage = '알 수 없는 오류';
                
                if (errorData.error?.fields?.swim_record_id) {
                    errorMessage = errorData.error.fields.swim_record_id[0];
                } else if (errorData.error?.message) {
                    errorMessage = errorData.error.message;
                }
                
                alert(`분석 실패: ${errorMessage}`);
                navigate('/analysis');
            }
        } catch (error) {
            alert('서버와 통신할 수 없습니다.');
            navigate('/analysis');
        }
    };

    return (
        <div className="analysis-container">
            <WeeklyCalendar />

            <div className="analysis-tab-menu">
                <div className="tab-item active" onClick={() => navigate('/analysis')}>
                    AI 피부 분석
                </div>
                <div className="tab-item" onClick={() => navigate('/analysis/swim-report')}>
                    SWin 리포트
                </div>
                <div className="tab-item" onClick={() => navigate('/analysis/clinic-report')}>
                    시술 리포트
                </div>
            </div>

            <div className="analysis-content empty-state-wrapper">
                <div className="empty-state-info">
                    <img src={reportGrey} alt="노트 아이콘" className="empty-icon" />
                    <h3 className="empty-title">아직 금일 분석이 없어요</h3>
                    <p className="empty-subtitle">
                        분석을 받으시면<br />
                        피부 패턴과 변화를 확인할 수 있어요
                    </p>
                </div>

                <button className="ai-analysis-btn" onClick={handleAnalysisStart}>
                    <div className="btn-text-area">
                        <span className="btn-small-text">내 피부 상태가 궁금하다면?</span>
                        <div className="btn-separator">
                            <span className="btn-large-text">AI 피부 분석 받기</span>
                            <img src={analysisNext} alt="다음으로" className="btn-arrow-icon" />
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ClickForAnalysis;