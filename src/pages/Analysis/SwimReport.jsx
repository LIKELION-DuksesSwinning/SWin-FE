import { useNavigate } from 'react-router-dom';
import './SwimReport.css';

import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar.jsx';
import weeklySwimReport from '../../assets/images/weekly-swim-report.svg';
import swimRoutineRecs from '../../assets/images/swim-routine-recs.svg';

const SwimReport = () => {
    const navigate = useNavigate();

    return (
        <div className="analysis-container">
            <WeeklyCalendar />

            <div className="analysis-tab-menu">
                <div 
                    className="tab-item" 
                    onClick={() => navigate('/analysis')}
                >
                    AI 분석
                </div>
                <div className="tab-item active">
                    수영 리포트
                </div>
                <div className="tab-item disabled">
                    시술 리포트
                </div>
            </div>

            <div className="report-cards-container">
                <button className="report-card-btn" onClick={() => console.log('주간 수영 리포트 클릭')}>
                    <img src={weeklySwimReport} alt="주간 수영 리포트" />
                    <div>주간 수영 리포트</div>
                </button>
                
                <button className="report-card-btn" onClick={() => console.log('수영 루틴 추천 클릭')}>
                    <img src={swimRoutineRecs} alt="수영 루틴 추천" />
                    <div>수영 루틴 추천</div>
                </button>
            </div>
        </div>
    );
};

export default SwimReport;