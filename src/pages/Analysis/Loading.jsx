import './Loading.css';

import loadingIcon from '../../assets/images/loading.svg';

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <img src={loadingIcon} alt="로딩 중" className="loading-icon" />
                <h2 className="loading-title">AI가 분석하고 있어요</h2>
                <p className="loading-subtitle">조금만 기다려 주세요</p>
            </div>
        </div>
    );
};

export default Loading;