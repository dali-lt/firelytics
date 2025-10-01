import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './CSS/MapStyle.css';
import Logo from '../public/FirelyticsLogo1.png';
import BottBox from './BottomIcon.jsx';
import L from 'leaflet';
import MiddleBox from './MiddleIcons.jsx';
import MouseCorrd from './MouseCorrd.jsx';
import AutreOption from './AutreOption.jsx';
import ClimateBox from './ClimateBox.jsx';
import DrawAndFilterBtn from './DrawAndFilterBtn.jsx';
import { useNavigate } from 'react-router-dom';

function FullMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const wmsLayersRef = useRef({}); 
  const [mapReady, setMapReady] = useState(false);
  const [activeBox, setActiveBox] = useState(null);
  const [drawnGeometry, setDrawnGeometry] = useState(null);
  const [activeLayers, setActiveLayers] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [layerStates, setLayerStates] = useState({
    dem: false,
    pente: false,
    aspect: false,
    ndvi: false,
    ndwi: false,
    savi: false,
    occ_sol: false,
    den_for: false
  });

  useEffect(() => {
    const layersParam = searchParams.get("layers");
    if (layersParam) {
      try {
        const parsedLayers = JSON.parse(layersParam);
        setLayerStates(parsedLayers);
      } catch (err) {
        console.error("Erreur parsing layers:", err);
      }
    }
  }, []);

  // إنشاء الخريطة
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const initMap = () => {
      try {
        if (mapRef.current._leaflet_id) {
          L.DomUtil.get(mapRef.current)._leaflet_id = null;
        }

        const zoomParam = searchParams.get("zoom");
        const latParam = searchParams.get("lat");
        const lngParam = searchParams.get("lng");

        const initialZoom = zoomParam ? parseInt(zoomParam, 10) : 9;
        const initialLat = latParam ? parseFloat(latParam) : 36.7;
        const initialLng = lngParam ? parseFloat(lngParam) : 10.73;

        const map = L.map(mapRef.current, {
          preferCanvas: true,
          zoomControl: false
        }).setView([initialLat, initialLng], initialZoom);

        mapInstance.current = map;

        const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        });

        const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri'
        });

        const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenTopoMap'
        });

        osm.addTo(map);

        const baseMaps = {
          "OSM": osm,
          "Satellite": satellite,
          "Topographic": topo
        };

        L.control.layers(baseMaps, null, {
          position: 'bottomright'
        }).addTo(map);

        // نحضرو الطبقات WMS ونخزنوهم
        wmsLayersRef.current = {
          dem: L.tileLayer.wms("http://localhost:8080/geoserver/NabeulPFE/wms", {
            layers: "NabeulPFE:DEM",
            format: "image/png",
            transparent: true
          }),
          pente: L.tileLayer.wms("http://localhost:8080/geoserver/NabeulPFE/wms", {
            layers: "NabeulPFE:Pente",
            format: "image/png",
            transparent: true
          }),
          aspect: L.tileLayer.wms("http://localhost:8080/geoserver/NabeulPFE/wms", {
            layers: "NabeulPFE:Aspect",
            format: "image/png",
            transparent: true
          }),
          ndvi: L.tileLayer.wms("http://localhost:8080/geoserver/NabeulPFE/wms", {
            layers: "NabeulPFE:NDVI",
            format: "image/png",
            transparent: true
          }),
          ndwi: L.tileLayer.wms("http://localhost:8080/geoserver/NabeulPFE/wms", {
            layers: "NabeulPFE:NDWI",
            format: "image/png",
            transparent: true
          }),
          savi: L.tileLayer.wms("http://localhost:8080/geoserver/NabeulPFE/wms", {
            layers: "NabeulPFE:SAVI",
            format: "image/png",
            transparent: true
          }),
          occ_sol: L.tileLayer.wms("http://localhost:8080/geoserver/NabeulPFE/wms", {
            layers: "NabeulPFE:Occ_sol",
            format: "image/png",
            transparent: true
          }),
          den_for: L.tileLayer.wms("http://localhost:8080/geoserver/NabeulPFE/wms", {
            layers: "NabeulPFE:Den_For",
            format: "image/png",
            transparent: true
          })
        };

        setMapReady(true);
      } catch (error) {
        console.error("Failed to initialize map:", error);
      }
    };

    const timer = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // إضافة الطبقات حسب URL وقت الخريطة تكون جاهزة
  useEffect(() => {
    if (!mapReady || !mapInstance.current) return;

    const map = mapInstance.current;

    Object.entries(layerStates).forEach(([key, isActive]) => {
      const layer = wmsLayersRef.current[key];
      if (layer) {
        if (isActive && !map.hasLayer(layer)) {
          layer.addTo(map);
        } else if (!isActive && map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      }
    });
  }, [mapReady, layerStates]);

  const handleLayerChange = useCallback((layers) => {
    setActiveLayers(layers || []);
  }, []);

  return (
    <div className="fullmap-wrapper">
      <div ref={mapRef} className="fullscreen-map"></div>

      {mapReady && (
        <>
          <MouseCorrd map={mapInstance.current} />
          <div className="sideBar">
            <div className="top-icon">
              <button onClick={() => navigate('/')} title="Home" className='Home'>
                <img src={Logo} alt="Home" className="icon-img" />
              </button>
            </div>
            <MiddleBox 
              map={mapInstance.current} 
              activeBox={activeBox} 
              setActiveBox={setActiveBox} 
              onLayerChange={handleLayerChange} 
              layerStates={layerStates}
              setLayerStates={setLayerStates}
            />
            <BottBox activeBox={activeBox} setActiveBox={setActiveBox} />
            <ClimateBox />
          </div>
          <AutreOption 
            map={mapInstance.current}
            layerStates={layerStates}
          />
          <DrawAndFilterBtn
            map={mapInstance.current}
            setDrawnGeometry={setDrawnGeometry}
            drawnGeometry={drawnGeometry}
            layers={activeLayers}
          />
        </>
      )}
    </div>
  );
}

export default FullMap;
