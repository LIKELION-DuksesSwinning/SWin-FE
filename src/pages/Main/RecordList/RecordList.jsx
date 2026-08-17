import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './RecordList.css';

const PAGE_SIZE = 5;

/*
  백엔드 API에서 records를 전달받는 구조

  예상 데이터 예시:
  [
    {
      id: 1,
      date: '2026-08-17',
    },
    {
      id: 2,
      date: '2026-08-15',
    },
  ]

  현재 API 연동 전이므로 기본값은 빈 배열.
*/


/* ========================================
   날짜 파싱
   - 2026-08-17
   - 2026.08.17
   둘 다 대응
======================================== */

const parseRecordDate = (dateValue) => {
  if (!dateValue) return null;

  if (dateValue instanceof Date) {
    const date = new Date(dateValue);

    date.setHours(0, 0, 0, 0);

    return date;
  }

  const normalized = String(dateValue)
    .trim()
    .replace(/\./g, '-')
    .split('T')[0];

  const [year, month, day] =
    normalized.split('-').map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return null;
  }

  const date = new Date(
    year,
    month - 1,
    day
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
};


/* ========================================
   날짜 표시
   API 날짜:
   2026-08-17

   화면:
   2026.08.17
======================================== */

const formatDisplayDate = (dateValue) => {
  const date =
    parseRecordDate(dateValue);

  if (!date) {
    return '-';
  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, '0');

  const day =
    String(
      date.getDate()
    ).padStart(2, '0');

  return `${year}.${month}.${day}`;
};


/* ========================================
   오늘 날짜
======================================== */

const getToday = () => {
  const today = new Date();

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

   수영 기록일이
   오늘 포함 최근 3일 이내라면 true

   예:
   오늘 = 8/17

   8/17 ✅
   8/16 ✅
   8/15 ✅
   8/14 ✅

   8/13 ❌
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
    recordDate >= threeDaysAgo &&
    recordDate <= today
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
  ] = useState('latest');

  const [
    visibleCount,
    setVisibleCount,
  ] = useState(PAGE_SIZE);

  const [
    isSortOpen,
    setIsSortOpen,
  ] = useState(false);


  /* ========================================
     안전한 records 배열
======================================== */

  const safeRecords =
    Array.isArray(records)
      ? records
      : [];


  /* ========================================
     정렬
======================================== */

  const sortedRecords =
    useMemo(() => {

      const copiedRecords =
        [...safeRecords];

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


          // 날짜가 없는 데이터는 뒤로 보냄
          if (!dateA && !dateB) {
            return 0;
          }

          if (!dateA) {
            return 1;
          }

          if (!dateB) {
            return -1;
          }


          return sortOrder === 'latest'
            ? dateB - dateA
            : dateA - dateB;
        }
      );

      return copiedRecords;

    }, [
      safeRecords,
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


  const hasMore =
    visibleCount <
    sortedRecords.length;


  /* ========================================
     정렬 변경
======================================== */

  const handleSortChange =
    (nextOrder) => {

      setSortOrder(
        nextOrder
      );

      // 정렬 변경 시 다시 5개부터
      setVisibleCount(
        PAGE_SIZE
      );

      setIsSortOpen(false);
    };


  /* ========================================
     더보기
     → 5개씩 추가
======================================== */

  const handleLoadMore =
    () => {

      setVisibleCount(
        (prev) =>
          Math.min(
            prev + PAGE_SIZE,
            sortedRecords.length
          )
      );
    };


  /* ========================================
     기록 추가
     → Additional.jsx

     날짜를 query parameter로 전달
     예:
     /archive/additional?date=2026-08-15
======================================== */

  const handleAddRecord =
    (record) => {

      if (
        !record?.date
      ) {
        return;
      }

      const recordDate =
        parseRecordDate(
          record.date
        );

      if (!recordDate) {
        return;
      }


      const year =
        recordDate.getFullYear();

      const month =
        String(
          recordDate.getMonth() + 1
        ).padStart(2, '0');

      const day =
        String(
          recordDate.getDate()
        ).padStart(2, '0');


      const dateKey =
        `${year}-${month}-${day}`;


      navigate(
        `/archive/additional?date=${encodeURIComponent(
          dateKey
        )}`
      );
    };


  /* ========================================
     자세히 보기
     → 상세 페이지 미정
======================================== */

  const handleDetail =
    (record) => {

      console.log(
        '수영 기록 상세보기:',
        record
      );

      // TODO:
      // 백엔드/기획 확정 후 상세 페이지 연결
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
            <span
              className="record-sort-icon"
              aria-hidden="true"
            >
              ☷
            </span>
          </button>

        </div>


        <div className="record-empty">

          <div
            className="record-empty-icon"
            aria-hidden="true"
          >
            ≋
          </div>

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


  /* ========================================
     기록 있음
======================================== */

  return (
    <section className="record-list">

      {/* ================================
          Header
      ================================= */}

      <div className="record-list-header">

        <h2>
          내 수영 기록
        </h2>


        {/* ================================
            Sort
        ================================= */}

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
            <span
              className="record-sort-icon"
              aria-hidden="true"
            >
              ☷
            </span>
          </button>


          {isSortOpen && (
            <div
              className="record-sort-menu"
            >

              <button
                type="button"
                className={
                  sortOrder === 'latest'
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
                  sortOrder === 'oldest'
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


      {/* ================================
          Record Feed
      ================================= */}

      <div className="record-feed">

        {visibleRecords.map(
          (record) => {

            const addable =
              isRecordAddable(
                record?.date
              );


            return (
              <article
                key={record.id}
                className="record-item"
              >

                <div className="record-item-date">
                  {formatDisplayDate(
                    record?.date
                  )}
                </div>


                <div className="record-item-actions">

                  {/* 최근 3일 이내 기록만
                      추가 기록 가능 */}

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


                  {/* 상세보기는
                      추후 연결 */}

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


      {/* ================================
          More
      ================================= */}

      {hasMore && (
        <button
          type="button"
          className="record-more-button"
          onClick={
            handleLoadMore
          }
        >
          <span>
            더보기
          </span>

          <span
            aria-hidden="true"
          >
            ⌄
          </span>
        </button>
      )}

    </section>
  );
}

export default RecordList;