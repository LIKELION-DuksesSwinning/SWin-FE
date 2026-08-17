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

import * as AlertPage from './pages/Alert/Alert.jsx';

import BottomNav from './components/BottomNav/BottomNav.jsx';

import ReservationDate from './pages/Clinic/ReservationDate.jsx';
import ReservationTime from './pages/Clinic/ReservationTime.jsx';
import ReservationComplete from './pages/Clinic/ReservationComplete.jsx';
import ReservationHistory from './pages/Clinic/ReservationHistory.jsx';

import PoolSearch from './pages/Pool/PoolSearch.jsx';

/*
  분석 파트
  → 팀원 작업이므로 임의로 수정/삭제하지 않음
*/
import ClickForAnalysis from './pages/Analysis/ClickForAnalysis.jsx';
import NoRecords from './pages/Analysis/NoRecords.jsx';
import NoClinicReport from './pages/Analysis/NoClinicReport.jsx';
import Loading from './pages/Analysis/Loading.jsx';

import AIanalysis from './pages/Analysis/AIanalysis.jsx';
import SwimReport from './pages/Analysis/SwimReport.jsx';

import './App.css';


/* ========================================
   Alert export 방식 대응
======================================== */

const Alert =
  AlertPage.default || AlertPage.Alert;


/* ========================================
   My
======================================== */

const My = () => (
  <div>마이 화면입니다</div>
);


function App() {
  const location = useLocation();

  const [showStarting, setShowStarting] =
    useState(true);


  /* ========================================
     Starting → Login
  ======================================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStarting(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);


  /* ========================================
     Bottom Navigation 표시 여부

     숨김:
     - Login / Starting
     - UserRecord
     - RecordDone
     - BeforeSwimming
     - AfterSwimming
  ======================================== */

  const hideBottomNav =
    location.pathname === '/' ||
    location.pathname === '/user-record' ||
    location.pathname === '/record-done' ||
    location.pathname === '/archive/before-swimming' ||
    location.pathname === '/archive/after-swimming';


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
              showStarting
                ? <Starting />
                : <Login />
            }
          />


          {/* ========================================
              사용자 기록
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
              홈
          ======================================== */}

          <Route
            path="/home"
            element={<Main />}
          />


          {/* ========================================
              상세 캘린더
          ======================================== */}

          <Route
            path="/calendar"
            element={<Calendar />}
          />


          {/* ========================================
              수영 전 기록
          ======================================== */}

          <Route
            path="/archive/before-swimming"
            element={<BeforeSwimming />}
          />


          {/* ========================================
              수영 후 기록
          ======================================== */}

          <Route
            path="/archive/after-swimming"
            element={<AfterSwimming />}
          />


          {/* ========================================
              알림
          ======================================== */}

          <Route
            path="/alert"
            element={<Alert />}
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
              분석
              → 팀원 작업 유지
          ======================================== */}

          <Route
            path="/analysis/loading"
            element={<Loading />}
          />

          <Route
            path="/analysis"
            element={<ClickForAnalysis />}
          />

          <Route
            path="/analysis/swim-report"
            element={<NoRecords />}
          />

          <Route
            path="/analysis/clinic-report"
            element={<NoClinicReport />}
          />

          <Route
            path="/analysis/swim-report-data"
            element={<SwimReport />}
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
      ======================================== */}

      {!hideBottomNav && (
        <BottomNav />
      )}

    </div>
  );
}

export default App;