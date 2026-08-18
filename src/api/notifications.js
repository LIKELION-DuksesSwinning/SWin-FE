import {
    apiRequest,
  } from './axios';
  
  
  /* ========================================
     알림 목록 조회
  
     GET /api/v1/notifications/
  ======================================== */
  
  export const getNotifications =
    async () => {
      return apiRequest(
        '/api/v1/notifications/'
      );
    };
  
  
  /* ========================================
     특정 알림 읽음 처리
  
     PATCH
     /api/v1/notifications/{notification_id}/read/
  ======================================== */
  
  export const markNotificationAsRead =
    async (
      notificationId
    ) => {
      if (!notificationId) {
        throw new Error(
          'notification_id가 필요합니다.'
        );
      }
  
      return apiRequest(
        `/api/v1/notifications/${encodeURIComponent(
          notificationId
        )}/read/`,
        {
          method: 'PATCH',
        }
      );
    };