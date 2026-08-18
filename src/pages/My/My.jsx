import { useNavigate } from 'react-router-dom';

import './My.css';

function My() {
  const navigate = useNavigate();

  return (
    <main className="my-page">
      <header className="my-header">
        <h1>마이페이지</h1>
      </header>

      <section className="my-menu-list">
        <button
          type="button"
          className="my-menu-item"
          onClick={() => navigate('/my/info')}
        >
          <span>나의 정보</span>
          <span className="my-menu-arrow">›</span>
        </button>

        <button
          type="button"
          className="my-menu-item"
          onClick={() => navigate('/my/push-alarm')}
        >
          <span>푸시 알람</span>
          <span className="my-menu-arrow">›</span>
        </button>

        <button
          type="button"
          className="my-menu-item"
          onClick={() => navigate('/my/policy')}
        >
          <span>약관 및 정책</span>
          <span className="my-menu-arrow">›</span>
        </button>

        <button
          type="button"
          className="my-menu-item logout-item"
          onClick={() => navigate('/my/logout')}
        >
          <span>로그아웃</span>
          <span className="my-menu-arrow">›</span>
        </button>
      </section>

      <nav className="my-bottom-nav">
        <button
          type="button"
          className="my-bottom-nav-item"
          onClick={() => navigate('/')}
        >
          <span className="my-nav-icon">⌂</span>
          <span>홈</span>
        </button>

        <button
          type="button"
          className="my-bottom-nav-item"
          onClick={() => navigate('/analysis')}
        >
          <span className="my-nav-icon">◌</span>
          <span>분석</span>
        </button>

        <button
          type="button"
          className="my-bottom-nav-item"
          onClick={() => navigate('/swimming-pool')}
        >
          <span className="my-nav-icon">≈</span>
          <span>수영장</span>
        </button>

        <button
          type="button"
          className="my-bottom-nav-item"
          onClick={() => navigate('/gallery')}
        >
          <span className="my-nav-icon">▣</span>
          <span>갤러리</span>
        </button>

        <button
          type="button"
          className="my-bottom-nav-item active"
          onClick={() => navigate('/my')}
        >
          <span className="my-nav-icon">♙</span>
          <span>마이</span>
        </button>
      </nav>
    </main>
  );
}

export default My;