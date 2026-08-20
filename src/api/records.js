import { apiRequest } from './axios';

const compressImage = (file, { maxWidth = 800, maxHeight = 800, quality = 0.7, maxFileSize = 700 * 1024 } = {}) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('이미지 파일만 업로드할 수 있습니다.'));
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const originalWidth = image.naturalWidth;
      const originalHeight = image.naturalHeight;

      let width = originalWidth;
      let height = originalHeight;

      const scale = Math.min(maxWidth / width, maxHeight / height, 1);
      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('이미지 변환에 실패했습니다.'));
        return;
      }

      context.drawImage(image, 0, 0, width, height);

      const createCompressedFile = (currentQuality) => {
        return new Promise((resolveBlob, rejectBlob) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              rejectBlob(new Error('이미지 압축에 실패했습니다.'));
              return;
            }

            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, '.jpg'),
              {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }
            );

            resolveBlob(compressedFile);
          }, 'image/jpeg', currentQuality);
        });
      };

      const compressUntilTarget = async () => {
        let currentQuality = quality;
        let compressedFile = await createCompressedFile(currentQuality);

        for (let attempt = 0; attempt < 4; attempt += 1) {
          if (compressedFile.size <= maxFileSize) break;

          currentQuality = Math.max(0.35, currentQuality - 0.1);
          compressedFile = await createCompressedFile(currentQuality);
        }

        resolve(compressedFile);
      };

      compressUntilTarget().catch(reject);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('이미지를 읽을 수 없습니다.'));
    };

    image.src = objectUrl;
  });
};

const stringifySymptoms = (symptoms) => {
  if (!Array.isArray(symptoms)) return '[]';
  return JSON.stringify(symptoms);
};

export const createSwimSchedule = async (dateString) => {
  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token');

  const response = await fetch(
    'https://miseno.store/api/v1/schedules/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        category: 'SWIM',
        start_datetime: `${dateString}T00:00:00`,
        end_datetime: `${dateString}T23:59:59`,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('일정 생성 실패');
  }

  return response.json();
};

export const getSwimRecords = async (sort = 'latest') => {
  return apiRequest(
    `/api/v1/records/swim/?sort=${encodeURIComponent(sort)}`
  );
};

export const getSwimRecord = async (recordId) => {
  if (!recordId) {
    throw new Error('record_id가 필요합니다.');
  }

  return apiRequest(
    `/api/v1/records/swim/${encodeURIComponent(recordId)}/`
  );
};

export const getAfterRecordByScheduleId = async (scheduleId) => {
  if (!scheduleId) {
    return null;
  }

  const data = await getSwimRecords('latest');
  const records = Array.isArray(data?.records)
    ? data.records
    : [];

  return (
    records.find(
      (record) =>
        record.timing === 'AFTER' &&
        Number(record.schedule) === Number(scheduleId)
    ) || null
  );
};

export const createSwimRecord = async ({
  timing,
  date,
  startTime,
  durationMinutes,
  photo,
  schedule,
  swimTime,
  symptoms,
  memo,
}) => {
  const formData = new FormData();

  formData.append('timing', timing);
  formData.append('date', date);
  formData.append('start_time', startTime);
  formData.append('duration_minutes', String(durationMinutes));

  if (
    schedule !== undefined &&
    schedule !== null &&
    schedule !== ''
  ) {
    formData.append('schedule', String(schedule));
  }

  if (photo) {
    const compressedPhoto = await compressImage(photo, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.7,
      maxFileSize: 700 * 1024,
    });

    formData.append(
      'photo',
      compressedPhoto,
      compressedPhoto.name
    );
  }

  if (swimTime) {
    formData.append('swim_time', swimTime);
  }

  if (Array.isArray(symptoms)) {
    formData.append(
      'symptoms',
      stringifySymptoms(symptoms)
    );
  }

  if (memo !== undefined && memo !== null) {
    formData.append('memo', memo);
  }

  return apiRequest('/api/v1/records/swim/', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
};

export const updateSwimRecord = async (
  recordId,
  { photo, swimTime, symptoms, memo } = {}
) => {
  if (!recordId) {
    throw new Error('record_id가 필요합니다.');
  }

  const formData = new FormData();

  if (photo) {
    const compressedPhoto = await compressImage(photo, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.7,
      maxFileSize: 700 * 1024,
    });

    formData.append(
      'photo',
      compressedPhoto,
      compressedPhoto.name
    );
  }

  if (swimTime) {
    formData.append('swim_time', swimTime);
  }

  if (Array.isArray(symptoms)) {
    formData.append(
      'symptoms',
      stringifySymptoms(symptoms)
    );
  }

  if (memo !== undefined && memo !== null) {
    formData.append('memo', memo);
  }

  return apiRequest(
    `/api/v1/records/swim/${encodeURIComponent(recordId)}/`,
    {
      method: 'PATCH',
      body: formData,
      isFormData: true,
    }
  );
};

export const createAdditionalRecord = async ({
  recordId,
  photo,
  symptoms,
  memo,
}) => {
  if (!recordId) {
    throw new Error('record_id가 필요합니다.');
  }

  const formData = new FormData();

  if (photo) {
    const compressedPhoto = await compressImage(photo, {
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.7,
      maxFileSize: 700 * 1024,
    });

    formData.append(
      'photo',
      compressedPhoto,
      compressedPhoto.name
    );
  }

  if (Array.isArray(symptoms)) {
    formData.append(
      'symptoms',
      stringifySymptoms(symptoms)
    );
  }

  if (memo !== undefined && memo !== null) {
    formData.append('memo', memo);
  }

  return apiRequest(
    `/api/v1/records/swim/${encodeURIComponent(recordId)}/additional/`,
    {
      method: 'POST',
      body: formData,
      isFormData: true,
    }
  );
};