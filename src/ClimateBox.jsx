import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CSS/MapStyle.css';
import temp from './Images/temp.svg';
import vent from './Images/vent.svg';
import hem from './Images/hem.svg';
import meteo from './Images/meteo.svg';

function ClimateBox() {
  const [showBox, setShowBox] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const boxRef = useRef(null);
  const [climateData, setClimateData] = useState(null);

  const handleButtonClick = () => {
    setShowBox(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/climate?lat=36.4515&lon=10.7353');
        setClimateData(res.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données climatiques:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setShowBox(false);
      }
    };

    if (isMobile && showBox) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, showBox]);

  return (
    <div className="climate-wrapper">
      {isMobile && !showBox && (
        <div className="Box-Icon-Clima">
          <button onClick={handleButtonClick}>
            <img src={meteo} alt="Météo" />
          </button>
        </div>
      )}

      {(!isMobile || showBox) && (
        <div className="climate-box show" ref={boxRef}>
          <h4>Conditions climatiques - Nabeul</h4>
          <div className="climate-item">
            <div>
              <img src={temp} alt="Température" />
              <span>Température:</span>
            </div>
            <strong>{climateData?.temperature ?? '--'} °C</strong>
          </div>
          <div className="climate-item">
            <div>
              <img src={vent} alt="Vent" />
              <span>Vent:</span>
            </div>
            <strong>{climateData?.wind ?? '--'} m/s</strong>
          </div>
          <div className="climate-item">
            <div>
              <img src={hem} alt="Humidité" />
              <span>Humidité:</span>
            </div>
            <strong>{climateData?.humidity ?? '--'} %</strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClimateBox;