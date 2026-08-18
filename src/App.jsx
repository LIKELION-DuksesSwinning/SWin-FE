import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Login from './pages/Login/Login.jsx';
import Starting from './pages/Starting/Starting.jsx';
import UserRecord from './pages/UserRecord/UserRecord.jsx';
import RecordDone from './pages/UserRecord/components/RecordDone/RecordDone.jsx';

import BottomNav from './components/BottomNav/BottomNav.jsx';
import ReservationDate from './pages/Clinic/ReservationDate.jsx';
import ReservationTime from './pages/Clinic/ReservationTime.jsx';
import ReservationComplete from './pages/Clinic/ReservationComplete.jsx';
import ReservationHistory from './pages/Clinic/ReservationHistory.jsx';
import WeeklyCalendar from './components/WeeklyCalendar/WeeklyCalendar.jsx';
import PoolSearch from './pages/Pool/PoolSearch.jsx';

import ClickForAnalysis from './pages/Analysis/ClickForAnalysis.jsx';
import NoRecords from './pages/Analysis/NoRecords.jsx';
import ClinicReportTab from './pages/Analysis/ClinicReportTab.jsx';
import Loading from './pages/Analysis/Loading.jsx';
import AIanalysis from './pages/Analysis/AIanalysis.jsx';

import SWinTab from './pages/Analysis/SWinTab.jsx';

import './App.css'; 

const Home = () => (
    <div>
        <WeeklyCalendar />
    </div>
);
const My = () => <div>마이 화면입니다</div>;

function App() {
    const location = useLocation();
    const [showStarting, setShowStarting] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowStarting(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const isLoginPage = location.pathname === '/';
    const isUserRecordPage = location.pathname === '/user-record';
    const isRecordDonePage = location.pathname === '/record-done';

    return (
        <div className="app-container">
            <div className="content-area">
                <Routes>
                    <Route
                        path="/"
                        element={showStarting ? <Starting /> : <Login />}
                    />

                    <Route path="/user-record" element={<UserRecord />} />
                    <Route path="/record-done" element={<RecordDone />} />

                    <Route path="/home" element={<Home />} />
                    <Route path="/pool" element={<PoolSearch />} />
                    
                    <Route path="/clinic" element={<ReservationDate />} />  
                    <Route path="/clinic/time" element={<ReservationTime />} />
                    <Route path="/clinic/complete" element={<ReservationComplete />} />
                    <Route path="/clinic/history" element={<ReservationHistory />} />

                    <Route path="/analysis" element={<ClickForAnalysis />} />
                    <Route path="/analysis/loading" element={<Loading />} />
                    <Route path="/analysis/result" element={<AIanalysis />} />

                    <Route path="/analysis/swim-report" element={<SWinTab />} />
                    
                    <Route path="/analysis/clinic-report" element={<ClinicReportTab />} />

                    <Route path="/my" element={<My />} />
                </Routes>
            </div>

            {!isLoginPage && !isUserRecordPage && !isRecordDonePage && <BottomNav />}
        </div>
    );
}

export default App;