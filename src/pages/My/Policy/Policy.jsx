import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  getAgreements,
  updateAgreement,
} from '../../../api/accounts';

import './Policy.css';


function Policy() {
  const navigate =
    useNavigate();


  const [
    agreements,
    setAgreements,
  ] = useState([]);


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    updatingType,
    setUpdatingType,
  ] = useState(null);


  /* ========================================
     약관 조회

     GET /api/v1/accounts/agreements/
  ======================================== */

  useEffect(() => {
    let isMounted =
      true;


    const fetchAgreements =
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
            await getAgreements();


          /*
           * API 응답이
           *
           * {
           *   agreements: [...]
           * }
           *
           * 또는
           *
           * {
           *   data: {
           *     agreements: [...]
           *   }
           * }
           *
           * 형태일 수 있으므로 대응
           */
          const data =
            response?.agreements ??
            response?.data?.agreements ??
            response?.data ??
            response ??
            [];


          if (
            isMounted
          ) {
            setAgreements(
              Array.isArray(data)
                ? data
                : []
            );
          }

        } catch (error) {
          console.error(
            '약관 조회 오류:',
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
              '약관 정보를 불러오지 못했습니다.'
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


    fetchAgreements();


    return () => {
      isMounted =
        false;
    };
  }, [
    navigate,
  ]);


  /* ========================================
     약관 동의 변경

     POST /api/v1/accounts/agreements/
  ======================================== */

  const handleAgreementToggle =
    async (
      agreement
    ) => {
      /*
       * 필수 약관은
       * 동의 후 해제하지 못하도록 유지
       */
      if (
        agreement.is_required &&
        agreement.is_agreed
      ) {
        return;
      }


      if (
        updatingType
      ) {
        return;
      }


      const previousValue =
        Boolean(
          agreement.is_agreed
        );


      const nextValue =
        !previousValue;


      /*
       * 화면 즉시 반영
       */
      setAgreements(
        (prev) =>
          prev.map(
            (item) =>
              item.terms_type ===
              agreement.terms_type
                ? {
                    ...item,
                    is_agreed:
                      nextValue,
                  }
                : item
          )
      );


      const accessToken =
        localStorage.getItem(
          'accessToken'
        );


      if (!accessToken) {
        /*
         * 낙관적 업데이트 원복
         */
        setAgreements(
          (prev) =>
            prev.map(
              (item) =>
                item.terms_type ===
                agreement.terms_type
                  ? {
                      ...item,
                      is_agreed:
                        previousValue,
                    }
                  : item
            )
        );


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
        setUpdatingType(
          agreement.terms_type
        );


        await updateAgreement({
          termsType:
            agreement.terms_type,

          isAgreed:
            nextValue,
        });


        /*
         * 성공하면 현재 상태 유지
         */

      } catch (error) {
        console.error(
          '약관 수정 오류:',
          error
        );


        /*
         * API 실패 시 원래 상태로 복구
         */
        setAgreements(
          (prev) =>
            prev.map(
              (item) =>
                item.terms_type ===
                agreement.terms_type
                  ? {
                      ...item,
                      is_agreed:
                        previousValue,
                    }
                  : item
            )
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
            '약관 동의 상태를 변경하지 못했습니다.'
        );

      } finally {
        setUpdatingType(
          null
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
      <main className="policy-page">

        <p className="policy-loading">
          불러오는 중...
        </p>

      </main>
    );
  }


  return (
    <main className="policy-page">

      {/* ========================================
          Header
      ======================================== */}

      <header className="policy-header">

        <button
          type="button"
          className="policy-back"
          onClick={() =>
            navigate('/my')
          }
          aria-label="뒤로가기"
        >
          ‹
        </button>


        <h1>
          약관 및 정책
        </h1>


        <div className="policy-header-space" />

      </header>


      {/* ========================================
          Content
      ======================================== */}

      <section className="policy-content">

        {agreements.length === 0 ? (
          <p className="policy-empty">
            등록된 약관이 없습니다.
          </p>
        ) : (
          agreements.map(
            (agreement) => (
              <div
                className="policy-item"
                key={
                  agreement.terms_type
                }
              >

                <div className="policy-item-main">

                  <button
                    type="button"
                    className="policy-title"
                    onClick={() => {
                      if (
                        agreement.content_url
                      ) {
                        window.open(
                          agreement.content_url,
                          '_blank',
                          'noopener,noreferrer'
                        );
                      }
                    }}
                  >

                    <span>
                      {agreement.title}
                    </span>


                    {agreement.is_required && (
                      <em>
                        필수
                      </em>
                    )}

                  </button>


                  <span className="policy-status">
                    {agreement.is_agreed
                      ? '동의함'
                      : '동의 안 함'}
                  </span>

                </div>


                <button
                  type="button"
                  className={
                    `policy-toggle ${
                      agreement.is_agreed
                        ? 'checked'
                        : ''
                    }`
                  }
                  disabled={
                    (
                      agreement.is_required &&
                      agreement.is_agreed
                    ) ||
                    updatingType ===
                      agreement.terms_type
                  }
                  onClick={() =>
                    handleAgreementToggle(
                      agreement
                    )
                  }
                  aria-label={
                    `${agreement.title} 동의 ${
                      agreement.is_agreed
                        ? '해제'
                        : '설정'
                    }`
                  }
                >

                  <span>
                    {agreement.is_agreed
                      ? '✓'
                      : ''}
                  </span>

                </button>

              </div>
            )
          )
        )}

      </section>

    </main>
  );
}


export default Policy;