import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pwShown from '../../assets/images/pw-shown.svg';
import pwHidden from '../../assets/images/pw-hidden.svg';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    let hasError = false;

    // 아이디 입력 확인
    if (!id.trim()) {
      setIdError('아이디를 입력해 주세요.');
      hasError = true;
    } else {
      setIdError('');
    }

    // 비밀번호 입력 확인
    if (!password) {
      setPasswordError('비밀번호를 입력해 주세요.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    // 입력값이 없으면 로그인 요청하지 않음
    if (hasError) {
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/accounts/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: id,
            password: password,
          }),
        }
      );

      const data = await response.json();

      // 로그인 실패
      if (!response.ok) {
        setIdError(
          data.detail || '아이디 또는 비밀번호가 불일치합니다.'
        );
        return;
      }

      // 로그인 성공
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('userId', data.user_id);
      localStorage.setItem('userName', data.name);

      navigate('/home');
    } catch (error) {
      console.error('로그인 오류:', error);

      setIdError('서버와 연결할 수 없습니다.');
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

          <form className="login-form" onSubmit={handleSubmit}>
            {/* 아이디 */}
            <div className={`input-group ${idError ? 'has-error' : ''}`}>
              <label htmlFor="login-id">아이디</label>

              <input
                id="login-id"
                type="text"
                value={id}
                onChange={(event) => {
                  setId(event.target.value);
                  setIdError('');
                }}
                placeholder="아이디를 입력해주세요."
                autoComplete="username"
              />

              {idError && (
                <p className="input-error">{idError}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div
              className={`input-group ${
                passwordError ? 'has-error' : ''
              }`}
            >
              <label htmlFor="login-password">비밀번호</label>

              <div className="password-input">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setPasswordError('');
                  }}
                  placeholder="비밀번호를 입력해주세요."
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword
                      ? '비밀번호 숨기기'
                      : '비밀번호 보기'
                  }
                >
                  <img
                    src={showPassword ? pwShown : pwHidden}
                    alt=""
                  />
                </button>
              </div>

              {passwordError && (
                <p className="input-error">{passwordError}</p>
              )}
            </div>

            {/* 로그인 */}
            <button className="login-button" type="submit">
              로그인
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;