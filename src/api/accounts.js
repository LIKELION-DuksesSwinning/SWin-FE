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