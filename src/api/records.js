import {
  apiRequest,
} from './axios';


/* ========================================
   이미지 압축

   서버에 업로드하기 전에
   사진의 해상도와 용량을 줄인다.

   - 최대 가로/세로: 1200px
   - JPEG 품질: 0.8
======================================== */

const compressImage = (
  file,
  {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
  } = {}
) => {
  return new Promise(
    (resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }

      if (
        !file.type.startsWith('image/')
      ) {
        reject(
          new Error(
            '이미지 파일만 업로드할 수 있습니다.'
          )
        );
        return;
      }

      const image =
        new Image();

      const objectUrl =
        URL.createObjectURL(file);

      image.onload = () => {
        URL.revokeObjectURL(
          objectUrl
        );

        let width =
          image.naturalWidth;

        let height =
          image.naturalHeight;

        /*
         * 1200 x 1200 범위 안으로 축소
         * 원본이 더 작으면 확대하지 않음
         */
        const scale =
          Math.min(
            maxWidth / width,
            maxHeight / height,
            1
          );

        width =
          Math.round(
            width * scale
          );

        height =
          Math.round(
            height * scale
          );

        const canvas =
          document.createElement(
            'canvas'
          );

        canvas.width =
          width;

        canvas.height =
          height;

        const context =
          canvas.getContext(
            '2d'
          );

        if (!context) {
          reject(
            new Error(
              '이미지 변환에 실패했습니다.'
            )
          );
          return;
        }

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(
                new Error(
                  '이미지 압축에 실패했습니다.'
                )
              );
              return;
            }

            const compressedFile =
              new File(
                [blob],
                file.name.replace(
                  /\.[^.]+$/,
                  '.jpg'
                ),
                {
                  type:
                    'image/jpeg',
                  lastModified:
                    Date.now(),
                }
              );

            resolve(
              compressedFile
            );
          },
          'image/jpeg',
          quality
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(
          objectUrl
        );

        reject(
          new Error(
            '이미지를 읽을 수 없습니다.'
          )
        );
      };

      image.src =
        objectUrl;
    }
  );
};


/* ========================================
   증상 데이터 변환

   백엔드:
   symptoms = JSON 문자열
======================================== */

const stringifySymptoms = (
  symptoms
) => {
  if (
    !Array.isArray(symptoms)
  ) {
    return '[]';
  }

  return JSON.stringify(
    symptoms
  );
};


/* ========================================
   수영 기록 목록 조회

   GET /api/v1/records/swim/
   GET /api/v1/records/swim/?sort=latest
   GET /api/v1/records/swim/?sort=oldest
======================================== */

export const getSwimRecords =
  async (
    sort = 'latest'
  ) => {
    return apiRequest(
      `/api/v1/records/swim/?sort=${encodeURIComponent(
        sort
      )}`
    );
  };


/* ========================================
   수영 전/후 기록 생성

   POST /api/v1/records/swim/
   Multipart Form Data
======================================== */

export const createSwimRecord =
  async ({
    timing,
    photo,
    schedule,
    swimTime,
    symptoms,
    memo,
  }) => {
    const formData =
      new FormData();

    formData.append(
      'timing',
      timing
    );

    if (
      schedule !== undefined &&
      schedule !== null &&
      schedule !== ''
    ) {
      formData.append(
        'schedule',
        String(schedule)
      );
    }

    /* 사진 압축 후 업로드 */

    if (photo) {
      const compressedPhoto =
        await compressImage(
          photo,
          {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.8,
          }
        );

      formData.append(
        'photo',
        compressedPhoto,
        compressedPhoto.name
      );
    }

    if (swimTime) {
      formData.append(
        'swim_time',
        swimTime
      );
    }

    if (
      Array.isArray(symptoms)
    ) {
      formData.append(
        'symptoms',
        stringifySymptoms(
          symptoms
        )
      );
    }

    if (
      memo !== undefined &&
      memo !== null
    ) {
      formData.append(
        'memo',
        memo
      );
    }

    return apiRequest(
      '/api/v1/records/swim/',
      {
        method: 'POST',
        body: formData,
        isFormData: true,
      }
    );
  };


/* ========================================
   특정 수영 기록 상세 조회

   GET /api/v1/records/swim/{record_id}/
======================================== */

export const getSwimRecord =
  async (
    recordId
  ) => {
    if (!recordId) {
      throw new Error(
        'record_id가 필요합니다.'
      );
    }

    return apiRequest(
      `/api/v1/records/swim/${encodeURIComponent(
        recordId
      )}/`
    );
  };


/* ========================================
   특정 수영 기록 수정

   PATCH /api/v1/records/swim/{record_id}/
======================================== */

export const updateSwimRecord =
  async (
    recordId,
    {
      photo,
      swimTime,
      symptoms,
      memo,
    } = {}
  ) => {
    if (!recordId) {
      throw new Error(
        'record_id가 필요합니다.'
      );
    }

    const formData =
      new FormData();

    /* 사진이 있을 때만 압축 */

    if (photo) {
      const compressedPhoto =
        await compressImage(
          photo,
          {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.8,
          }
        );

      formData.append(
        'photo',
        compressedPhoto,
        compressedPhoto.name
      );
    }

    if (swimTime) {
      formData.append(
        'swim_time',
        swimTime
      );
    }

    if (
      Array.isArray(symptoms)
    ) {
      formData.append(
        'symptoms',
        stringifySymptoms(
          symptoms
        )
      );
    }

    if (
      memo !== undefined &&
      memo !== null
    ) {
      formData.append(
        'memo',
        memo
      );
    }

    return apiRequest(
      `/api/v1/records/swim/${encodeURIComponent(
        recordId
      )}/`,
      {
        method: 'PATCH',
        body: formData,
        isFormData: true,
      }
    );
  };


/* ========================================
   추가 기록

   POST /api/v1/records/swim/{record_id}/additional/

   백엔드에서 timing = ADD 자동 설정
======================================== */

export const createAdditionalRecord =
  async ({
    recordId,
    photo,
    symptoms,
    memo,
  }) => {
    if (!recordId) {
      throw new Error(
        'record_id가 필요합니다.'
      );
    }

    const formData =
      new FormData();


    /* 사진 압축 후 업로드 */

    if (photo) {
      const compressedPhoto =
        await compressImage(
          photo,
          {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.8,
          }
        );

      formData.append(
        'photo',
        compressedPhoto,
        compressedPhoto.name
      );
    }


    if (
      Array.isArray(symptoms)
    ) {
      formData.append(
        'symptoms',
        stringifySymptoms(
          symptoms
        )
      );
    }


    if (
      memo !== undefined &&
      memo !== null
    ) {
      formData.append(
        'memo',
        memo
      );
    }


    return apiRequest(
      `/api/v1/records/swim/${encodeURIComponent(
        recordId
      )}/additional/`,
      {
        method: 'POST',
        body: formData,
        isFormData: true,
      }
    );
  };