import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import pwShown from '../../assets/images/pw-shown.svg';
import pwHidden from '../../assets/images/pw-hidden.svg';

import {
  login,
} from '../../api/accounts';

import './Login.css';


function Login() {
  const navigate =
    useNavigate();

  const [id, setId] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [idError, setIdError] =
    useState('');

  const [passwordError, setPasswordError] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);


  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    let hasError = false;

    // ========================================
    // 아이디 입력 확인
    // ========================================

    if (!id.trim()) {
      setIdError(
        '아이디를 입력해 주세요.'
      );

      hasError = true;
    } else {
      setIdError('');
    }

    // ========================================
    // 비밀번호 입력 확인
    // ========================================

    if (!password) {
      setPasswordError(
        '비밀번호를 입력해 주세요.'
      );

      hasError = true;
    } else {
      setPasswordError('');
    }


    if (hasError) {
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);


    try {
      const data =
        await login({
          username:
            id.trim(),
          password,
        });


/* ========================================
   로그인 성공
======================================== */

console.log(
  '로그인 응답:',
  data
);


/* ========================================
   Access Token
======================================== */

const accessToken =
  data?.token;


/* ========================================
   Refresh Token

   백엔드에서 이제
   refresh_token을 내려줌
======================================== */

const refreshToken =
  data?.refresh_token ??
  data?.refreshToken ??
  data?.refresh ??
  null;


/* ========================================
   Access Token 저장
======================================== */

if (accessToken) {
  localStorage.setItem(
    'accessToken',
    accessToken
  );
}


/* ========================================
   Refresh Token 저장
======================================== */

if (refreshToken) {
  localStorage.setItem(
    'refreshToken',
    refreshToken
  );
}


/* ========================================
   User ID
======================================== */

if (
  data?.user_id !==
  undefined
) {
  localStorage.setItem(
    'userId',
    String(data.user_id)
  );
}


/* ========================================
   User Name
======================================== */

if (data?.name) {
  localStorage.setItem(
    'userName',
    data.name
  );
}


/* ========================================
   저장 확인
======================================== */

console.log(
  'accessToken 저장:',
  Boolean(accessToken)
);

console.log(
  'refreshToken 저장:',
  Boolean(refreshToken)
);


/* ========================================
   사용자 기록 페이지 이동
======================================== */

navigate(
  '/user-record'
);
    } catch (error) {
      console.error(
        '로그인 오류:',
        error
      );

      if (
        error.status === 400 ||
        error.status === 401
      ) {
        setIdError(
          '다시 입력해 주세요.'
        );

        setPasswordError(
          '다시 입력해 주세요.'
        );
      } else {
        setIdError(
          '서버와 연결할 수 없습니다.'
        );

        setPasswordError('');
      }
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <main className="login-page">

      <section className="login-card">

        <div className="login-wave" />

        <div className="login-content">

          <div className="login-title">
            <p>Swin으로</p>
            <p>Swim과 Skin을</p>
            <p>동시에</p>
          </div>


          <form
            className="login-form"
            onSubmit={
              handleSubmit
            }
          >

            {/* 아이디 */}

            <div
              className={`input-group ${
                idError
                  ? 'has-error'
                  : ''
              }`}
            >

              <label htmlFor="login-id">
                아이디
              </label>

              <input
                id="login-id"
                type="text"
                value={id}
                onChange={(event) => {
                  setId(
                    event.target.value
                  );
                  setIdError('');
                }}
                placeholder="아이디를 입력해주세요."
                autoComplete="username"
                disabled={
                  isLoading
                }
              />

              {idError && (
                <p className="input-error">
                  {idError}
                </p>
              )}

            </div>


            {/* 비밀번호 */}

            <div
              className={`input-group ${
                passwordError
                  ? 'has-error'
                  : ''
              }`}
            >

              <label htmlFor="login-password">
                비밀번호
              </label>

              <div className="password-input">

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(event) => {
                    setPassword(
                      event.target.value
                    );

                    setPasswordError('');
                  }}
                  placeholder="비밀번호를 입력해주세요."
                  autoComplete="current-password"
                  disabled={
                    isLoading
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showPassword
                      ? '비밀번호 숨기기'
                      : '비밀번호 보기'
                  }
                  disabled={
                    isLoading
                  }
                >
                  <img
                    src={
                      showPassword
                        ? pwShown
                        : pwHidden
                    }
                    alt=""
                  />
                </button>

              </div>

              {passwordError && (
                <p className="input-error">
                  {passwordError}
                </p>
              )}

            </div>


            <button
              className="login-button"
              type="submit"
              disabled={
                isLoading
              }
            >
              {isLoading
                ? '로그인 중...'
                : '로그인'}
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}


export default Login;