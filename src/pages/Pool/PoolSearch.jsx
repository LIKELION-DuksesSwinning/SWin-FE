import { useState } from 'react';
import './PoolSearch.css';

const PoolSearch = () => {
    const [step, setStep] = useState(1);
    const [city, setCity] = useState(null);
    const [district, setDistrict] = useState(null);
    const [town, setTown] = useState(null);

    // 임시 하드코딩 데이터 - 백엔드 API 연동 시 제거 예정
    const cityList = ['서울특별시'];
    const districtList = [
        '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', 
        '노원구', '도봉구', '동작구', '동대문구', '마포구', '서초구', '서대문구', '성동구', 
        '성북구', '송파구', '양천구', '용산구', '영등포구', '은평구', '종로구', '중구', '중랑구'
    ];
    const townList = [
        '신사동', '논현1동', '논현2동', '압구정동', '청담동', '삼성1동', 
        '삼성2동', '대치1동', '대치2동', '대치4동', '역삼1동', '역삼2동', 
        '도곡1동', '도곡2동', '개포1동', '개포2동', '개포3동', '개포4동', 
        '일원본동', '일원1동', '수서동', '세곡동'
    ];
    const poolList = [
        { id: 1, name: '더논현스포츠센터', address: '강남구 강남대로120길 33, 논현초등학교 내' }
    ];

    const handleTabClick = (targetStep) => {
        if (targetStep === 1) {
            setCity(null);
            setDistrict(null);
            setTown(null);
            setStep(1);
        } else if (targetStep === 2 && city) {
            setDistrict(null);
            setTown(null);
            setStep(2);
        } else if (targetStep === 3 && district) {
            setTown(null);
            setStep(3);
        }
    };

    const handleCitySelect = (selected) => {
        setCity(selected);
        setStep(2);
    };

    const handleDistrictSelect = (selected) => {
        setDistrict(selected);
        setStep(3);
    };

    const handleTownSelect = (selected) => {
        setTown(selected);
        setStep(4);
    };

    return (
        <div className="pool-search-container">
            <div className="title">수영장 찾기</div>
            <div className="tab-header">
                <div 
                    className={`tab-item ${city ? 'selected-text' : ''}`} 
                    onClick={() => handleTabClick(1)}
                >
                    {city ? city : '시/도'}
                </div>
                <div 
                    className={`tab-item ${district ? 'selected-text' : ''} ${!city ? 'disabled' : ''}`} 
                    onClick={() => handleTabClick(2)}
                >
                    {district ? district : '시/군/구'}
                </div>
                <div 
                    className={`tab-item ${town ? 'selected-text' : ''} ${!district ? 'disabled' : ''}`} 
                    onClick={() => handleTabClick(3)}
                >
                    {town ? town : '읍/면/동'}
                </div>
            </div>

            <div className="list-content">
                {step === 1 && (
                    <div className="list-grid three-columns">
                        {cityList.map((item) => (
                            <div key={item} className="list-item" onClick={() => handleCitySelect(item)}>
                                {item}
                            </div>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="list-grid three-columns">
                        {districtList.map((item) => (
                            <div key={item} className="list-item" onClick={() => handleDistrictSelect(item)}>
                                {item}
                            </div>
                        ))}
                    </div>
                )}

                {step === 3 && (
                    <div className="list-grid three-columns">
                        {townList.map((item) => (
                            <div key={item} className="list-item" onClick={() => handleTownSelect(item)}>
                                {item}
                            </div>
                        ))}
                    </div>
                )}

                {step === 4 && (
                    <div className="pool-result-wrapper">
                        {poolList.length > 0 ? (
                            poolList.map((pool) => (
                                <div key={pool.id} className="pool-card">
                                    <div className="pool-name">{pool.name}</div>
                                    <div className="pool-address">{pool.address}</div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-message">해당 지역에 수영장이 없습니다.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PoolSearch;