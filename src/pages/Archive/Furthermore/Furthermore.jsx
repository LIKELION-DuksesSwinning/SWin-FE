import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import prevBtn from '../../../assets/images/prev-btn.svg';

import {
  getSwimRecords,
  getSwimRecord,
} from '../../../api/records';

import './Furthermore.css';


/* ========================================
   localStorage
======================================== */

const ADDITIONAL_RECORD_STORAGE_KEY =
  'swinAdditionalRecords';


/* ========================================
   기록 순서
======================================== */

const RECORD_TYPE_ORDER = [
  'BEFORE',
  'AFTER',
  'ADD',
];


/* ========================================
   표시 이름
======================================== */

const RECORD_TYPE_LABELS = {
  BEFORE: '수영 전 사진',
  AFTER: '수영 후 사진',
  ADD: '추가 기록',
};


/* ========================================
   증상
======================================== */

const SYMPTOMS = [
  '당김',
  '건조',
  '가려움',
  '붉음',
  '여드름',
  '없음',
];


/* ========================================
   강도
======================================== */

const SEVERITY = [
  '상',
  '중',
  '하',
];


/* ========================================
   날짜 key
======================================== */

const getDateKey =
  (value) => {
    if (!value) {
      return '';
    }

    return String(value)
      .split('T')[0]
      .split(' ')[0];
  };


/* ========================================
   날짜 표시
======================================== */

const formatDate =
  (dateValue) => {
    const dateKey =
      getDateKey(
        dateValue
      );

    if (!dateKey) {
      return '-';
    }

    return dateKey.replace(
      /-/g,
      '.'
    );
  };


/* ========================================
   localStorage에서
   추가 기록 ID 가져오기
======================================== */

const getStoredAdditionalIds =
  () => {
    try {
      const stored =
        JSON.parse(
          localStorage.getItem(
            ADDITIONAL_RECORD_STORAGE_KEY
          ) || '{}'
        );


      return (
        stored &&
        typeof stored ===
          'object'
      )
        ? stored
        : {};
    } catch (error) {
      console.error(
        '추가 기록 목록 읽기 실패:',
        error
      );

      return {};
    }
  };


/* ========================================
   특정 부모 기록과 연결된
   ADD ID 가져오기
======================================== */

const getAdditionalIdsForGroup =
  (group) => {
    const stored =
      getStoredAdditionalIds();


    const parentIds = [
      group?.BEFORE?.record_id,
      group?.BEFORE?.id,
      group?.AFTER?.record_id,
      group?.AFTER?.id,
    ]
      .filter(Boolean)
      .map(String);


    const ids = [];


    parentIds.forEach(
      (parentId) => {
        const storedIds =
          stored[parentId];


        if (
          !Array.isArray(
            storedIds
          )
        ) {
          return;
        }


        storedIds.forEach(
          (id) => {
            const numericId =
              Number(id);


            if (
              !Number.isNaN(
                numericId
              ) &&
              !ids.includes(
                numericId
              )
            ) {
              ids.push(
                numericId
              );
            }
          }
        );
      }
    );


    return ids;
  };


/* ========================================
   날짜별 그룹화
======================================== */

const groupRecordsByDate =
  (records) => {
    const groups =
      new Map();


    records.forEach(
      (record) => {
        if (!record) {
          return;
        }


        const timing =
          record?.timing;


        if (
          !RECORD_TYPE_ORDER.includes(
            timing
          )
        ) {
          return;
        }


        const dateKey =
          getDateKey(
            record?.date ??
            record?.created_at
          );


        if (!dateKey) {
          return;
        }


        if (
          !groups.has(
            dateKey
          )
        ) {
          groups.set(
            dateKey,
            {
              date:
                dateKey,

              BEFORE:
                null,

              AFTER:
                null,

              ADD:
                [],
            }
          );
        }


        const group =
          groups.get(
            dateKey
          );


        if (
          timing === 'ADD'
        ) {
          group.ADD.push(
            record
          );
        } else {
          group[timing] =
            record;
        }
      }
    );


    return Array.from(
      groups.values()
    ).map(
      (group) => ({
        ...group,

        availableTypes:
          [
            group.BEFORE
              ? 'BEFORE'
              : null,

            group.AFTER
              ? 'AFTER'
              : null,

            ...(group.ADD
              .length > 0
              ? ['ADD']
              : []),
          ].filter(Boolean),
      })
    );
  };


