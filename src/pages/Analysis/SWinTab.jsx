import { useNavigate } from 'react-router-dom';
import './SWinTab.css';

import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar.jsx';
import weeklySwinReport from '../../assets/images/weekly-swin-report.svg';
import routineRecs from '../../assets/images/routine-recs.svg';
import swinNext from '../../assets/images/swin-next.svg';

const SWinTab = () => {
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
                    className="tab-item active" 
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

            <div className="report-cards-container">
                <button className="report-card-btn" onClick={() => console.log('주간 수영 리포트 클릭')}>
                    <img className="swin-report-icon" src={weeklySwinReport} alt="주간 수영·피부 리포트" />
                    <div className="title-subtitle-wrapper">
                        <div className="report-card-title">주간 수영·피부 리포트</div>
                        <div className="report-card-subtitle">수영 기록과 피부 변화 추이를 확인해 보세요.</div>
                    </div>

                    <img src={swinNext} alt="다음" className="report-card-next-icon" />
                </button>

                <button className="report-card-btn" onClick={() => console.log('수영 루틴 추천 클릭')}>
                    <img className="routine-recs-icon" src={routineRecs} alt="수영 루틴 추천" />
                    <div className="title-subtitle-wrapper">
                        <div className="report-card-title">수영·피부 루틴 추천</div>
                        <div className="report-card-subtitle">수영 플랜과 피부 루틴을 확인해 보세요.</div>
                    </div>
                    <img src={swinNext} alt="다음" className="report-card-next-icon" />
                </button>
            </div>
        </div>
    );
};

export default SWinTab;