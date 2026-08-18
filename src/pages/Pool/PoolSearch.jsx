import { useState, useEffect } from 'react';
import './PoolSearch.css';

const API_BASE_URL = 'https://miseno.store/api/v1/pools';

const PoolSearch = () => {
    const [step, setStep] = useState(1);
    
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedTown, setSelectedTown] = useState(null);

    const [cityList, setCityList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [townList, setTownList] = useState([]);
    const [poolList, setPoolList] = useState([]);

    const fetchAPI = async (endpoint) => {
        const token = localStorage.getItem('accessToken');
        const headers = { 'Content-Type': 'application/json' };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
        
        if (!response.ok) {
            console.error('API 호출 에러', response.status);
            return [];
        }
        
        const data = await response.json();
        return data.results || data; 
    };

    useEffect(() => {
        fetchAPI('/regions/cities/')
            .then(data => setCityList(data));
    }, []);

    const handleTabClick = (targetStep) => {
        if (targetStep === 1) {
            setSelectedCity(null);
            setSelectedDistrict(null);
            setSelectedTown(null);
            setStep(1);
        } else if (targetStep === 2 && selectedCity) {
            setSelectedDistrict(null);
            setSelectedTown(null);
            setStep(2);
        } else if (targetStep === 3 && selectedDistrict) {
            setSelectedTown(null);
            setStep(3);
        }
    };

    const handleCitySelect = (cityObj) => {
        setSelectedCity(cityObj);
        setStep(2);
        
        fetchAPI(`/regions/districts/?city=${cityObj.id}`)
            .then(data => setDistrictList(data));
    };

    const handleDistrictSelect = (districtObj) => {
        setSelectedDistrict(districtObj);
        setStep(3);
        
        fetchAPI(`/regions/dongs/?district=${districtObj.id}`)
            .then(data => setTownList(data));
    };

    const handleTownSelect = (townObj) => {
        setSelectedTown(townObj);
        setStep(4);
        
        fetchAPI(`/?dong=${townObj.id}`)
            .then(data => setPoolList(data));
    };

    return (
        <div className="pool-search-container">
            <div className="title">수영장 찾기</div>
            <div className="tab-header">
                <div 
                    className={`tab-item ${selectedCity ? 'selected-text' : ''}`} 
                    onClick={() => handleTabClick(1)}
                >
                    {selectedCity ? selectedCity.name : '시/도'}
                </div>
                <div 
                    className={`tab-item ${selectedDistrict ? 'selected-text' : ''} ${!selectedCity ? 'disabled' : ''}`} 
                    onClick={() => handleTabClick(2)}
                >
                    {selectedDistrict ? selectedDistrict.name : '시/군/구'}
                </div>
                <div 
                    className={`tab-item ${selectedTown ? 'selected-text' : ''} ${!selectedDistrict ? 'disabled' : ''}`} 
                    onClick={() => handleTabClick(3)}
                >
                    {selectedTown ? selectedTown.name : '읍/면/동'}
                </div>
            </div>

            <div className="list-content">
                {step === 1 && (
                    <div className="list-grid three-columns">
                        {cityList.map((item) => (
                            <div key={item.id} className="list-item" onClick={() => handleCitySelect(item)}>
                                {item.name}
                            </div>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="list-grid three-columns">
                        {districtList.map((item) => (
                            <div key={item.id} className="list-item" onClick={() => handleDistrictSelect(item)}>
                                {item.name}
                            </div>
                        ))}
                    </div>
                )}

                {step === 3 && (
                    <div className="list-grid three-columns">
                        {townList.map((item) => (
                            <div key={item.id} className="list-item" onClick={() => handleTownSelect(item)}>
                                {item.name}
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