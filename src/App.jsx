import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import Login from './pages/Login/Login.jsx';
import Starting from './pages/Starting/Starting.jsx';

import UserRecord from './pages/UserRecord/UserRecord.jsx';
import RecordDone from './pages/UserRecord/components/RecordDone/RecordDone.jsx';

import Main from './pages/Main/Main.jsx';
import Calendar from './pages/Calendar/Calendar.jsx';

import BeforeSwimming from './pages/Archive/BeforeSwimming/BeforeSwimming.jsx';
import AfterSwimming from './pages/Archive/AfterSwimming/AfterSwimming.jsx';

/*
  Alert.jsx가

  export default Alert;

  또는

  export { Alert };

  둘 중 어떤 방식이든 대응할 수 있도록 가져옴
*/
import * as AlertPage from './pages/Alert/Alert.jsx';

import BottomNav from './components/BottomNav/BottomNav.jsx';

import ReservationDate from './pages/Clinic/ReservationDate.jsx';
import ReservationTime from './pages/Clinic/ReservationTime.jsx';
import ReservationComplete from './pages/Clinic/ReservationComplete.jsx';
import ReservationHistory from './pages/Clinic/ReservationHistory.jsx';

import PoolSearch from './pages/Pool/PoolSearch.jsx';

import './App.css';

const Analysis = () => (
  <div>분석 화면입니다</div>
);

const My = () => (
  <div>마이 화면입니다</div>
);

// Alert.jsx의 export 방식에 따라 컴포넌트 선택
const Alert =
  AlertPage.default || AlertPage.Alert;

function App() {
  const location = useLocation();

  const [showStarting, setShowStarting] =
    useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStarting(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // ========================================
  // 하단 네비게이션을 숨길 페이지
  // ========================================

  const hideBottomNav =
    location.pathname === '/' ||
    location.pathname === '/user-record' ||
    location.pathname === '/record-done';

  return (
    <div className="app-container">
      <div className="content-area">

        <Routes>

          {/* ========================================
              Starting → Login
          ======================================== */}

          <Route
            path="/"
            element={
              showStarting ? (
                <Starting />
              ) : (
                <Login />
              )
            }
          />


          {/* ========================================
              0.2 사용자 기록
          ======================================== */}

          <Route
            path="/user-record"
            element={<UserRecord />}
          />

          <Route
            path="/record-done"
            element={<RecordDone />}
          />


          {/* ========================================
              1. 홈
          ======================================== */}

          <Route
            path="/home"
            element={<Main />}
          />


          {/* ========================================
              1.1.2 캘린더
          ======================================== */}

          <Route
            path="/calendar"
            element={<Calendar />}
          />


          {/* ========================================
              1.2 수영 전 기록
          ======================================== */}

          <Route
            path="/archive/before-swimming"
            element={<BeforeSwimming />}
          />


          {/* ========================================
              1.2 수영 후 기록
          ======================================== */}

          <Route
            path="/archive/after-swimming"
            element={<AfterSwimming />}
          />


          {/* ========================================
              1.3 알림
          ======================================== */}

          <Route
            path="/alert"
            element={<Alert />}
          />


          {/* ========================================
              분석
          ======================================== */}

          <Route
            path="/analysis"
            element={<Analysis />}
          />


          {/* ========================================
              수영장
          ======================================== */}

          <Route
            path="/pool"
            element={<PoolSearch />}
          />


          {/* ========================================
              클리닉
          ======================================== */}

          <Route
            path="/clinic"
            element={<ReservationDate />}
          />

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


          {/* ========================================
              마이
          ======================================== */}

          <Route
            path="/my"
            element={<My />}
          />

        </Routes>

      </div>


      {/* ========================================
          Bottom Navigation

          숨김:
          - Starting / Login
          - UserRecord
          - RecordDone

          표시:
          - Home
          - Calendar
          - Archive
          - Alert
          - Analysis
          - Pool
          - Clinic
          - My
      ======================================== */}

      {!hideBottomNav && (
        <BottomNav />
      )}

    </div>
  );
}

export default App;