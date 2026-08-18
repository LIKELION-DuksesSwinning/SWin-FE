import { useNavigate } from 'react-router-dom';

import arrowNext from '../../assets/images/arrow-next.svg';

import './My.css';

function My() {
  const navigate = useNavigate();

  return (
    <main className="my-page">

      {/* ========================================
          Header
      ======================================== */}

      <header className="my-header">
        <h1>마이페이지</h1>
      </header>


      {/* ========================================
          Menu
      ======================================== */}

      <section className="my-menu-list">

        {/* 나의 정보 */}
        <button
          type="button"
          className="my-menu-item"
          onClick={() => navigate('/my/info')}
        >
          <span>나의 정보</span>

          <img
            src={arrowNext}
            alt=""
            className="my-menu-arrow"
            aria-hidden="true"
          />
        </button>


        {/* 푸시 알람 */}
        <button
          type="button"
          className="my-menu-item"
          onClick={() =>
            navigate('/my/push-alarm')
          }
        >
          <span>푸시 알람</span>

          <img
            src={arrowNext}
            alt=""
            className="my-menu-arrow"
            aria-hidden="true"
          />
        </button>


        {/* 약관 및 정책 */}
        <button
          type="button"
          className="my-menu-item"
          onClick={() =>
            navigate('/my/policy')
          }
        >
          <span>약관 및 정책</span>

          <img
            src={arrowNext}
            alt=""
            className="my-menu-arrow"
            aria-hidden="true"
          />
        </button>


        {/* 로그아웃 */}
        <button
          type="button"
          className="my-menu-item logout-item"
          onClick={() =>
            navigate('/my/logout')
          }
        >
          <span>로그아웃</span>

          <img
            src={arrowNext}
            alt=""
            className="my-menu-arrow"
            aria-hidden="true"
          />
        </button>

      </section>


      {/* ========================================
          Bottom Navigation
      ======================================== */}

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
          onClick={() =>
            navigate('/analysis')
          }
        >
          <span className="my-nav-icon">◌</span>
          <span>분석</span>
        </button>


        <button
          type="button"
          className="my-bottom-nav-item"
          onClick={() =>
            navigate('/pool')
          }
        >
          <span className="my-nav-icon">≈</span>
          <span>수영장</span>
        </button>


        <button
          type="button"
          className="my-bottom-nav-item"
          onClick={() =>
            navigate('/gallery')
          }
        >
          <span className="my-nav-icon">▣</span>
          <span>갤러리</span>
        </button>


        <button
          type="button"
          className="my-bottom-nav-item active"
          onClick={() =>
            navigate('/my')
          }
        >
          <span className="my-nav-icon">♙</span>
          <span>마이</span>
        </button>

      </nav>

    </main>
  );
}

export default My;