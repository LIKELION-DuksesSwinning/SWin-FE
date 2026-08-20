import { useNavigate } from 'react-router-dom';
import './ClinicReportTab.css';
import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar.jsx';
import warningGrey from '../../assets/images/warning-grey.svg';

const ClinicReportTab = () => {
    const navigate = useNavigate();

    return (
        <div className="analysis-container">
            <WeeklyCalendar />

            <div className="analysis-tab-menu">
                <div 
                    className="tab-item" 
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
                    className="tab-item active" 
                    onClick={() => navigate('/analysis/clinic-report')}
                >
                    시술 리포트
                </div>
            </div>

            <div className="analysis-content empty-state-wrapper">
                <div className="empty-state-info no-records">
                    <img src={warningGrey} alt="기록 없음 아이콘" className="empty-icon" />
                    <h3 className="empty-title">준비 중인 기능이에요</h3>
                    <p className="empty-subtitle">
                        AAC와 서비스 연동이 완료되면<br />
                        시술 내역과 케어 가이드를 확인할 수 있어요
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClinicReportTab;