import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/style.css';
import './CSS/leaflet.css';
import L from 'leaflet';

function MapBox() {
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([36.7, 10.73], 8);

    // Basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: 'CartoDB'
    }).addTo(map);                  

    // WMS layer
    L.tileLayer.wms("http://localhost:8080/geoserver/NabeulPFE/wms", {
      layers: "NabeulPFE:gouv_nabeul", 
      format: "image/png",
      transparent: true,
      attribution: "GeoServer",
    }).addTo(map);

    // عند الضغط على الخريطة المصغرة
    map.on('click', () => {
      navigate('/map');  // التنقل للـ FullMap
    });

    return () => map.remove();
  }, [navigate]);

  return (
    <div 
      ref={mapRef} 
      id="map" 
      style={{ height: '300px', cursor: 'pointer' }}
    />
  );
}

export default MapBox;