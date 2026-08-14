import { useNavigate } from 'react-router-dom';
import './AIanalysis.css';
import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar.jsx';

const AIanalysis = () => {
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

            <div className="analysis-content">
                {/* AI 분석 내용 들어갈 자리 */}
            </div>
        </div>
    );
};

export default AIanalysis;