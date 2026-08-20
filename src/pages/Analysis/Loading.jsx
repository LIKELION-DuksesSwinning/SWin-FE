import { useState, useEffect } from 'react';
import './Loading.css';
import loadingIcon from '../../assets/images/loading.svg';

const Loading = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) return prev;
                return prev + 1;
            });
        }, 40);

        return () => clearInterval(timer);
    }, []);

    const radius = 130;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="loading-container">
            <div className="progress-wrapper">
                <svg
                    className="progress-svg"
                    width="280"
                    height="280"
                    viewBox="0 0 280 280"
                >
                    <circle
                        className="progress-track"
                        cx="140"
                        cy="140"
                        r={radius}
                        strokeWidth="6"
                    />
                    <circle
                        className="progress-fill"
                        cx="140"
                        cy="140"
                        r={radius}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
                <div className="loading-content">
                    <img src={loadingIcon} alt="로딩 중" className="loading-icon" />
                    <h2 className="loading-title">AI가 분석하고 있어요</h2>
                    <p className="loading-subtitle">조금만 기다려 주세요</p>
                </div>
            </div>
        </div>
    );
};

export default Loading;