function Furthermore() {
  const navigate =
    useNavigate();


  const location =
    useLocation();


  /* ========================================
     Query Parameter
  ======================================== */

  const searchParams =
    new URLSearchParams(
      location.search
    );


  const recordId =
    searchParams.get('id');


  const dateParam =
    searchParams.get('date');


  /* ========================================
     State
  ======================================== */

  const [
    records,
    setRecords,
  ] = useState([]);


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');


  const [
    currentTypeIndex,
    setCurrentTypeIndex,
  ] = useState(0);


  /* ========================================
     기록 조회

     1. BEFORE / AFTER 목록 조회
     2. 해당 날짜의 ADD ID 확인
     3. ADD 상세 조회
  ======================================== */

  useEffect(() => {
    let isMounted =
      true;


    const loadRecords =
      async () => {
        try {
          setIsLoading(
            true
          );

          setErrorMessage('');


          /*
           * 기본 수영 기록 조회
           */
          const data =
            await getSwimRecords(
              'latest'
            );


          const recordList =
            Array.isArray(data)
              ? data
              : Array.isArray(
                  data?.records
                )
              ? data.records
              : [];


          /*
           * 기본 기록만으로
           * 날짜 그룹 생성
           */
          const baseGroups =
            groupRecordsByDate(
              recordList
            );


          /*
           * 현재 페이지에 해당하는 그룹 찾기
           */
          let targetGroup =
            null;


          if (
            recordId
          ) {
            targetGroup =
              baseGroups.find(
                (group) =>
                  group.BEFORE?.record_id?.toString() ===
                    recordId ||
                  group.BEFORE?.id?.toString() ===
                    recordId ||
                  group.AFTER?.record_id?.toString() ===
                    recordId ||
                  group.AFTER?.id?.toString() ===
                    recordId
              );
          }


          if (
            !targetGroup &&
            dateParam
          ) {
            targetGroup =
              baseGroups.find(
                (group) =>
                  group.date ===
                  dateParam
              );
          }


          /*
           * 연결된 ADD ID 찾기
           */
          if (
            targetGroup
          ) {
            const additionalIds =
              getAdditionalIdsForGroup(
                targetGroup
              );


            /*
             * ADD 상세 조회
             */
            const additionalRecords =
              await Promise.all(
                additionalIds.map(
                  async (
                    additionalId
                  ) => {
                    try {
                      return await getSwimRecord(
                        additionalId
                      );
                    } catch (error) {
                      console.error(
                        `추가 기록 ${additionalId} 조회 실패:`,
                        error
                      );

                      return null;
                    }
                  }
                )
              );


            const validAdditionalRecords =
              additionalRecords.filter(
                Boolean
              );


            if (
              isMounted
            ) {
              setRecords([
                ...recordList,
                ...validAdditionalRecords,
              ]);
            }
          } else if (
            isMounted
          ) {
            setRecords(
              recordList
            );
          }
        } catch (error) {
          console.error(
            '수영 기록 조회 실패:',
            error
          );


          if (
            isMounted
          ) {
            setErrorMessage(
              error?.message ||
                '수영 기록을 불러오지 못했습니다.'
            );
          }
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


    loadRecords();


    return () => {
      isMounted =
        false;
    };
  }, [
    recordId,
    dateParam,
  ]);


  /* ========================================
     날짜별 그룹
  ======================================== */

  const groupedRecords =
    useMemo(
      () =>
        groupRecordsByDate(
          records
        ),
      [records]
    );


  /* ========================================
     현재 그룹
  ======================================== */

  const currentGroup =
    useMemo(() => {
      if (
        groupedRecords.length === 0
      ) {
        return null;
      }


      if (
        recordId
      ) {
        const recordGroup =
          groupedRecords.find(
            (group) =>
              group.BEFORE?.record_id?.toString() ===
                recordId ||
              group.BEFORE?.id?.toString() ===
                recordId ||
              group.AFTER?.record_id?.toString() ===
                recordId ||
              group.AFTER?.id?.toString() ===
                recordId
          );


        if (
          recordGroup
        ) {
          return recordGroup;
        }
      }


      if (
        dateParam
      ) {
        const dateGroup =
          groupedRecords.find(
            (group) =>
              group.date ===
              dateParam
          );


        if (
          dateGroup
        ) {
          return dateGroup;
        }
      }


      return null;
    }, [
      groupedRecords,
      recordId,
      dateParam,
    ]);


  /* ========================================
     사용 가능한 기록 종류
  ======================================== */

  const availableTypes =
    currentGroup?.availableTypes ??
    [];


  /* ========================================
     URL의 id에 맞는
     초기 위치 설정
  ======================================== */

  useEffect(() => {
    if (
      !currentGroup ||
      !recordId
    ) {
      return;
    }


    /*
     * BEFORE
     */
    const beforeId =
      currentGroup.BEFORE
        ?.record_id ??
      currentGroup.BEFORE
        ?.id;


    if (
      beforeId?.toString() ===
      recordId
    ) {
      setCurrentTypeIndex(
        availableTypes.indexOf(
          'BEFORE'
        )
      );

      return;
    }


    /*
     * AFTER
     */
    const afterId =
      currentGroup.AFTER
        ?.record_id ??
      currentGroup.AFTER
        ?.id;


    if (
      afterId?.toString() ===
      recordId
    ) {
      setCurrentTypeIndex(
        availableTypes.indexOf(
          'AFTER'
        )
      );

      return;
    }


    /*
     * ADD
     */
    const addIndex =
      currentGroup.ADD.findIndex(
        (record) => {
          const id =
            record?.record_id ??
            record?.id;

          return (
            id?.toString() ===
            recordId
          );
        }
      );


    if (
      addIndex >= 0
    ) {
      setCurrentTypeIndex(
        availableTypes.indexOf(
          'ADD'
        )
      );
    }
  }, [
    currentGroup,
    recordId,
    availableTypes,
  ]);


  /* ========================================
     현재 타입
  ======================================== */

  const currentType =
    availableTypes[
      Math.min(
        currentTypeIndex,
        Math.max(
          availableTypes.length - 1,
          0
        )
      )
    ] ?? null;


  /* ========================================
     현재 기록
  ======================================== */

  const currentRecord =
    currentType === 'ADD'
      ? currentGroup?.ADD?.[
          0
        ]
      : currentType
      ? currentGroup?.[
          currentType
        ]
      : null;


  /* ========================================
     날짜
  ======================================== */

  const selectedDate =
    currentGroup?.date ||
    dateParam ||
    getDateKey(
      currentRecord?.created_at
    );


  const formattedDate =
    formatDate(
      selectedDate
    );


  /* ========================================
     표시 이름
  ======================================== */

  const typeLabel =
    RECORD_TYPE_LABELS[
      currentType
    ] ||
    '수영 기록';


  /* ========================================
     증상
  ======================================== */

  const symptomList =
    Array.isArray(
      currentRecord?.symptoms
    )
      ? currentRecord.symptoms
      : [];


  const selectedSymptoms =
    symptomList
      .map(
        (item) =>
          item?.type
      )
      .filter(Boolean);


  const severityMap =
    symptomList.reduce(
      (
        accumulator,
        item
      ) => {
        if (
          item?.type
        ) {
          accumulator[
            item.type
          ] =
            item.score || '';
        }


        return accumulator;
      },
      {}
    );


  /* ========================================
     이전
  ======================================== */

  const handlePrevious =
    () => {
      if (
        currentTypeIndex <= 0
      ) {
        return;
      }


      setCurrentTypeIndex(
        (prev) =>
          prev - 1
      );
    };


  /* ========================================
     다음
  ======================================== */

  const handleNext =
    () => {
      if (
        currentTypeIndex >=
        availableTypes.length - 1
      ) {
        return;
      }


      setCurrentTypeIndex(
        (prev) =>
          prev + 1
      );
    };


  /* ========================================
     뒤로가기
  ======================================== */

  const handleBack =
    () => {
      navigate(-1);
    };


  /* ========================================
     Loading
  ======================================== */

  if (
    isLoading
  ) {
    return (
      <main className="furthermore-page">

        <header className="furthermore-header">

          <button
            type="button"
            className="furthermore-back-button"
            onClick={handleBack}
            aria-label="이전"
          >
            <img
              src={prevBtn}
              alt=""
            />
          </button>

        </header>


        <div className="furthermore-empty">

          <p>
            기록을 불러오는 중입니다.
          </p>

        </div>

      </main>
    );
  }


  /* ========================================
     Error
  ======================================== */

  if (
    errorMessage ||
    !currentGroup ||
    availableTypes.length === 0 ||
    !currentRecord
  ) {
    return (
      <main className="furthermore-page">

        <header className="furthermore-header">

          <button
            type="button"
            className="furthermore-back-button"
            onClick={handleBack}
            aria-label="이전"
          >
            <img
              src={prevBtn}
              alt=""
            />
          </button>

        </header>


        <div className="furthermore-empty">

          <p>
            {errorMessage ||
              '해당 날짜의 기록이 없습니다.'}
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="furthermore-page">

      {/* ================================
          Header
      ================================= */}

      <header className="furthermore-header">

        <button
          type="button"
          className="furthermore-back-button"
          onClick={handleBack}
          aria-label="이전"
        >
          <img
            src={prevBtn}
            alt=""
          />
        </button>

      </header>


      {/* ================================
          Content
      ================================= */}

      <section className="furthermore-content">

        <div className="furthermore-date">
          {formattedDate}
        </div>


        <h1 className="furthermore-title">
          {typeLabel}
        </h1>


        {/* ================================
            Photo
        ================================= */}

        <section className="furthermore-section">

          <h2 className="furthermore-section-title">
            {typeLabel}
          </h2>


          <div className="furthermore-photo-row">

            <div className="furthermore-photo-frame">

              {currentRecord?.photo_url ? (
                <img
                  src={
                    currentRecord.photo_url
                  }
                  alt={typeLabel}
                />
              ) : (
                <div className="furthermore-photo-placeholder">
                  사진
                </div>
              )}

            </div>


            <div className="furthermore-photo-guide">

              <strong>
                사진 첨부 팁
              </strong>

              <p>
                · 선명한 얼굴 사진을 첨부해 주세요.
              </p>

              <p>
                · 화장하지 않은 상태로 찍어주세요.
              </p>

              {currentType ===
                'AFTER' && (
                <p>
                  · 피부 변화가 나타나는 부위를 포함해 주세요.
                </p>
              )}

            </div>

          </div>

        </section>


        {/* ================================
            수영 시간
            → AFTER만
        ================================= */}

        {currentType ===
          'AFTER' &&
          currentRecord?.swim_time && (
            <section className="furthermore-section">

              <h2 className="furthermore-section-title">
                수영 시간
              </h2>


              <div className="furthermore-option-grid furthermore-duration-grid">

                {[
                  '30분 미만',
                  '30~60분',
                  '60~90분',
                  '90분 이상',
                ].map(
                  (option) => (
                    <div
                      key={option}
                      className={`furthermore-option ${
                        currentRecord.swim_time ===
                        option
                          ? 'selected'
                          : ''
                      }`}
                    >
                      {option}
                    </div>
                  )
                )}

              </div>

            </section>
          )}


        {/* ================================
            증상
        ================================= */}

        <section className="furthermore-section">

          <h2 className="furthermore-section-title">
            증상 선택
          </h2>


          <p className="furthermore-description">
            현재 느끼고 있는 피부 불편 증상을 확인하세요.
          </p>


          <div className="furthermore-option-grid">

            {SYMPTOMS.map(
              (symptom) => {
                const selected =
                  selectedSymptoms.includes(
                    symptom
                  );


                return (
                  <div
                    key={symptom}
                    className={`furthermore-option ${
                      selected
                        ? 'selected'
                        : ''
                    }`}
                  >
                    {symptom}
                  </div>
                );
              }
            )}

          </div>

        </section>


        {/* ================================
            증상 강도
        ================================= */}

        {selectedSymptoms.length >
          0 &&
          !selectedSymptoms.includes(
            '없음'
          ) && (
            <section className="furthermore-section">

              <h2 className="furthermore-section-title">
                증상 강도
              </h2>


              <div className="furthermore-severity-list">

                {selectedSymptoms.map(
                  (symptom) => (
                    <div
                      key={symptom}
                      className="furthermore-severity-row"
                    >

                      <span className="furthermore-severity-name">
                        {symptom}
                      </span>


                      <div className="furthermore-severity-buttons">

                        {SEVERITY.map(
                          (severity) => (
                            <div
                              key={
                                severity
                              }
                              className={`furthermore-severity-button ${
                                severityMap[
                                  symptom
                                ] ===
                                severity
                                  ? 'selected'
                                  : ''
                              }`}
                            >
                              {severity}
                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )
                )}

              </div>

            </section>
          )}


        {/* ================================
            특이 사항
        ================================= */}

        <section className="furthermore-section">

          <h2 className="furthermore-section-title">
            특이 사항
          </h2>


          <div className="furthermore-memo">
            {currentRecord?.memo ||
              '기록된 특이 사항이 없습니다.'}
          </div>

        </section>

      </section>


      {/* ================================
          Bottom Navigation
      ================================= */}

      <div className="furthermore-navigation">

        <button
          type="button"
          className="furthermore-arrow-button"
          onClick={
            handlePrevious
          }
          disabled={
            currentTypeIndex === 0
          }
          aria-label="이전 기록"
        >
          ‹
        </button>


        <button
          type="button"
          className="furthermore-save-button"
          onClick={handleBack}
        >
          확인
        </button>


        <button
          type="button"
          className="furthermore-arrow-button"
          onClick={
            handleNext
          }
          disabled={
            currentTypeIndex >=
            availableTypes.length - 1
          }
          aria-label="다음 기록"
        >
          ›
        </button>

      </div>

    </main>
  );
}


export default Furthermore;