import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pwShown from '../../assets/images/pw-shown.svg';
import pwHidden from '../../assets/images/pw-hidden.svg';
import './Login.css';

// 백엔드 연결 전, 화면 확인용 임시 계정
const TEST_ACCOUNT = {
  id: 'admin',
  password: '1234',
};

function Login() {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    let hasError = false;

    if (!id.trim()) {
      setIdError('아이디를 입력해 주세요.');
      hasError = true;
    } else if (id !== TEST_ACCOUNT.id) {
      setIdError('다시 입력해 주세요.');
      hasError = true;
    } else {
      setIdError('');
    }

    if (!password) {
      setPasswordError('비밀번호를 입력해 주세요.');
      hasError = true;
    } else if (password !== TEST_ACCOUNT.password) {
      setPasswordError('다시 입력해 주세요.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!hasError) {
      navigate('/home');
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
              />
              {idError && <p className="input-error">{idError}</p>}
            </div>

            <div className={`input-group ${passwordError ? 'has-error' : ''}`}>
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
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  <img
                    src={showPassword ? pwShown : pwHidden}
                    alt=""
                  />
                </button>
              </div>

              {passwordError && <p className="input-error">{passwordError}</p>}
            </div>

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