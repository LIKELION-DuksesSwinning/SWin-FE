import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import prevBtn from '../../assets/images/prev-btn.svg';

import {
  getNotifications,
  markNotificationAsRead,
} from '../../api/notifications';

import './Alert.css';


/* ========================================
   날짜 표시


  return (
    <main className="alert-page">

      {/* Header */}

      <header className="alert-header">

        <button
          type="button"
          className="alert-back-button"
          onClick={handleBack}
          aria-label="이전"
        >
          <img
            src={prevBtn}
            alt=""
          />
        </button>


        <h1>
          알림
        </h1>

      </header>


      {/* Loading */}

      {isLoading && (
        <section className="alert-list">

          <div className="alert-empty">
            알림을 불러오는 중입니다.
          </div>

        </section>
      )}


      {/* Error */}

      {!isLoading &&
        error && (
          <section className="alert-list">

            <div className="alert-empty alert-error">
              {error}
            </div>

          </section>
        )}


      {/* Empty */}

      {!isLoading &&
        !error &&
        alerts.length === 0 && (
          <section className="alert-list">

            <div className="alert-empty">
              새로운 알림이 없습니다.
            </div>

          </section>
        )}


      {/* Alert List */}

      {!isLoading &&
        !error &&
        alerts.length > 0 && (
          <section className="alert-list">

            {alerts.map(
              (alert) => (
                <button
                  key={alert.id}
                  type="button"
                  className={`alert-item ${
                    alert.isRead
                      ? 'read'
                      : 'unread'
                  }`}
                  onClick={() =>
                    handleAlertClick(
                      alert
                    )
                  }
                >

                  <span className="alert-title">
                    {alert.title}
                  </span>


                  <span className="alert-content">
                    {alert.content}
                  </span>


                  <span className="alert-date">
                    {alert.date}
                  </span>

                </button>
              )
            )}

          </section>
        )}

    </main>
  );
}


export default Alert;