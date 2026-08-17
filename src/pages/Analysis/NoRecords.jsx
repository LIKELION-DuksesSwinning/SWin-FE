import { useNavigate } from 'react-router-dom';
import './NoRecords.css';
import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar.jsx';
import warningGrey from '../../assets/images/warning-grey.svg';

const NoRecords = () => {
    const navigate = useNavigate();

    return (
        <div className="analysis-container">
            <WeeklyCalendar />

            <div className="analysis-tab-menu">
                <div className="tab-item active">
                    AI 분석
                </div>
                <div 
                    className="tab-item" 
                    onClick={() => navigate('/analysis/swim-report')}
                >
                    수영 리포트
                </div>
                <div className="tab-item disabled">
                    시술 리포트
                </div>
            </div>

            <div className="analysis-content empty-state-wrapper">
                <div className="empty-state-info no-records">
                    <img src={warningGrey} alt="기록 없음 아이콘" className="empty-icon" />
                    <div className="empty-title">분석할 기록이 없어요</div>
                    <p className="empty-subtitle">
                        수영 기록을 작성하면<br />
                        AI 분석을 받을 수 있어요
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NoRecords;