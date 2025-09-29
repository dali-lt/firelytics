import { useEffect, useState } from 'react';
import './CSS/MapStyle.css'

function MouseCorrd({ map }) {
  const [mouseCoords, setMouseCoords] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (!map) return;

    const handleMouseMove = (e) => {
      setMouseCoords({
        lat: e.latlng.lat.toFixed(4),
        lng: e.latlng.lng.toFixed(4)
      });
    };

    map.on('mousemove', handleMouseMove);

    return () => {
      map.off('mousemove', handleMouseMove);
    };
  }, [map]);

  return (
    <div className="coordinates-box">
      <span>Lat: {mouseCoords.lat}</span>
      <span>Lng: {mouseCoords.lng}</span>
    </div>
  );
}

export default MouseCorrd;