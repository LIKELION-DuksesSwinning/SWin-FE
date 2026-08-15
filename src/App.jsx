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

import './App.css';

const Home = () => (
  <div>
    <WeeklyCalendar />
  </div>
);

const Analysis = () => <div>분석 화면입니다</div>;
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
          {/* 처음 접속하는 Starting → Login */}
          <Route
            path="/"
            element={showStarting ? <Starting /> : <Login />}
          />

          {/* 로그인 후 사용자 기록 */}
          <Route
            path="/user-record"
            element={<UserRecord />}
          />

          {/* 사용자 기록 완료 화면 */}
          <Route
            path="/record-done"
            element={<RecordDone />}
          />

          {/* 사용자 기록 완료 후 홈 */}
          <Route path="/home" element={<Home />} />

          <Route path="/analysis" element={<Analysis />} />

          <Route path="/pool" element={<PoolSearch />} />

          <Route path="/clinic" element={<ReservationDate />} />

          <Route
            path="/clinic/time"
            element={<ReservationTime />}
          />

          <Route
            path="/clinic/complete"
            element={<ReservationComplete />}
          />

          <Route
            path="/clinic/history"
            element={<ReservationHistory />}
          />

          <Route path="/my" element={<My />} />
        </Routes>
      </div>

      {/* Starting / Login / UserRecord / RecordDone에서는 하단 네비게이션 숨김 */}
      {!isLoginPage &&
        !isUserRecordPage &&
        !isRecordDonePage && <BottomNav />}
    </div>
  );
}

export default App;