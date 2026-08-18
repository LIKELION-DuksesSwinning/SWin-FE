import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './PushAlarm.css';

const API_URL =
  'https://miseno.store/api/v1/accounts/settings/notifications/';

const DEFAULT_SETTINGS = {
  swim_after_record_noti: false,
  clinic_reservation_noti: false,
  swim_schedule_noti: false,
  weekly_report_noti: false,
};

const NOTIFICATION_ITEMS = [
  {
    key: 'swim_after_record_noti',
    title: '수영 후 기록 알림',
    description:
      '수영 기록 작성 후 알림을 받을 수 있어요.',
  },
  {
    key: 'clinic_reservation_noti',
    title: '클리닉 예약 알림',
    description:
      '클리닉 예약과 관련된 알림을 받을 수 있어요.',
  },
  {
    key: 'swim_schedule_noti',
    title: '수영 일정 알림',
    description:
      '예정된 수영 일정을 알려드려요.',
  },
  {
    key: 'weekly_report_noti',
    title: '주간 리포트 알림',
    description:
      '주간 수영 리포트를 알려드려요.',
  },
];

function PushAlarm() {
  const navigate = useNavigate();

  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  const [isLoading, setIsLoading] =
    useState(true);

  const [updatingKey, setUpdatingKey] =
    useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
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
            responseData?.data ??
            responseData;

          setSettings({
            swim_after_record_noti:
              Boolean(
                data?.swim_after_record_noti
              ),
            clinic_reservation_noti:
              Boolean(
                data?.clinic_reservation_noti
              ),
            swim_schedule_noti:
              Boolean(
                data?.swim_schedule_noti
              ),
            weekly_report_noti:
              Boolean(
                data?.weekly_report_noti
              ),
          });

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
            '알림 설정을 불러오지 못했습니다.'
        );
      } catch (error) {
        console.error(
          '알림 설정 조회 오류:',
          error
        );

        alert(
          '서버와 연결할 수 없습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  const handleToggle = async (key) => {
    if (updatingKey) return;

    const previousValue =
      settings[key];

    const nextValue =
      !previousValue;

    setSettings((prev) => ({
      ...prev,
      [key]: nextValue,
    }));

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
      setUpdatingKey(key);

      const response = await fetch(
        API_URL,
        {
          method: 'PATCH',

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            [key]: nextValue,
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

      setSettings((prev) => ({
        ...prev,
        [key]: previousValue,
      }));

      alert(
        responseData?.detail ||
          '알림 설정을 변경하지 못했습니다.'
      );
    } catch (error) {
      console.error(
        '알림 설정 수정 오류:',
        error
      );

      setSettings((prev) => ({
        ...prev,
        [key]: previousValue,
      }));

      alert(
        '서버와 연결할 수 없습니다.'
      );
    } finally {
      setUpdatingKey(null);
    }
  };

  if (isLoading) {
    return (
      <main className="push-alarm-page">
        <p className="push-alarm-loading">
          불러오는 중...
        </p>
      </main>
    );
  }

  return (
    <main className="push-alarm-page">
      <header className="push-alarm-header">
        <button
          type="button"
          className="push-alarm-back"
          onClick={() => navigate('/my')}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <h1>푸시 알람</h1>

        <div className="push-alarm-header-space" />
      </header>

      <section className="push-alarm-content">
        {NOTIFICATION_ITEMS.map((item) => (
          <div
            className="push-alarm-item"
            key={item.key}
          >
            <div className="push-alarm-text">
              <h2>{item.title}</h2>

              <p>
                {item.description}
              </p>
            </div>

            <button
              type="button"
              className={
                `push-toggle ${
                  settings[item.key]
                    ? 'on'
                    : ''
                }`
              }
              onClick={() =>
                handleToggle(item.key)
              }
              disabled={
                updatingKey === item.key
              }
              aria-label={
                `${item.title} ${
                  settings[item.key]
                    ? '끄기'
                    : '켜기'
                }`
              }
            >
              <span />
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}

export default PushAlarm;