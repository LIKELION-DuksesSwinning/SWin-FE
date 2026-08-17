import { useNavigate } from 'react-router-dom';

import recordBefore from '../../../assets/images/record-before.svg';
import recordAfter from '../../../assets/images/record-after.svg';

import './ArchiveBtn.css';

function ArchiveBtn() {
  const navigate = useNavigate();

  const handleBeforeRecord = () => {
    navigate('/archive/before-swimming');
  };

  const handleAfterRecord = () => {
    navigate('/archive/after-swimming');
  };

  return (
    <section className="archive-button">

      {/* ================================
          Title
      ================================= */}

      <div className="archive-button-text">
        <h2>수영 전후 기록하기</h2>

        <p>
          상태를 남기면 맞춤 리포트를 만들어 드려요.
        </p>
      </div>


      {/* ================================
          Buttons
      ================================= */}

      <div className="archive-button-group">

        {/* 수영 전 */}

        <button
          type="button"
          className="archive-record-button"
          onClick={handleBeforeRecord}
        >
          <span
            className="archive-record-icon"
            aria-hidden="true"
          >
            <img
              src={recordBefore}
              alt=""
            />
          </span>

          <span>수영 전</span>
        </button>


        {/* 수영 후 */}

        <button
          type="button"
          className="archive-record-button"
          onClick={handleAfterRecord}
        >
          <span
            className="archive-record-icon"
            aria-hidden="true"
          >
            <img
              src={recordAfter}
              alt=""
            />
          </span>

          <span>수영 후</span>
        </button>

      </div>

    </section>
  );
}

export default ArchiveBtn;