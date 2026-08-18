import {
  apiRequest,
} from './axios';


/* ========================================
   이미지 압축

   - 최대 가로/세로: 800px
   - 기본 JPEG 품질: 0.7
   - 압축 결과가 너무 크면 품질 추가 감소
   - 압축 전/후 정보를 콘솔에 출력
======================================== */

const compressImage = (
  file,
  {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7,
    maxFileSize = 700 * 1024, // 700KB
  } = {}
) => {
  return new Promise(
    (resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }

      if (
        !file.type.startsWith(
          'image/'
        )
      ) {
        reject(
          new Error(
            '이미지 파일만 업로드할 수 있습니다.'
          )
        );

        return;
      }


      console.log(
        '[사진 업로드] 원본 파일:',
        {
          name: file.name,
          type: file.type,
          size: file.size,
          sizeKB: Math.round(
            file.size / 1024
          ),
        }
      );


      const image =
        new Image();

      const objectUrl =
        URL.createObjectURL(file);


      image.onload = () => {
        URL.revokeObjectURL(
          objectUrl
        );


        const originalWidth =
          image.naturalWidth;

        const originalHeight =
          image.naturalHeight;


        let width =
          originalWidth;

        let height =
          originalHeight;


        /*
         * 최대 800 x 800 안으로 축소
         *
         * 원본이 더 작다면
         * 확대하지 않음
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


        /*
         * 품질을 조금씩 낮추면서
         * 목표 용량 이하가 될 때까지
         * JPEG를 다시 생성
         */
        const createCompressedFile =
          (currentQuality) => {
            return new Promise(
              (
                resolveBlob,
                rejectBlob
              ) => {
                canvas.toBlob(
                  (blob) => {
                    if (!blob) {
                      rejectBlob(
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


                    resolveBlob(
                      compressedFile
                    );
                  },
                  'image/jpeg',
                  currentQuality
                );
              }
            );
          };


        const compressUntilTarget =
          async () => {
            let currentQuality =
              quality;

            let compressedFile =
              await createCompressedFile(
                currentQuality
              );


            /*
             * 최대 4번까지 품질 감소
             */
            for (
              let attempt = 0;
              attempt < 4;
              attempt += 1
            ) {
              if (
                compressedFile.size <=
                maxFileSize
              ) {
                break;
              }


              currentQuality =
                Math.max(
                  0.35,
                  currentQuality - 0.1
                );


              compressedFile =
                await createCompressedFile(
                  currentQuality
                );
            }


            console.log(
              '[사진 업로드] 압축 결과:',
              {
                name:
                  compressedFile.name,
                type:
                  compressedFile.type,
                size:
                  compressedFile.size,
                sizeKB:
                  Math.round(
                    compressedFile.size /
                      1024
                  ),
                width,
                height,
                originalWidth,
                originalHeight,
                quality:
                  currentQuality,
              }
            );


            resolve(
              compressedFile
            );
          };


        compressUntilTarget()
          .catch(reject);
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

   실제 배포 서버 요구 필드:
   - date
   - start_time
   - duration_minutes

   기존 명세/BE 기준:
   - timing
   - schedule
   - photo
   - swim_time
   - symptoms
   - memo
======================================== */

export const createSwimRecord =
  async ({
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
    const formData =
      new FormData();


    /* 기본 필드 */

    formData.append(
      'timing',
      timing
    );

    formData.append(
      'date',
      date
    );

    formData.append(
      'start_time',
      startTime
    );

    formData.append(
      'duration_minutes',
      String(
        durationMinutes
      )
    );


    /* 일정 */

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


    /* 사진 */

    if (photo) {
      const compressedPhoto =
        await compressImage(
          photo,
          {
            maxWidth: 800,
            maxHeight: 800,
            quality: 0.7,
            maxFileSize:
              700 * 1024,
          }
        );


      console.log(
        '[수영 기록] 서버 전송 사진:',
        {
          name:
            compressedPhoto.name,
          type:
            compressedPhoto.type,
          size:
            compressedPhoto.size,
          sizeKB:
            Math.round(
              compressedPhoto.size /
                1024
            ),
        }
      );


      formData.append(
        'photo',
        compressedPhoto,
        compressedPhoto.name
      );
    }


    /* 수영 시간 */

    if (swimTime) {
      formData.append(
        'swim_time',
        swimTime
      );
    }


    /* 증상 */

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


    /* 메모 */

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


    /* 사진 */

    if (photo) {
      const compressedPhoto =
        await compressImage(
          photo,
          {
            maxWidth: 800,
            maxHeight: 800,
            quality: 0.7,
            maxFileSize:
              700 * 1024,
          }
        );


      formData.append(
        'photo',
        compressedPhoto,
        compressedPhoto.name
      );
    }


    /* 수영 시간 */

    if (swimTime) {
      formData.append(
        'swim_time',
        swimTime
      );
    }


    /* 증상 */

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


    /* 메모 */

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


    /* 사진 */

    if (photo) {
      const compressedPhoto =
        await compressImage(
          photo,
          {
            maxWidth: 200,
            maxHeight: 200,
            quality: 0.7,
            maxFileSize:
              700 * 1024,
          }
        );


      formData.append(
        'photo',
        compressedPhoto,
        compressedPhoto.name
      );
    }


    /* 증상 */

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


    /* 메모 */

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