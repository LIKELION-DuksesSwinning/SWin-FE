import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import './LogOut.css';


const API_URL =
  'https://miseno.store/api/v1/accounts/logout/';


function LogOut() {
  const navigate =
    useNavigate();


  const [
    isLoggingOut,
    setIsLoggingOut,
  ] = useState(false);


  /* ========================================
     로그아웃 페이지 진입 시
     배경 스크롤 방지
  ======================================== */

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      'hidden';


    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);


  /* ========================================
     취소
  ======================================== */

  const handleClose = () => {
    if (isLoggingOut) {
      return;
    }


    navigate('/my');
  };


  /* ========================================
     로그아웃
  ======================================== */

  const handleLogout =
    async () => {
      if (isLoggingOut) {
        return;
      }


      const accessToken =
        localStorage.getItem(
          'accessToken'
        );


      const refreshToken =
        localStorage.getItem(
          'refreshToken'
        );


      /* ========================================
         토큰 정리 함수
      ======================================== */

      const clearAuthStorage =
        () => {
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
        };


      /* ========================================
         Access Token 없음
      ======================================== */

      if (!accessToken) {
        clearAuthStorage();

        navigate(
          '/',
          {
            replace: true,
          }
        );

        return;
      }


      /* ========================================
         Refresh Token 없음
      ======================================== */

      if (!refreshToken) {
        console.error(
          'refreshToken이 없습니다.'
        );


        alert(
          '로그아웃에 필요한 인증 정보가 없습니다. 다시 로그인해 주세요.'
        );


        return;
      }


      try {
        setIsLoggingOut(
          true
        );


        console.log(
          '로그아웃 요청:',
          {
            refresh_token:
              refreshToken,
          }
        );


        const response =
          await fetch(
            API_URL,
            {
              method:
                'POST',

              headers: {
                Authorization:
                  `Bearer ${accessToken}`,

                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({
                  refresh_token:
                    refreshToken,
                }),
            }
          );


        const responseText =
          await response.text();


        let responseData =
          {};


        try {
          responseData =
            responseText
              ? JSON.parse(
                  responseText
                )
              : {};
        } catch {
          responseData =
            {};
        }


        console.log(
          '로그아웃 응답 상태:',
          response.status
        );


        console.log(
          '로그아웃 응답:',
          responseData
        );


        /* ========================================
           로그아웃 성공
        ======================================== */

        if (
          response.ok
        ) {
          clearAuthStorage();


          navigate(
            '/',
            {
              replace: true,
            }
          );


          return;
        }


        /* ========================================
           인증 만료
        ======================================== */

        if (
          response.status ===
          401
        ) {
          clearAuthStorage();


          alert(
            '로그인 정보가 만료되었습니다.'
          );


          navigate(
            '/',
            {
              replace: true,
            }
          );


          return;
        }


        /* ========================================
           기타 오류
        ======================================== */

        alert(
          responseData?.detail ||
            responseData?.message ||
            '로그아웃에 실패했습니다.'
        );
      } catch (error) {
        console.error(
          '로그아웃 API 오류:',
          error
        );


        alert(
          '서버와 연결할 수 없습니다.'
        );
      } finally {
        setIsLoggingOut(
          false
        );
      }
    };


  return (
    <main className="logout-page">

      {/* ========================================
          기존 화면 위에 표시되는
          전체 레이어
      ======================================== */}

      <div className="logout-dimmed-content">
        <div className="logout-placeholder" />
      </div>


      {/* ========================================
          Overlay
      ======================================== */}

      <div
        className="logout-overlay"
        onClick={handleClose}
        role="presentation"
      >

        {/* ========================================
            Modal
        ======================================== */}

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
            로그아웃하시겠습니까?
          </h1>


          {/* ========================================
              Actions
          ======================================== */}

          <div className="logout-actions">

            <button
              type="button"
              className="logout-cancel"
              onClick={
                handleClose
              }
              disabled={
                isLoggingOut
              }
            >
              취소
            </button>


            <button
              type="button"
              className="logout-confirm"
              onClick={
                handleLogout
              }
              disabled={
                isLoggingOut
              }
            >
              {isLoggingOut
                ? '로그아웃 중...'
                : '확인'}
            </button>

          </div>

        </section>

      </div>

    </main>
  );
}


export default LogOut;