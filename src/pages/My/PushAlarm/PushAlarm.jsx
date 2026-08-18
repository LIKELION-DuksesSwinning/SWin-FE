import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  getNotificationSettings,
  updateNotificationSettings,
} from '../../../api/accounts';

import './PushAlarm.css';


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
  const navigate =
    useNavigate();


  const [
    settings,
    setSettings,
  ] = useState(
    DEFAULT_SETTINGS
  );


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    updatingKey,
    setUpdatingKey,
  ] = useState(null);


  /* ========================================
     알림 설정 조회

     GET
     /api/v1/accounts/settings/notifications/
  ======================================== */

  useEffect(() => {
    let isMounted =
      true;


    const fetchSettings =
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
            await getNotificationSettings();


          /*
           * 응답이
           *
           * {
           *   swim_after_record_noti: true,
           *   ...
           * }
           *
           * 또는
           *
           * {
           *   data: {
           *     ...
           *   }
           * }
           *
           * 형태일 수 있도록 대응
           */
          const data =
            response?.data ??
            response;


          if (
            isMounted
          ) {
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
          }

        } catch (error) {
          console.error(
            '알림 설정 조회 오류:',
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
              '알림 설정을 불러오지 못했습니다.'
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


    fetchSettings();


    return () => {
      isMounted =
        false;
    };
  }, [
    navigate,
  ]);


  /* ========================================
     알림 설정 변경

     PATCH
     /api/v1/accounts/settings/notifications/
  ======================================== */

  const handleToggle =
    async (
      key
    ) => {
      if (
        updatingKey
      ) {
        return;
      }


      const previousValue =
        Boolean(
          settings[key]
        );


      const nextValue =
        !previousValue;


      /*
       * 화면 먼저 변경
       */
      setSettings(
        (prev) => ({
          ...prev,
          [key]:
            nextValue,
        })
      );


      const accessToken =
        localStorage.getItem(
          'accessToken'
        );


      if (!accessToken) {
        /*
         * 낙관적 업데이트 원복
         */
        setSettings(
          (prev) => ({
            ...prev,
            [key]:
              previousValue,
          })
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
        setUpdatingKey(
          key
        );


        /*
         * 필요한 필드 하나만 PATCH
         */
        await updateNotificationSettings({
          [key]:
            nextValue,
        });


      } catch (error) {
        console.error(
          '알림 설정 수정 오류:',
          error
        );


        /*
         * 실패하면 원래 값으로 복구
         */
        setSettings(
          (prev) => ({
            ...prev,
            [key]:
              previousValue,
          })
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
            '알림 설정을 변경하지 못했습니다.'
        );

      } finally {
        setUpdatingKey(
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
      <main className="push-alarm-page">

        <p className="push-alarm-loading">
          불러오는 중...
        </p>

      </main>
    );
  }


  return (
    <main className="push-alarm-page">

      {/* ========================================
          Header
      ======================================== */}

      <header className="push-alarm-header">

        <button
          type="button"
          className="push-alarm-back"
          onClick={() =>
            navigate('/my')
          }
          aria-label="뒤로가기"
        >
          ‹
        </button>


        <h1>
          푸시 알람
        </h1>


        <div className="push-alarm-header-space" />

      </header>


      {/* ========================================
          Content
      ======================================== */}

      <section className="push-alarm-content">

        {NOTIFICATION_ITEMS.map(
          (item) => (
            <div
              className="push-alarm-item"
              key={item.key}
            >

              <div className="push-alarm-text">

                <h2>
                  {item.title}
                </h2>


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
                  handleToggle(
                    item.key
                  )
                }
                disabled={
                  updatingKey ===
                  item.key
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
          )
        )}

      </section>

    </main>
  );
}


export default PushAlarm;