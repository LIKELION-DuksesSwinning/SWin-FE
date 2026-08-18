import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  getProfile,
  updateProfile,
} from '../../../api/accounts';

import './Info.css';


const EMPTY_PROFILE = {
  name: '',
  birth_date: '',
  gender: '',
};


function Info() {
  const navigate =
    useNavigate();


  const [
    profile,
    setProfile,
  ] = useState(
    EMPTY_PROFILE
  );


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    isEditing,
    setIsEditing,
  ] = useState(false);


  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  /* ========================================
     프로필 조회
     
     GET /api/v1/accounts/profile/
  ======================================== */

  useEffect(() => {
    let isMounted =
      true;


    const fetchProfile =
      async () => {
        const accessToken =
          localStorage.getItem(
            'accessToken'
          );


        if (!accessToken) {
          alert(
            '로그인 정보가 없습니다. 다시 로그인해 주세요.'
          );

          navigate(
            '/',
            {
              replace: true,
            }
          );

          return;
        }


        try {
          setIsLoading(
            true
          );


          const response =
            await getProfile();


          /*
           * API 응답이
           *
           * {
           *   name,
           *   birth_date,
           *   gender
           * }
           *
           * 또는
           *
           * {
           *   data: {...}
           * }
           *
           * 두 형태 모두 대응
           */
          const data =
            response?.data ??
            response;


          if (
            isMounted
          ) {
            setProfile({
              name:
                data?.name ??
                '',

              birth_date:
                data?.birth_date ??
                '',

              gender:
                data?.gender ??
                '',
            });
          }

        } catch (error) {
          console.error(
            '프로필 조회 오류:',
            error
          );


          if (
            !isMounted
          ) {
            return;
          }


          if (
            error?.status ===
            401
          ) {
            localStorage.removeItem(
              'accessToken'
            );

            localStorage.removeItem(
              'refreshToken'
            );


            alert(
              '로그인 정보가 만료되었습니다. 다시 로그인해 주세요.'
            );


            navigate(
              '/',
              {
                replace: true,
              }
            );

            return;
          }


          alert(
            error?.message ||
              '회원 정보를 불러오지 못했습니다.'
          );

        } finally {
          if (
            isMounted
          ) {
            setIsLoading(
              false
            );
          }
        }
      };


    fetchProfile();


    return () => {
      isMounted =
        false;
    };
  }, [
    navigate,
  ]);


  /* ========================================
     입력 변경
  ======================================== */

  const handleChange =
    (event) => {
      const {
        name,
        value,
      } =
        event.target;


      setProfile(
        (prev) => ({
          ...prev,
          [name]:
            value,
        })
      );
    };


  /* ========================================
     프로필 수정
     
     PATCH /api/v1/accounts/profile/
  ======================================== */

  const handleSave =
    async () => {
      if (
        isSaving
      ) {
        return;
      }


      const accessToken =
        localStorage.getItem(
          'accessToken'
        );


      if (!accessToken) {
        alert(
          '로그인 정보가 없습니다. 다시 로그인해 주세요.'
        );


        navigate(
          '/',
          {
            replace: true,
          }
        );


        return;
      }


      try {
        setIsSaving(
          true
        );


        const response =
          await updateProfile({
            name:
              profile.name,

            birth_date:
              profile.birth_date,

            gender:
              profile.gender,
          });


        const updatedData =
          response?.data ??
          response;


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


        setIsEditing(
          false
        );


        alert(
          '저장되었습니다.'
        );

      } catch (error) {
        console.error(
          '프로필 수정 오류:',
          error
        );


        if (
          error?.status ===
          401
        ) {
          localStorage.removeItem(
            'accessToken'
          );

          localStorage.removeItem(
            'refreshToken'
          );


          alert(
            '로그인 정보가 만료되었습니다. 다시 로그인해 주세요.'
          );


          navigate(
            '/',
            {
              replace: true,
            }
          );


          return;
        }


        alert(
          error?.message ||
            '회원 정보 수정에 실패했습니다.'
        );

      } finally {
        setIsSaving(
          false
        );
      }
    };


  /* ========================================
     Loading
  ======================================== */

  if (
    isLoading
  ) {
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

      {/* ========================================
          Header
      ======================================== */}

      <header className="info-header">

        <button
          type="button"
          className="info-back"
          onClick={() =>
            navigate('/my')
          }
          aria-label="뒤로가기"
        >
          ‹
        </button>


        <h1>
          나의 정보
        </h1>


        <div className="info-header-space" />

      </header>


      {/* ========================================
          Content
      ======================================== */}

      <section className="info-content">

        {/* ========================================
            이름
        ======================================== */}

        <div className="info-section">

          <label htmlFor="name">
            이름
          </label>


          {isEditing ? (
            <input
              id="name"
              name="name"
              type="text"
              value={
                profile.name
              }
              onChange={
                handleChange
              }
              disabled={
                isSaving
              }
            />
          ) : (
            <p>
              {profile.name ||
                '-'}
            </p>
          )}

        </div>


        {/* ========================================
            생년월일
        ======================================== */}

        <div className="info-section">

          <label htmlFor="birth_date">
            생년월일
          </label>


          {isEditing ? (
            <input
              id="birth_date"
              name="birth_date"
              type="date"
              value={
                profile.birth_date
              }
              onChange={
                handleChange
              }
              disabled={
                isSaving
              }
            />
          ) : (
            <p>
              {profile.birth_date ||
                '-'}
            </p>
          )}

        </div>


        {/* ========================================
            성별
        ======================================== */}

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
                  setProfile(
                    (prev) => ({
                      ...prev,
                      gender:
                        'FEMALE',
                    })
                  )
                }
                disabled={
                  isSaving
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
                  setProfile(
                    (prev) => ({
                      ...prev,
                      gender:
                        'MALE',
                    })
                  )
                }
                disabled={
                  isSaving
                }
              >
                남성
              </button>

            </div>
          ) : (
            <p>
              {profile.gender ===
              'FEMALE'
                ? '여성'
                : profile.gender ===
                    'MALE'
                  ? '남성'
                  : '-'}
            </p>
          )}

        </div>


        {/* ========================================
            수정 / 저장
        ======================================== */}

        {isEditing ? (
          <button
            type="button"
            className="info-save-button"
            onClick={
              handleSave
            }
            disabled={
              isSaving
            }
          >
            {isSaving
              ? '저장 중...'
              : '저장'}
          </button>
        ) : (
          <button
            type="button"
            className="info-edit-button"
            onClick={() =>
              setIsEditing(
                true
              )
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