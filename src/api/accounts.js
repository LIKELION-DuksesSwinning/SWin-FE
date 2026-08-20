import {
  apiRequest,
} from './axios';


/* ========================================
   로그인

   POST /api/v1/accounts/login/
======================================== */

export const login = async ({
  username,
  password,
}) => {
  return apiRequest(
    '/api/v1/accounts/login/',
    {
      method: 'POST',

      authenticated: false,

      body: {
        username,
        password,
      },
    }
  );
};


/* ========================================
   로그아웃

   POST /api/v1/accounts/logout/

   Body:
   {
     refresh_token
   }
======================================== */

export const logout = async ({
  refreshToken,
}) => {
  if (!refreshToken) {
    throw new Error(
      'refresh_token이 필요합니다.'
    );
  }

  return apiRequest(
    '/api/v1/accounts/logout/',
    {
      method: 'POST',

      authenticated: true,

      body: {
        refresh_token:
          refreshToken,
      },
    }
  );
};


/* ========================================
   프로필 조회

   GET /api/v1/accounts/profile/
======================================== */

export const getProfile =
  async () => {
    return apiRequest(
      '/api/v1/accounts/profile/'
    );
  };


/* ========================================
   프로필 수정

   PATCH /api/v1/accounts/profile/
======================================== */

export const updateProfile =
  async ({
    name,
    birth_date,
    gender,
  }) => {
    return apiRequest(
      '/api/v1/accounts/profile/',
      {
        method: 'PATCH',

        body: {
          name,
          birth_date,
          gender,
        },
      }
    );
  };


/* ========================================
   약관 조회

   GET /api/v1/accounts/agreements/
======================================== */

export const getAgreements =
  async () => {
    return apiRequest(
      '/api/v1/accounts/agreements/'
    );
  };


/* ========================================
   약관 동의 변경

   POST /api/v1/accounts/agreements/

   Body:
   {
     terms_type,
     is_agreed
   }
======================================== */

export const updateAgreement =
  async ({
    termsType,
    isAgreed,
  }) => {
    return apiRequest(
      '/api/v1/accounts/agreements/',
      {
        method: 'POST',

        body: {
          terms_type:
            termsType,

          is_agreed:
            isAgreed,
        },
      }
    );
  };


/* ========================================
   푸시 알림 설정 조회

   GET
   /api/v1/accounts/settings/notifications/
======================================== */

export const getNotificationSettings =
  async () => {
    return apiRequest(
      '/api/v1/accounts/settings/notifications/'
    );
  };


/* ========================================
   푸시 알림 설정 변경

   PATCH
   /api/v1/accounts/settings/notifications/

   Body:
   {
     swim_after_record_noti,
     clinic_reservation_noti,
     swim_schedule_noti,
     weekly_report_noti
   }

   필요한 필드만 보내도 됨.
======================================== */

export const updateNotificationSettings =
  async (
    settings
  ) => {
    if (
      !settings ||
      typeof settings !== 'object'
    ) {
      throw new Error(
        '알림 설정 데이터가 필요합니다.'
      );
    }

    return apiRequest(
      '/api/v1/accounts/settings/notifications/',
      {
        method: 'PATCH',

        body: settings,
      }
    );
  };