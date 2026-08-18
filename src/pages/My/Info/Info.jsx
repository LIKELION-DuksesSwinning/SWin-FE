import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Info.css';

const API_URL =
  'https://miseno.store/api/v1/accounts/profile/';

const EMPTY_PROFILE = {
  name: '',
  birth_date: '',
  gender: '',
};

function Info() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(
    EMPTY_PROFILE
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken =
        localStorage.getItem('accessToken');

      if (!accessToken) {
        alert(
          '로그인 정보가 없습니다. 다시 로그인해 주세요.'
        );
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const responseData =
          await response.json();

        if (response.ok) {
          const data =
            responseData?.data ??
            responseData;

          setProfile({
            name: data?.name ?? '',
            birth_date:
              data?.birth_date ?? '',
            gender:
              data?.gender ?? '',
          });

          return;
        }

        if (response.status === 401) {
          localStorage.removeItem('accessToken');

          alert(
            '로그인 정보가 만료되었습니다. 다시 로그인해 주세요.'
          );

          navigate('/');
          return;
        }

        alert(
          responseData?.detail ||
            '회원 정보를 불러오지 못했습니다.'
        );
      } catch (error) {
        console.error(
          '프로필 조회 오류:',
          error
        );

        alert(
          '서버와 연결할 수 없습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const accessToken =
      localStorage.getItem('accessToken');

    if (!accessToken) {
      alert(
        '로그인 정보가 없습니다. 다시 로그인해 주세요.'
      );

      navigate('/');
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(API_URL, {
        method: 'PATCH',

        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          name: profile.name,
          birth_date: profile.birth_date,
          gender: profile.gender,
        }),
      });

      const responseData =
        await response.json();

      if (response.ok) {
        const updatedData =
          responseData?.data ??
          responseData;

        setProfile({
          name:
            updatedData?.name ??
            profile.name,

          birth_date:
            updatedData?.birth_date ??
            profile.birth_date,

          gender:
            updatedData?.gender ??
            profile.gender,
        });

        setIsEditing(false);

        alert('저장되었습니다.');
        return;
      }

      if (response.status === 401) {
        localStorage.removeItem(
          'accessToken'
        );

        alert(
          '로그인 정보가 만료되었습니다. 다시 로그인해 주세요.'
        );

        navigate('/');
        return;
      }

      alert(
        responseData?.detail ||
          '회원 정보 수정에 실패했습니다.'
      );
    } catch (error) {
      console.error(
        '프로필 수정 오류:',
        error
      );

      alert(
        '서버와 연결할 수 없습니다.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="info-page">
        <p className="info-loading">
          불러오는 중...
        </p>
      </main>
    );
  }

  return (
    <main className="info-page">
      <header className="info-header">
        <button
          type="button"
          className="info-back"
          onClick={() => navigate('/my')}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <h1>나의 정보</h1>

        <div className="info-header-space" />
      </header>

      <section className="info-content">
        <div className="info-section">
          <label htmlFor="name">
            이름
          </label>

          {isEditing ? (
            <input
              id="name"
              name="name"
              type="text"
              value={profile.name}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.name || '-'}</p>
          )}
        </div>

        <div className="info-section">
          <label htmlFor="birth_date">
            생년월일
          </label>

          {isEditing ? (
            <input
              id="birth_date"
              name="birth_date"
              type="date"
              value={profile.birth_date}
              onChange={handleChange}
            />
          ) : (
            <p>
              {profile.birth_date || '-'}
            </p>
          )}
        </div>

        <div className="info-section">
          <span className="info-label">
            성별
          </span>

          {isEditing ? (
            <div className="gender-options">
              <button
                type="button"
                className={
                  profile.gender ===
                  'FEMALE'
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  setProfile((prev) => ({
                    ...prev,
                    gender: 'FEMALE',
                  }))
                }
              >
                여성
              </button>

              <button
                type="button"
                className={
                  profile.gender ===
                  'MALE'
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  setProfile((prev) => ({
                    ...prev,
                    gender: 'MALE',
                  }))
                }
              >
                남성
              </button>
            </div>
          ) : (
            <p>
              {profile.gender === 'FEMALE'
                ? '여성'
                : profile.gender === 'MALE'
                  ? '남성'
                  : '-'}
            </p>
          )}
        </div>

        {isEditing ? (
          <button
            type="button"
            className="info-save-button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        ) : (
          <button
            type="button"
            className="info-edit-button"
            onClick={() =>
              setIsEditing(true)
            }
          >
            수정
          </button>
        )}
      </section>
    </main>
  );
}

export default Info;