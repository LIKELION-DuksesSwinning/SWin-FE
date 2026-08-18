import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Policy.css';

const API_URL =
  'https://miseno.store/api/v1/accounts/agreements/';

function Policy() {
  const navigate = useNavigate();

  const [agreements, setAgreements] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [updatingType, setUpdatingType] =
    useState(null);

  useEffect(() => {
    const fetchAgreements = async () => {
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
        const response = await fetch(
          API_URL,
          {
            method: 'GET',
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
              'Content-Type':
                'application/json',
            },
          }
        );

        const responseData =
          await response.json();

        if (response.ok) {
          const data =
            responseData?.agreements ??
            responseData?.data?.agreements ??
            responseData?.data ??
            [];

          setAgreements(
            Array.isArray(data)
              ? data
              : []
          );

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
            '약관 정보를 불러오지 못했습니다.'
        );
      } catch (error) {
        console.error(
          '약관 조회 오류:',
          error
        );

        alert(
          '서버와 연결할 수 없습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgreements();
  }, [navigate]);

  const handleAgreementToggle = async (
    agreement
  ) => {
    if (
      agreement.is_required &&
      agreement.is_agreed
    ) {
      return;
    }

    if (updatingType) return;

    const previousValue =
      Boolean(agreement.is_agreed);

    const nextValue =
      !previousValue;

    setAgreements((prev) =>
      prev.map((item) =>
        item.terms_type ===
        agreement.terms_type
          ? {
              ...item,
              is_agreed: nextValue,
            }
          : item
      )
    );

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
      setUpdatingType(
        agreement.terms_type
      );

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
            terms_type:
              agreement.terms_type,
            is_agreed: nextValue,
          }),
        }
      );

      const responseData =
        await response.json();

      if (response.ok) {
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

      setAgreements((prev) =>
        prev.map((item) =>
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
        responseData?.detail ||
          '약관 동의 상태를 변경하지 못했습니다.'
      );
    } catch (error) {
      console.error(
        '약관 수정 오류:',
        error
      );

      setAgreements((prev) =>
        prev.map((item) =>
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
        '서버와 연결할 수 없습니다.'
      );
    } finally {
      setUpdatingType(null);
    }
  };

  if (isLoading) {
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
      <header className="policy-header">
        <button
          type="button"
          className="policy-back"
          onClick={() => navigate('/my')}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <h1>약관 및 정책</h1>

        <div className="policy-header-space" />
      </header>

      <section className="policy-content">
        {agreements.length === 0 ? (
          <p className="policy-empty">
            등록된 약관이 없습니다.
          </p>
        ) : (
          agreements.map((agreement) => (
            <div
              className="policy-item"
              key={agreement.terms_type}
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
                  agreement.is_required &&
                  agreement.is_agreed
                    ? true
                    : updatingType ===
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
          ))
        )}
      </section>
    </main>
  );
}

export default Policy;