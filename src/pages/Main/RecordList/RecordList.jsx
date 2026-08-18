import {
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import arrayFilter from '../../../assets/images/array-filter.svg';
import moreRecords from '../../../assets/images/more-records.svg';
import noRecords from '../../../assets/images/no-records.svg';

import './RecordList.css';


const PAGE_SIZE = 5;


/* ========================================
   날짜 파싱
======================================== */

const parseRecordDate = (
  dateValue
) => {
  if (!dateValue) {
    return null;
  }

  if (
    dateValue instanceof Date
  ) {
    const date =
      new Date(dateValue);

    date.setHours(
      0,
      0,
      0,
      0
    );

    return date;
  }

  const normalized =
    String(dateValue)
      .trim()
      .replace(/\./g, '-')
      .split('T')[0];

  const [
    year,
    month,
    day,
  ] =
    normalized
      .split('-')
      .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return null;
  }

  const date =
    new Date(
      year,
      month - 1,
      day
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;
};


/* ========================================
   기록 날짜 가져오기

   우선순위:
   1. date
   2. created_at
======================================== */

const getRecordDateValue = (
  record
) => {
  return (
    record?.date ??
    record?.created_at ??
    null
  );
};


/* ========================================
   YYYY-MM-DD 날짜 key
======================================== */

const getDateKey = (
  dateValue
) => {
  const date =
    parseRecordDate(
      dateValue
    );

  if (!date) {
    return null;
  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      '0'
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      '0'
    );

  return `${year}-${month}-${day}`;
};


/* ========================================
   화면 표시 날짜
======================================== */

const formatDisplayDate = (
  dateValue
) => {
  const date =
    parseRecordDate(
      dateValue
    );

  if (!date) {
    return '-';
  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      '0'
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      '0'
    );

  return `${year}.${month}.${day}`;
};


/* ========================================
   오늘
======================================== */

const getToday = () => {
  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  return today;
};


/* ========================================
   기록 추가 가능 여부

   오늘 포함 최근 3일
======================================== */

const isRecordAddable = (
  recordDateValue
) => {
  const recordDate =
    parseRecordDate(
      recordDateValue
    );

  if (!recordDate) {
    return false;
  }

  const today =
    getToday();

  const threeDaysAgo =
    new Date(today);

  threeDaysAgo.setDate(
    today.getDate() - 3
  );

  return (
    recordDate >=
      threeDaysAgo &&
    recordDate <=
      today
  );
};


/* ========================================
   수영 전/후 기록 그룹화

   같은 날짜의

   BEFORE
   AFTER

   를 하나의 수영 기록으로 묶는다.
======================================== */

const groupRecordsByDate = (
  records
) => {
  const grouped =
    new Map();

  records.forEach(
    (record) => {
      if (!record) {
        return;
      }

      const dateValue =
        getRecordDateValue(
          record
        );

      const dateKey =
        getDateKey(
          dateValue
        );

      if (!dateKey) {
        return;
      }


      if (
        !grouped.has(
          dateKey
        )
      ) {
        grouped.set(
          dateKey,
          {
            id:
              record?.id ??
              record?.record_id ??
              dateKey,

            date:
              dateValue,

            beforeRecord:
              null,

            afterRecord:
              null,

            records: [],
          }
        );
      }


      const group =
        grouped.get(
          dateKey
        );


      group.records.push(
        record
      );


      /*
       * timing 기준으로
       * 수영 전 / 수영 후 분리
       */
      if (
        record?.timing ===
          'BEFORE' ||
        record?.timing ===
          'before'
      ) {
        group.beforeRecord =
          record;
      } else if (
        record?.timing ===
          'AFTER' ||
        record?.timing ===
          'after'
      ) {
        group.afterRecord =
          record;
      } else if (
        !group.beforeRecord
      ) {
        /*
         * timing이 없는 기존/더미 데이터
         */
        group.beforeRecord =
          record;
      }
    }
  );


  return Array.from(
    grouped.values()
  ).map(
    (group) => ({
      ...group,

      /*
       * 상세 보기 / 기록 추가의
       * 대표 record
       *
       * AFTER가 있으면 AFTER,
       * 없으면 BEFORE를 사용
       */
      id:
        group.afterRecord?.id ??
        group.afterRecord?.record_id ??
        group.beforeRecord?.id ??
        group.beforeRecord?.record_id ??
        group.id,

      date:
        group.date,
    })
  );
};


function RecordList({
  records = [],
}) {
  const navigate =
    useNavigate();


  const [
    sortOrder,
    setSortOrder,
  ] = useState(
    'latest'
  );


  const [
    visibleCount,
    setVisibleCount,
  ] = useState(
    PAGE_SIZE
  );


  const [
    isSortOpen,
    setIsSortOpen,
  ] = useState(false);


  const safeRecords =
    Array.isArray(records)
      ? records
      : [];


  /* ========================================
     같은 날짜 기록 묶기
  ======================================== */

  const groupedRecords =
    useMemo(
      () =>
        groupRecordsByDate(
          safeRecords
        ),
      [
        safeRecords,
      ]
    );


  /* ========================================
     정렬
  ======================================== */

  const sortedRecords =
    useMemo(() => {
      const copiedRecords = [
        ...groupedRecords,
      ];

      copiedRecords.sort(
        (a, b) => {
          const dateA =
            parseRecordDate(
              a?.date
            );

          const dateB =
            parseRecordDate(
              b?.date
            );


          if (
            !dateA &&
            !dateB
          ) {
            return 0;
          }


          if (!dateA) {
            return 1;
          }


          if (!dateB) {
            return -1;
          }


          return (
            sortOrder ===
            'latest'
              ? dateB - dateA
              : dateA - dateB
          );
        }
      );


      return copiedRecords;
    }, [
      groupedRecords,
      sortOrder,
    ]);


  /* ========================================
     현재 표시할 기록
  ======================================== */

  const visibleRecords =
    sortedRecords.slice(
      0,
      visibleCount
    );


  const isExpanded =
    visibleCount >
    PAGE_SIZE;


  const hasExpandableRecords =
    sortedRecords.length >
    PAGE_SIZE;


  /* ========================================
     정렬 변경
  ======================================== */

  const handleSortChange =
    (nextOrder) => {
      setSortOrder(
        nextOrder
      );

      setVisibleCount(
        PAGE_SIZE
      );

      setIsSortOpen(false);
    };


  /* ========================================
     더보기
  ======================================== */

  const handleMoreToggle =
    () => {
      if (isExpanded) {
        setVisibleCount(
          PAGE_SIZE
        );

        return;
      }

      setVisibleCount(
        (prev) =>
          Math.min(
            prev +
              PAGE_SIZE,
            sortedRecords.length
          )
      );
    };


  /* ========================================
     기록 추가

     같은 날짜 그룹에서
     AFTER가 있으면 AFTER,
     없으면 BEFORE를 사용
  ======================================== */

  const handleAddRecord =
    (record) => {
      const targetRecord =
        record?.afterRecord ??
        record?.beforeRecord ??
        record;


      const targetId =
        targetRecord?.id ??
        targetRecord?.record_id;


      const dateValue =
        record?.date ??
        targetRecord?.date ??
        targetRecord?.created_at;


      if (
        !targetId ||
        !dateValue
      ) {
        return;
      }


      const recordDate =
        parseRecordDate(
          dateValue
        );


      if (!recordDate) {
        return;
      }


      const year =
        recordDate.getFullYear();

      const month =
        String(
          recordDate.getMonth() + 1
        ).padStart(
          2,
          '0'
        );

      const day =
        String(
          recordDate.getDate()
        ).padStart(
          2,
          '0'
        );


      const dateKey =
        `${year}-${month}-${day}`;


      navigate(
        `/archive/additional?id=${encodeURIComponent(
          targetId
        )}&date=${encodeURIComponent(
          dateKey
        )}`
      );
    };


  /* ========================================
     자세히 보기

     같은 날짜에 BEFORE / AFTER가
     모두 있으면 대표적으로 AFTER를
     먼저 사용한다.
  ======================================== */

  const handleDetail =
    (record) => {
      const targetRecord =
        record?.afterRecord ??
        record?.beforeRecord ??
        record;


      const targetId =
        targetRecord?.id ??
        targetRecord?.record_id;


      if (!targetId) {
        return;
      }


      const recordDate =
        parseRecordDate(
          record?.date ??
          targetRecord?.date ??
          targetRecord?.created_at
        );


      const dateKey =
        recordDate
          ? `${recordDate.getFullYear()}-${String(
              recordDate.getMonth() + 1
            ).padStart(
              2,
              '0'
            )}-${String(
              recordDate.getDate()
            ).padStart(
              2,
              '0'
            )}`
          : '';


      navigate(
        `/archive/furthermore?id=${encodeURIComponent(
          targetId
        )}&date=${encodeURIComponent(
          dateKey
        )}`
      );
    };


  /* ========================================
     기록 없음
  ======================================== */

  if (
    safeRecords.length === 0
  ) {
    return (
      <section className="record-list">

        <div className="record-list-header">

          <h2>
            내 수영 기록
          </h2>

          <button
            type="button"
            className="record-sort-button"
            aria-label="정렬"
            disabled
          >
            <img
              src={arrayFilter}
              alt=""
              className="record-sort-icon"
            />
          </button>

        </div>


        <div className="record-empty">

          <img
            src={noRecords}
            alt=""
            className="record-empty-icon"
          />


          <p className="record-empty-title">
            아직 수영 기록이 없어요.
          </p>


          <p className="record-empty-description">
            수영을 기록하면
            <br />
            AI 맞춤 분석을 받을 수 있어요.
          </p>

        </div>

      </section>
    );
  }


  return (
    <section className="record-list">

      {/* ========================================
          Header
      ======================================== */}

      <div className="record-list-header">

        <h2>
          내 수영 기록
        </h2>


        <div className="record-sort">

          <button
            type="button"
            className={`record-sort-button ${
              isSortOpen
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setIsSortOpen(
                (prev) =>
                  !prev
              )
            }
            aria-label="정렬"
            aria-expanded={
              isSortOpen
            }
          >
            <img
              src={arrayFilter}
              alt=""
              className="record-sort-icon"
            />
          </button>


          {isSortOpen && (
            <div className="record-sort-menu">

              <button
                type="button"
                className={
                  sortOrder ===
                  'latest'
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  handleSortChange(
                    'latest'
                  )
                }
              >
                최신순
              </button>


              <button
                type="button"
                className={
                  sortOrder ===
                  'oldest'
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  handleSortChange(
                    'oldest'
                  )
                }
              >
                오래된순
              </button>

            </div>
          )}

        </div>

      </div>


      {/* ========================================
          Record Feed
      ======================================== */}

      <div className="record-feed">

        {visibleRecords.map(
          (record) => {
            const addable =
              isRecordAddable(
                record?.date
              );


            const hasBefore =
              Boolean(
                record?.beforeRecord
              );


            const hasAfter =
              Boolean(
                record?.afterRecord
              );


            return (
              <article
                key={
                  `record-${record?.date ?? record?.id}`
                }
                className="record-item"
              >

                {/* 날짜 */}

                <div className="record-item-date">
                  {formatDisplayDate(
                    record?.date
                  )}
                </div>


                {/* ========================================
                    기록 상태
                ======================================== */}

                <div
                  className="record-item-status"
                >

                  {hasBefore && (
                    <span>
                      수영 전
                    </span>
                  )}

                  {hasBefore &&
                    hasAfter && (
                      <span>
                        {' · '}
                      </span>
                    )}

                  {hasAfter && (
                    <span>
                      수영 후
                    </span>
                  )}

                </div>


                {/* ========================================
                    Actions
                ======================================== */}

                <div className="record-item-actions">

                  {addable && (
                    <button
                      type="button"
                      className="record-add-button"
                      onClick={() =>
                        handleAddRecord(
                          record
                        )
                      }
                    >
                      기록 추가
                    </button>
                  )}


                  <button
                    type="button"
                    className="record-detail-button"
                    onClick={() =>
                      handleDetail(
                        record
                      )
                    }
                  >
                    자세히 보기
                  </button>

                </div>

              </article>
            );
          }
        )}

      </div>


      {/* ========================================
          More
      ======================================== */}

      {hasExpandableRecords && (
        <button
          type="button"
          className={`record-more-button ${
            isExpanded
              ? 'expanded'
              : ''
          }`}
          onClick={
            handleMoreToggle
          }
          aria-expanded={
            isExpanded
          }
        >

          <span>
            {isExpanded
              ? '접기'
              : '더보기'}
          </span>


          <img
            src={moreRecords}
            alt=""
            className="record-more-icon"
          />

        </button>
      )}

    </section>
  );
}


export default RecordList;