import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';
import homeActivated from '../../assets/images/home-activated.svg';
import homeDeactivated from '../../assets/images/home-deactivated.svg';
import analyzeActivated from '../../assets/images/analyze-activated.svg';
import analyzeDeactivated from '../../assets/images/analyze-deactivated.svg';
import poolsActivated from '../../assets/images/pools-activated.svg';
import poolsDeactivated from '../../assets/images/pools-deactivated.svg';
import clinicActivated from '../../assets/images/clinic-activated.svg';
import clinicDeactivated from '../../assets/images/clinic-deactivated.svg';
import myActivated from '../../assets/images/my-activated.svg';
import myDeactivated from '../../assets/images/my-deactivated.svg';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/home', activeIcon: homeActivated, inactiveIcon: homeDeactivated, alt: '홈' },
        { path: '/analysis', activeIcon: analyzeActivated, inactiveIcon: analyzeDeactivated, alt: '분석' },
        { path: '/pool', activeIcon: poolsActivated, inactiveIcon: poolsDeactivated, alt: '수영장' },
        { path: '/clinic', activeIcon: clinicActivated, inactiveIcon: clinicDeactivated, alt: '클리닉' },
        { path: '/my', activeIcon: myActivated, inactiveIcon: myDeactivated, alt: '마이' },
    ];

    return (
    <nav className="bottom-nav-container">
        {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
                <div
                    key={item.path}
                    className="nav-item"
                    onClick={() => navigate(item.path)}
                >
                    <img
                        src={isActive ? item.activeIcon : item.inactiveIcon}
                        alt={item.alt}
                        className="nav-image"
                    />
                </div>
                );
            })}
        </nav>
    );
};

export default BottomNav;