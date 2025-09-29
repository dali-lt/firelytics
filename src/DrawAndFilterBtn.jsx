// DrawAndFilterBtn.jsx
import { useEffect, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import './CSS/DrawBtn.css';
import draw from './Images/draw.svg';
import close from './Images/close.svg';
import proj4 from 'proj4'
import * as d3 from "d3";

function DrawAndFilterBtn({ map, layers, drawnGeometry, setDrawnGeometry }) {
  console.log("Layers received:", layers);
  console.log("Drawn geometry:", drawnGeometry);
  const [isActive, setIsActive] = useState(false);
  const [drawControl, setDrawControl] = useState(null);
  const [drawnLayer, setDrawnLayer] = useState(null);
  const [drawnItems, setDrawnItems] = useState(null);

  proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
  proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");

  const convertGeometryTo32632 = (geometry) => {
    if (!geometry || !geometry.geometry || !geometry.geometry.coordinates) {
      console.error("Invalid geometry for conversion:", geometry);
      return null;
    }
  
    try {
      const coordinates = JSON.parse(JSON.stringify(geometry.geometry.coordinates));
      
      const convertPoint = (point) => {
        if (!Array.isArray(point) || point.length < 2) {
          console.warn("Invalid point:", point);
          return null;
        }
        const [lng, lat] = point;
        if (isNaN(lng) || isNaN(lat)) return null;
        return proj4("EPSG:4326", "EPSG:32632", [lng, lat]);
      };
  
      const convertRing = (ring) => {
        if (!Array.isArray(ring)) {
          console.warn("Invalid ring:", ring);
          return [];
        }
        return ring.map(convertPoint).filter(p => p !== null);
      };
  
      let convertedCoords;
      if (geometry.geometry.type === "Polygon") {
        convertedCoords = [convertRing(coordinates[0])];
      } else if (geometry.geometry.type === "MultiPolygon") {
        convertedCoords = coordinates.map(polygon => polygon.map(convertRing));
      } else {
        console.warn("Unsupported geometry type:", geometry.geometry.type);
        return null;
      }
  
      // تأكد من أن جميع الحلقات تحتوي على نقاط صالحة
      if (convertedCoords.some(ring => ring.length === 0)) {
        console.error("Empty rings after conversion");
        return null;
      }
  
      return {
        ...geometry,
        geometry: {
          ...geometry.geometry,
          coordinates: convertedCoords
        }
      };
    } catch (error) {
      console.error("Conversion error:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!map || !drawnGeometry || !layers?.length) return;
  
    let svgElement = null;
  
    const applyClipping = () => {
      try {
        if (svgElement && map.getPanes().overlayPane.contains(svgElement)) {
          map.getPanes().overlayPane.removeChild(svgElement);
        }
  
        if (!drawnGeometry.geometry || !drawnGeometry.geometry.coordinates || !drawnGeometry.geometry.coordinates[0]) {
          throw new Error('Invalid geometry data');
        }
  
        const firstCoord = drawnGeometry.geometry.coordinates[0][0];
        if (!firstCoord || firstCoord.length < 2) {
          throw new Error('Invalid first coordinate');
        }
  
        const referencePoint = map.latLngToContainerPoint([firstCoord[1], firstCoord[0]]);
        if (!referencePoint || isNaN(referencePoint.x)) {
          throw new Error('Failed to calculate reference point');
        }
  
        const pathData = getPathDataSafely(drawnGeometry, map, referencePoint);

        svgElement = L.DomUtil.create('div', 'leaflet-svg-clip');
        svgElement.style.position = 'absolute';
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        svgElement.style.pointerEvents = 'none';
  
        svgElement.innerHTML = `
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="svgClipPath" transform="translate(${referencePoint.x} ${referencePoint.y})">
                <path d="${pathData}"/>
              </clipPath>
            </defs>
          </svg>
        `;
  
        map.getPanes().overlayPane.appendChild(svgElement);

        layers.forEach(layer => {
          try {
            const container = layer.getContainer();
            if (container) {
              container.style.clipPath = 'url(#svgClipPath)';
              container.style.webkitClipPath = 'url(#svgClipPath)';
            }
          } catch (layerError) {
            console.error('Error applying clip to layer:', layerError);
          }
        });
  
      } catch (mainError) {
        console.error('Error in clipping process:', mainError);
        if (svgElement && map.getPanes().overlayPane.contains(svgElement)) {
          map.getPanes().overlayPane.removeChild(svgElement);
        }
      }
    };
  
    const getPathDataSafely = (geometry, map, refPoint) => {
      try {
        if (!geometry?.geometry?.coordinates?.[0]) return 'M 0 0';
        
        return geometry.geometry.coordinates[0]
          .map((coord, i) => {
            try {
              if (!coord || coord.length < 2) return '';
              const point = map.latLngToContainerPoint([coord[1], coord[0]]);
              return `${i === 0 ? 'M' : 'L'}${point.x - refPoint.x} ${point.y - refPoint.y}`;
            } catch (pointError) {
              console.error('Error processing point:', coord, pointError);
              return '';
            }
          })
          .filter(segment => segment !== '')
          .join(' ') + (geometry.geometry.coordinates[0].length > 0 ? ' Z' : '');
      } catch (error) {
        console.error('Error in getPathData:', error);
        return 'M 0 0';
      }
    };
  
    try {
      const tempLayer = L.geoJSON(drawnGeometry);
      map.fitBounds(tempLayer.getBounds(), {
        padding: [20, 20],
        animate: true
      });
    } catch (fitError) {
      console.error('Error fitting bounds:', fitError);
    }
  
    applyClipping();
  
    const handleMapChange = () => {
      applyClipping();
    };
  
    map.on('moveend', handleMapChange);
    map.on('zoomend', handleMapChange);
  
    return () => {
      map.off('moveend', handleMapChange);
      map.off('zoomend', handleMapChange);
      if (svgElement && map.getPanes().overlayPane.contains(svgElement)) {
        map.getPanes().overlayPane.removeChild(svgElement);
      }
      layers.forEach(layer => {
        try {
          const container = layer.getContainer();
          if (container) {
            container.style.clipPath = 'none';
            container.style.webkitClipPath = 'none';
          }
        } catch (cleanupError) {
          console.error('Error during cleanup:', cleanupError);
        }
      });
    };
  }, [map, drawnGeometry, layers]);

  useEffect(() => {
    if (!map) return;

    const drawnItemsLocal = new L.FeatureGroup();
    map.addLayer(drawnItemsLocal);
    setDrawnItems(drawnItemsLocal);

    const drawControlLocal = new L.Control.Draw({
      position: 'bottomright',
      draw: {
        polyline: false,
        polygon: true,
        circle: false,
        rectangle: true,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItemsLocal,
        edit: false,
        remove: false
      }
    });

    setDrawControl(drawControlLocal);

    map.on(L.Draw.Event.CREATED, (e) => {
      if (drawnLayer) {
        drawnItemsLocal.removeLayer(drawnLayer);
      }

      const layer = e.layer;
      setDrawnLayer(layer);
      drawnItemsLocal.addLayer(layer);

      const geojson = layer.toGeoJSON();
      setDrawnGeometry(geojson);
    });

    return () => {
      if (map && drawControlLocal) {
        map.removeControl(drawControlLocal);
      }
      if (drawnItemsLocal) {
        map.removeLayer(drawnItemsLocal);
      }
      map.off(L.Draw.Event.CREATED);
    };
  }, [map]);

  const toggleDraw = () => {
    if (!map || !drawControl) return;

    if (!isActive) {
      map.addControl(drawControl);
    } else {
      map.removeControl(drawControl);
      if (drawnLayer) {
        drawnItems.removeLayer(drawnLayer);
        setDrawnLayer(null);
      }
      setDrawnGeometry(null);
    }

    setIsActive(!isActive);
  };

  return (
    <button className={isActive ? 'draw-btn active' : 'draw-btn'} onClick={toggleDraw} title="Dessiner un filtre">
      <img
        src={isActive ? close : draw}
        alt="draw"
        className='draw-icon'
      />
    </button>
  );
}

export default DrawAndFilterBtn;