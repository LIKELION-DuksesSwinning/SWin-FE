import {
    apiRequest,
  } from './axios';
  
  
  /* ========================================
     월별 일정 조회
  
     GET /api/v1/schedules/?year=2026&month=8
  ======================================== */
  
  export const getSchedulesByMonth =
    async (
      year,
      month
    ) => {
      return apiRequest(
        `/api/v1/schedules/?year=${encodeURIComponent(
          year
        )}&month=${encodeURIComponent(
          month
        )}`
      );
    };
  
  
  /* ========================================
     일정 등록
  
     POST /api/v1/schedules/
  ======================================== */
  
  export const createSchedule =
    async (
      scheduleData
    ) => {
      return apiRequest(
        '/api/v1/schedules/',
        {
          method: 'POST',
          body: scheduleData,
        }
      );
    };
  
  
  /* ========================================
     일정 수정
  
     PATCH /api/v1/schedules/{schedule_id}/
  ======================================== */
  
  export const updateSchedule =
    async (
      scheduleId,
      scheduleData
    ) => {
      if (!scheduleId) {
        throw new Error(
          'schedule_id가 필요합니다.'
        );
      }
  
      return apiRequest(
        `/api/v1/schedules/${encodeURIComponent(
          scheduleId
        )}/`,
        {
          method: 'PATCH',
          body: scheduleData,
        }
      );
    };
  
  
  /* ========================================
     일정 삭제
  
     DELETE /api/v1/schedules/{schedule_id}/
  ======================================== */
  
  export const deleteSchedule =
    async (
      scheduleId
    ) => {
      if (!scheduleId) {
        throw new Error(
          'schedule_id가 필요합니다.'
        );
      }
  
      return apiRequest(
        `/api/v1/schedules/${encodeURIComponent(
          scheduleId
        )}/`,
        {
          method: 'DELETE',
        }
      );
    };