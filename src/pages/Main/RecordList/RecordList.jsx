import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './RecordList.css';

const PAGE_SIZE = 5;


/* ========================================
   날짜 파싱
   API에서 들어오는
   2026-08-17 / 2026.08.17
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

  if (!year || !month || !day) {
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
   화면 표시 날짜
======================================== */

const formatDisplayDate = (dateValue) => {
  const date = parseRecordDate(dateValue);

  if (!date) {
    return '-';
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
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
   최근 3일 이내 기록인지 확인

   오늘 포함
   오늘 / 어제 / 2일 전 / 3일 전
======================================== */

const isRecordAddable = (
  recordDateValue
) => {
  const recordDate =
    parseRecordDate(recordDateValue);

  if (!recordDate) {
    return false;
  }

  const today = getToday();

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
  const navigate = useNavigate();

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


  const safeRecords =
    Array.isArray(records)
      ? records
      : [];


  /* ========================================
     정렬
======================================== */

  const sortedRecords = useMemo(() => {
    const copiedRecords = [
      ...safeRecords,
    ];

    copiedRecords.sort((a, b) => {
      const dateA =
        parseRecordDate(a?.date);

      const dateB =
        parseRecordDate(b?.date);

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
    });

    return copiedRecords;
  }, [
    safeRecords,
    sortOrder,
  ]);


  /* ========================================
     표시할 기록
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

  const handleSortChange = (
    nextOrder
  ) => {
    setSortOrder(nextOrder);

    setVisibleCount(PAGE_SIZE);

    setIsSortOpen(false);
  };


  /* ========================================
     더보기
     → 5개 추가
======================================== */

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(
        prev + PAGE_SIZE,
        sortedRecords.length
      )
    );
  };


  /* ========================================
     기록 추가
     → Additional.jsx
======================================== */

  const handleAddRecord = (
    record
  ) => {
    if (!record?.date) {
      return;
    }

    const recordDate =
      parseRecordDate(record.date);

    if (!recordDate) {
      return;
    }

    const year =
      recordDate.getFullYear();

    const month = String(
      recordDate.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
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
     → Furthermore.jsx
======================================== */

  const handleDetail = (
    record
  ) => {
    if (!record?.id || !record?.date) {
      return;
    }

    const recordDate =
      parseRecordDate(record.date);

    if (!recordDate) {
      return;
    }

    const year =
      recordDate.getFullYear();

    const month = String(
      recordDate.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      recordDate.getDate()
    ).padStart(2, '0');

    const dateKey =
      `${year}-${month}-${day}`;

    navigate(
      `/archive/furthermore?id=${encodeURIComponent(
        record.id
      )}&date=${encodeURIComponent(
        dateKey
      )}`
    );
  };


  /* ========================================
     기록 없음
======================================== */

  if (safeRecords.length === 0) {
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


  return (
    <section className="record-list">

      {/* ================================
          Header
      ================================= */}

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
                (prev) => !prev
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
            <div className="record-sort-menu">

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


      {/* ================================
          More
      ================================= */}

      {hasMore && (
        <button
          type="button"
          className="record-more-button"
          onClick={handleLoadMore}
        >
          <span>
            더보기
          </span>

          <span aria-hidden="true">
            ⌄
          </span>
        </button>
      )}

    </section>
  );
}

export default RecordList;