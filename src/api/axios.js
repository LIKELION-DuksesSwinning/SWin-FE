const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL ||
    'https://miseno.store'
  ).replace(/\/+$/, '');
  
  
  const getAccessToken = () => {
    return localStorage.getItem(
      'accessToken'
    );
  };
  
  
  const createHeaders = ({
    authenticated = true,
    isFormData = false,
  } = {}) => {
    const headers = {};
  
    if (!isFormData) {
      headers['Content-Type'] =
        'application/json';
    }
  
    if (authenticated) {
      const token =
        getAccessToken();
  
      if (token) {
        headers.Authorization =
          `Bearer ${token}`;
      }
    }
  
    return headers;
  };
  
  
  const parseResponse = async (
    response
  ) => {
    const text =
      await response.text();
  
    let data = null;
  
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
  
    if (!response.ok) {
      const message =
        data?.detail ||
        data?.message ||
        '요청 처리 중 오류가 발생했습니다.';
  
      const error =
        new Error(message);
  
      error.status =
        response.status;
  
      error.data = data;
  
      throw error;
    }
  
    return data;
  };
  
  
  export const apiRequest = async (
    path,
    {
      method = 'GET',
      body,
      authenticated = true,
      isFormData = false,
    } = {}
  ) => {
    const options = {
      method,
      headers: createHeaders({
        authenticated,
        isFormData,
      }),
    };
  
    if (
      body !== undefined &&
      body !== null
    ) {
      options.body =
        isFormData
          ? body
          : JSON.stringify(body);
    }
  
    const response =
      await fetch(
        `${API_BASE_URL}${path}`,
        options
      );
  
    return parseResponse(
      response
    );
  };
  
  
  export { API_BASE_URL };