import {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    useLocation,
    useNavigate,
} from 'react-router-dom';

import loadingIcon from '../../assets/images/loading.svg';

import './Loading.css';

function Loading() {
    const navigate = useNavigate();
    const location = useLocation();

    const [progress, setProgress] =
        useState(0);

    const routeState = useRef(
        location.state ?? {}
    );

    useEffect(() => {
        const progressTimer =
            setInterval(() => {
                setProgress(
                    (previousProgress) => {
                        if (
                            previousProgress >= 100
                        ) {
                            return 100;
                        }

                        return (
                            previousProgress + 1
                        );
                    }
                );
            }, 40);

        const navigationTimer =
            setTimeout(() => {
                navigate('/analysis', {
                    replace: true,
                    state: routeState.current,
                });
            }, 4200);

        return () => {
            clearInterval(
                progressTimer
            );

            clearTimeout(
                navigationTimer
            );
        };
    }, [navigate]);

    const radius = 130;

    const circumference =
        2 * Math.PI * radius;

    const strokeDashoffset =
        circumference -
        (progress / 100) *
            circumference;

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
                        strokeDasharray={
                            circumference
                        }
                        strokeDashoffset={
                            strokeDashoffset
                        }
                    />
                </svg>

                <div className="loading-content">
                    <img
                        src={loadingIcon}
                        alt="로딩 중"
                        className="loading-icon"
                    />

                    <h2 className="loading-title">
                        AI가 분석하고 있어요
                    </h2>

                    <p className="loading-subtitle">
                        조금만 기다려 주세요
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Loading;