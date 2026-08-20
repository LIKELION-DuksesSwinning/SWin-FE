import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestWeeklyReport } from '../../api/report';
import './WeeklySwimReport.css';
import prevBtn from '../../assets/images/prev-btn.svg';

const mockSymptomChanges = [
    { label: '피부 당김', beforeWidth: '40%', afterWidth: '80%', delta: '+2', type: 'increase' },
    { label: '붉음', beforeWidth: '30%', afterWidth: '60%', delta: '+2', type: 'increase' },
    { label: '트러블', beforeWidth: '50%', afterWidth: '50%', delta: '유지', type: 'maintain' }
];

function WeeklySwimReport() {
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const data = await getLatestWeeklyReport();
                setReportData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReport();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.replace(/-/g, '.');
    };

    if (isLoading) {
        return <div className="weekly-report-loading">리포트를 불러오는 중입니다...</div>;
    }

    if (!reportData) {
        return (
            <div className="weekly-report-empty">
                <header className="report-header">
                    <button type="button" className="back-btn" onClick={() => navigate(-1)}>
                        <img src={prevBtn} alt="뒤로가기" />
                    </button>
                    <h1 className="header-title">주간 리포트</h1>
                    <div className="header-spacer" />
                </header>
                <div className="empty-message">아직 생성된 주간 수영·피부 리포트가 없습니다.</div>
            </div>
        );
    }

    const {
        week_start,
        week_end,
        swim_count,
        avg_swim_duration,
        recommended_ingredients,
        recommended_products,
        clinic_recommended,
        other_pool_recommended
    } = reportData;

    const ingredientsText = recommended_ingredients ? recommended_ingredients.join(' · ') : '추천 성분 없음';

    return (
        <div className="weekly-report-container">
            <header className="report-header">
                <button type="button" className="back-btn" onClick={() => navigate(-1)}>
                    <img src={prevBtn} alt="뒤로가기" />
                </button>
                <h1 className="header-title">주간 리포트</h1>
                <div className="header-spacer" />
            </header>

            <div className="report-date-selector">
                <span className="date-range">{formatDate(week_start)} ~ {formatDate(week_end)}</span>
            </div>

            <section className="report-section">
                <h2 className="section-title">이번 주 수영</h2>
                <div className="swim-stats-cards">
                    <div className="stat-card">
                        <span className="stat-label">최근 수영 횟수</span>
                        <div className="stat-value">{swim_count}<span>회</span></div>
                        <span className="stat-desc">지난주보다 1회 적음</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">평균 수영 시간</span>
                        <div className="stat-value">{avg_swim_duration}<span>분</span></div>
                        <span className="stat-desc">권장 범위 안</span>
                    </div>
                </div>
            </section>

            <section className="report-section">
                <div className="section-title-row">
                    <h2 className="section-title">수영 전후 피부 변화</h2>
                    <span className="skin-type-tag">복합성 · 민감</span>
                </div>
                <div className="skin-change-card">
                    <div className="legend-row">
                        <div className="legend-item"><span className="dot before-dot" />수영 전</div>
                        <div className="legend-item"><span className="dot after-dot" />수영 후</div>
                    </div>

                    <div className="chart-list">
                        {mockSymptomChanges.map((item, index) => (
                            <div key={index} className="chart-item">
                                <div className="chart-label-row">
                                    <span className="chart-label">{item.label}</span>
                                    <span className={`chart-delta ${item.type}`}>{item.delta}</span>
                                </div>
                                <div className="bar-track">
                                    <div className="bar before-bar" style={{ width: item.beforeWidth }} />
                                    <div className="bar after-bar" style={{ width: item.afterWidth }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="chart-footer">최근 3회 기록 기준</div>
                </div>
            </section>

            <section className="report-section">
                <h2 className="section-title">맞춤 케어 추천</h2>
                <div className="recommendation-cards">
                    <div className="rec-card">
                        <div className="tag-badge blue-badge">필요 성분</div>
                        <h3 className="rec-title">{ingredientsText}</h3>
                        <p className="rec-desc">염소 노출 후 장벽을 보호하고 부족한 수분을 채워요.</p>
                    </div>

                    {recommended_products && recommended_products.length > 0 && (
                        <div className="rec-card">
                            <div className="tag-badge yellow-badge">Pith 제품</div>
                            <ul className="product-list">
                                {recommended_products.map((prod, idx) => (
                                    <li key={idx}>· {prod.name}</li>
                                ))}
                            </ul>
                            <button 
                                type="button" 
                                className="link-button"
                                style={{ zIndex: 10, position: 'relative', pointerEvents: 'auto' }}
                                onClick={() => window.open('https://pithseoul.com/product/list.html?cate_no=42#none', '_blank', 'noopener,noreferrer')}
                            >
                                홈페이지 바로가기
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {(other_pool_recommended || clinic_recommended) && (
                <section className="report-section">
                    <h2 className="section-title">권장 사항</h2>
                    <div className="recommendation-cards">
                        {other_pool_recommended && (
                            <div className="rec-card">
                                <div className="tag-badge blue-badge">수영장</div>
                                <p className="rec-desc black-desc">나와 수영장이 맞지 않을 수 있어요.<br />근처 다른 수영장을 찾아볼까요?</p>
                                <button 
                                    type="button" 
                                    className="link-button"
                                    style={{ zIndex: 10, position: 'relative', pointerEvents: 'auto' }}
                                    onClick={() => navigate('/pool')}
                                >
                                    수영장 찾기
                                </button>
                            </div>
                        )}

                        {clinic_recommended && (
                            <div className="rec-card">
                                <div className="tag-badge yellow-badge">클리닉</div>
                                <p className="rec-desc black-desc">최근 수영 후 피부 변화가 지속적으로 기록되었습니다.<br />정확한 피부 분석을 위해 더나 클리닉 상담을 추천드려요.</p>
                                <button 
                                    type="button" 
                                    className="link-button"
                                    style={{ zIndex: 10, position: 'relative', pointerEvents: 'auto' }}
                                    onClick={() => navigate('/clinic')}
                                >
                                    더나 클리닉 예약하기
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}

export default WeeklySwimReport;