import { Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav/BottomNav.jsx';
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
          <Route path="/pool" element={<Pool />} />
          <Route path="/clinic" element={<Clinic />} />
          <Route path="/my" element={<My />} />
        </Routes>
      </div>

      <BottomNav />
    </div>
  )
}

export default App;