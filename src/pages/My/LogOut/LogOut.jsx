import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './LogOut.css';

const API_URL =
  'https://miseno.store/api/v1/accounts/logout/';

function LogOut() {
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const handleClose = () => {
    navigate('/my');
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    const accessToken =
      localStorage.getItem('accessToken');

    const refreshToken =
      localStorage.getItem('refreshToken');

    if (!accessToken) {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');

      navigate('/');
      return;
    }

    try {
      setIsLoggingOut(true);

      const response = await fetch(
        API_URL,
        {
          method: 'POST',

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            refresh_token:
              refreshToken || '',
          }),
        }
      );

      const responseData =
        await response.json();

      if (response.ok) {
        localStorage.removeItem(
          'accessToken'
        );

        localStorage.removeItem(
          'refreshToken'
        );

        localStorage.removeItem(
          'userId'
        );

        localStorage.removeItem(
          'userName'
        );

        navigate('/');
        return;
      }

      alert(
        responseData?.detail ||
          responseData?.message ||
          '로그아웃에 실패했습니다.'
      );
    } catch (error) {
      console.error(
        '로그아웃 오류:',
        error
      );

      alert(
        '서버와 연결할 수 없습니다.'
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="logout-page">
      <div className="logout-dimmed-content">
        <div className="logout-placeholder" />
      </div>

      <div
        className="logout-overlay"
        onClick={handleClose}
        role="presentation"
      >
        <section
          className="logout-modal"
          onClick={(event) =>
            event.stopPropagation()
          }
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <h1 id="logout-title">
            로그아웃하시겠어요?
          </h1>

          <p>
            로그아웃하면 다시 로그인해야
            서비스를 이용할 수 있어요.
          </p>

          <div className="logout-actions">
            <button
              type="button"
              className="logout-cancel"
              onClick={handleClose}
              disabled={isLoggingOut}
            >
              취소
            </button>

            <button
              type="button"
              className="logout-confirm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut
                ? '로그아웃 중...'
                : '로그아웃'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LogOut;