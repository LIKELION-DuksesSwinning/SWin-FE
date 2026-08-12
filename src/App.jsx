import { Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav/BottomNav.jsx';
import ReservationDate from './pages/Clinic/ReservationDate.jsx';
import ReservationTime from './pages/Clinic/ReservationTime.jsx';
import ReservationComplete from './pages/Clinic/ReservationComplete.jsx';
import ReservationHistory from './pages/Clinic/ReservationHistory.jsx';
import PoolSearch from './pages/Pool/PoolSearch.jsx';
import './App.css'; 

const Home = () => <div>홈 화면입니다</div>;
const Analysis = () => <div>분석 화면입니다</div>;
const Pool = () => <div>수영장 화면입니다</div>;
const Clinic = () => <div>클리닉 화면입니다</div>;
const My = () => <div>마이 화면입니다</div>;

function App() {
  return (
    <div className="app-container">
      <div className="content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/pool" element={<PoolSearch />} />
          <Route path="/clinic" element={<ReservationDate />} />  
          <Route path="/clinic/time" element={<ReservationTime />} />
          <Route path="/clinic/complete" element={<ReservationComplete />} />
          <Route path="/clinic/history" element={<ReservationHistory />} />
          <Route path="/my" element={<My />} />
        </Routes>
      </div>

      <BottomNav />
    </div>
  )
}

export default App;