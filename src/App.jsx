import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Login from './pages/Login/Login.jsx';
import Starting from './pages/Starting/Starting.jsx';

import UserRecord from './pages/UserRecord/UserRecord.jsx';
import RecordDone from './pages/UserRecord/components/RecordDone/RecordDone.jsx';

import Main from './pages/Main/Main.jsx';
import Calendar from './pages/Calendar/Calendar.jsx';

import BeforeSwimming from './pages/Archive/BeforeSwimming/BeforeSwimming.jsx';
import AfterSwimming from './pages/Archive/AfterSwimming/AfterSwimming.jsx';
import Additional from './pages/Archive/Additional/Additional.jsx';
import Furthermore from './pages/Archive/Furthermore/Furthermore.jsx';

import Alert from './pages/Alert/Alert.jsx';
import DetailedAlert from './pages/Alert/DetailedAlert/DetailedAlert.jsx';

import My from './pages/My/My.jsx';
import Info from './pages/My/Info/Info.jsx';
import PushAlarm from './pages/My/PushAlarm/PushAlarm.jsx';
import Policy from './pages/My/Policy/Policy.jsx';
import LogOut from './pages/My/LogOut/LogOut.jsx';

import BottomNav from './components/BottomNav/BottomNav.jsx';

import ReservationDate from './pages/Clinic/ReservationDate.jsx';
import ReservationTime from './pages/Clinic/ReservationTime.jsx';
import ReservationComplete from './pages/Clinic/ReservationComplete.jsx';
import ReservationHistory from './pages/Clinic/ReservationHistory.jsx';

import PoolSearch from './pages/Pool/PoolSearch.jsx';

import ClickForAnalysis from './pages/Analysis/ClickForAnalysis.jsx';
import ClinicReportTab from "./pages/Analysis/ClinicReportTab.jsx";
import Loading from './pages/Analysis/Loading.jsx';
import AIanalysis from './pages/Analysis/AIanalysis.jsx';
import SWinTab from './pages/Analysis/SWinTab.jsx';
import WeeklySwimReport from './pages/Analysis/WeeklySwimReport.jsx';
import RoutineRecs from './pages/Analysis/RoutineRecs.jsx';

function App() {
    const location = useLocation();
    const [showStarting, setShowStarting] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowStarting(false);
        }, 2000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const hideBottomNav =
        location.pathname === '/' ||
        location.pathname === '/user-record' ||
        location.pathname === '/record-done' ||
        location.pathname === '/archive/before-swimming' ||
        location.pathname === '/archive/after-swimming' ||
        location.pathname === '/archive/additional' ||
        location.pathname === '/archive/furthermore' ||
        location.pathname === '/alert' ||
        location.pathname.startsWith('/alert/');

    return (
        <div className="app-container">
            <div className="content-area">
                <Routes>

                    <Route path="/" element={showStarting ? <Starting /> : <Login />} />

                    <Route path="/user-record" element={<UserRecord />} />
                    <Route path="/record-done" element={<RecordDone />} />

                    <Route path="/home" element={<Main />} />
                    <Route path="/calendar" element={<Calendar />} />

                    <Route path="/archive/before-swimming" element={<BeforeSwimming />} />
                    <Route path="/archive/after-swimming" element={<AfterSwimming />} />
                    <Route path="/archive/additional" element={<Additional />} />
                    <Route path="/archive/furthermore" element={<Furthermore />} />

                    <Route path="/alert" element={<Alert />} />
                    <Route path="/alert/:alertId" element={<DetailedAlert />} />

                    <Route path="/pool" element={<PoolSearch />} />

                    <Route path="/clinic" element={<ReservationDate />} />
                    <Route path="/clinic/time" element={<ReservationTime />} />
                    <Route path="/clinic/complete" element={<ReservationComplete />} />
                    <Route path="/clinic/history" element={<ReservationHistory />} />

                    <Route path="/analysis/loading" element={<Loading />} />
                    <Route path="/analysis" element={<ClickForAnalysis />} />
                    <Route path="/analysis/result" element={<AIanalysis />} />
                    <Route path="/analysis/ai" element={<AIanalysis />} />
                    
                    <Route path="/analysis/swim-report" element={<SWinTab />} />
                    <Route path="/analysis/clinic-report" element={<ClinicReportTab />} />
                    <Route path="/analysis/weekly-report" element={<WeeklySwimReport />} />
                    <Route path="/analysis/routine-recs" element={<RoutineRecs />} />

                    <Route path="/my" element={<My />} />
                    <Route path="/my/info" element={<Info />} />
                    <Route path="/my/push-alarm" element={<PushAlarm />} />
                    <Route path="/my/policy" element={<Policy />} />
                    <Route path="/my/logout" element={<LogOut />} />

                </Routes>
            </div>

            {!hideBottomNav && <BottomNav />}
        </div>
    );
}

export default App;