// HomePage.jsx
import { useRef, useEffect, useState } from 'react';
import LOGO from '../public/FirelyticsLogo.png';
import Menu from './Images/Menu.svg';
import BoxHeader from './Header.jsx';
import PresBox from './PresentationBox.jsx';
import BtnBox from './BtnBox.jsx';
import SrvBox from './SrvBox.jsx';
import MapBox from './MapBox.jsx';
import FootBox from './Footer.jsx';

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuIconRef = useRef(null);
  const navMenuRef = useRef(null);

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    if (newState) {
      document.body.classList.add('SlidBody');
    } else {
      document.body.classList.remove('SlidBody');
    }
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (
        menuIconRef.current &&
        navMenuRef.current &&
        !menuIconRef.current.contains(event.target) &&
        !navMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        document.body.classList.remove('SlidBody');
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.body.classList.remove('SlidBody');
    };
  }, []);

  return (
    <>
      <div className="Navbar">
        <div className="logo">
          <img src={LOGO} alt="Firelytics Logo" />
        </div>

        <div 
          className={`nav-menu-container ${isMenuOpen ? 'active' : ''}`} 
          ref={navMenuRef}
        >
          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">News</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
          <ul className="menu">
            <li><a href="#">Log in</a></li>
            <li><a href="#">Sign in</a></li>
          </ul>
        </div>

        <div 
          className={`menu-icon ${isMenuOpen ? 'styleBtn' : ''}`} 
          ref={menuIconRef}
          onClick={toggleMenu}
        >
          <img src={Menu} alt="Menu Icon" />
        </div>
      </div>

      <BoxHeader />
      <PresBox />
      <BtnBox />
      <SrvBox />
      <MapBox />
      <FootBox />
    </>
  );
}

export default HomePage;
