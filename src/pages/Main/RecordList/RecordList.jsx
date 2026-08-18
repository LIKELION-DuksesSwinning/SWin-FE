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
    ).padStart(2, '0');

  const day =
    String(
      date.getDate()
    ).padStart(2, '0');

  return `${year}.${month}.${day}`;
};


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


  const sortedRecords =
    useMemo(() => {
      const copiedRecords = [
        ...safeRecords,
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
      safeRecords,
      sortOrder,
    ]);


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


  /* 기록 추가 */

  const handleAddRecord =
    (record) => {
      if (
        !record?.id ||
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
        `/archive/additional?id=${encodeURIComponent(
          record.id
        )}&date=${encodeURIComponent(
          dateKey
        )}`
      );
    };


  /* 자세히 보기 */

  const handleDetail =
    (record) => {
      if (
        !record?.id
      ) {
        return;
      }


      const recordDate =
        parseRecordDate(
          record.date
        );


      const dateKey =
        recordDate
          ? `${recordDate.getFullYear()}-${String(
              recordDate.getMonth() + 1
            ).padStart(2, '0')}-${String(
              recordDate.getDate()
            ).padStart(2, '0')}`
          : '';


      navigate(
        `/archive/furthermore?id=${encodeURIComponent(
          record.id
        )}&date=${encodeURIComponent(
          dateKey
        )}`
      );
    };


  /* 기록 없음 */

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