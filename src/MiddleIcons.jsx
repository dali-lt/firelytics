import { useState, useEffect } from 'react';
import L from 'leaflet';
import './CSS/MapStyle.css';
import Cl from './Images/close.svg';
import Layer from './Images/layer.svg';
import Prob from './Images/problem.svg';
import Fav from './Images/favorite.svg';
import foret from './Images/foret.svg';
import folderOpen from './Images/folder-open.svg';
import folderClosed from './Images/folder-closed.svg';
import LegendBox from './LegendeBox.jsx';

function MiddleBox({ map, activeBox, setActiveBox, onLayerChange, layerStates, setLayerStates }) {
    const [problemText, setProblemText] = useState('');
    const [favorites, setFavorites] = useState([
        { id: 1, name: 'Forêt de Korbous', type: 'forêt' },
        { id: 2, name: 'Tour de surveillance', type: 'surveillance' }
    ]);

    const [openGroups, setOpenGroups] = useState({
        topographiques: false,
        indice_veg: false,
        occ_couv_Sol: false
    });

    const [addedLayers, setAddedLayers] = useState({});
    
    const layerParams = {
        dem: 'NabeulPFE:Nabeul_Dem',
        pente: 'NabeulPFE:Nabeul_Pente',
        aspect: 'NabeulPFE:Nabeul_Aspect',
        ndvi: 'NabeulPFE:Nabeul_NDVI',
        ndwi: 'NabeulPFE:Nabeul_NDWI',
        savi: 'NabeulPFE:Nabeul_SAVI',
        occ_sol: 'NabeulPFE:Nabeul_Occ_Sol',
        den_for: 'NabeulPFE:Nabeul_Den_For'
    };
    
    const isProblemActive = activeBox === 'problem';
    const isLayerActive = activeBox === 'layer';
    const isFavoriteActive = activeBox === 'favoris';

    const toggleProblemModel = () => {
        setActiveBox(isProblemActive ? null : 'problem');
    };

    const toggleLayerBox = () => {
        setActiveBox(isLayerActive ? null : 'layer');
    };

    const toggleFavorite = () => {
        setActiveBox(isFavoriteActive ? null : 'favoris');
    };

    const handleProblemSubmit = () => {
        console.log('Problème signalé :', problemText);
        setActiveBox(null); 
        setProblemText('');
    };

    const toggleGroup = (group) => {
        setOpenGroups((prev) => ({
          ...prev,
          [group]: !prev[group]
        }));
    };

    const toggleLayer = (layerName) => {
      setLayerStates((prev) => ({
        ...prev,
        [layerName]: !prev[layerName]
      }));
    };

    useEffect(() => {
        if (!map) return;
      
        const layersToUpdate = [];
        let shouldUpdate = false;
      
        Object.entries(layerStates).forEach(([key, isActive]) => {
          const existingLayer = addedLayers[key];
      
          if (isActive && !existingLayer) {
            const newLayer = L.tileLayer.wms("http://localhost:8080/geoserver/NabeulPFE/wms", {
              layers: layerParams[key],
              format: 'image/png',
              transparent: true,
              tiled: true
            });
            newLayer.addTo(map);
            addedLayers[key] = newLayer;
            layersToUpdate.push(newLayer);
            shouldUpdate = true;
          } else if (!isActive && existingLayer) {
            map.removeLayer(existingLayer);
            delete addedLayers[key];
            shouldUpdate = true;
          }
        });
      
        if (shouldUpdate) {
          setAddedLayers({...addedLayers});
          setTimeout(() => {
            onLayerChange(Object.values(addedLayers));
          }, 0);
        }

        const updatedLayers = Object.entries(layerStates)
          .filter(([_, isActive]) => isActive)
          .map(([key]) => addedLayers[key])
          .filter(Boolean);
      
        onLayerChange(updatedLayers.length ? updatedLayers : []);
    }, [layerStates, map, addedLayers]);

    return (
        <>
            <div className="middle-icon">
                <button
                    title="Layer"
                    onClick={toggleLayerBox}
                    className={isLayerActive ? 'btn-sideBar layer-btn active' : 'btn-sideBar layer-btn'}
                >
                    <img src={Layer} alt="Layer" className="icon-img" />
                </button>
                <button
                    title="Problem"
                    onClick={toggleProblemModel}
                    className={isProblemActive ? 'btn-sideBar problem-btn active' : 'btn-sideBar problem-btn'}
                >
                    <img src={Prob} alt="Problem" className="icon-img" />
                </button>
                <button
                    title="Favorite"
                    onClick={toggleFavorite}
                    className={isFavoriteActive ? 'btn-sideBar favo-btn active' : 'btn-sideBar favo-btn'}
                >
                    <img src={Fav} alt="Favorite" className="icon-img" />
                </button>
            </div>
            <LegendBox activeLayers={Object.keys(layerStates).filter(key => layerStates[key])} />

            {isProblemActive && (
                <div className="problem-sidebox">
                    <div className="sidebox-header">
                        <h3>Signaler un Problème</h3>
                        <button onClick={toggleProblemModel} className="close-btn">
                            <img src={Cl} alt="" />
                        </button>
                    </div>
                    <textarea
                        value={problemText}
                        onChange={(e) => setProblemText(e.target.value)}
                        placeholder="Décrivez le Problème rencontré..."
                    ></textarea>
                    <button onClick={handleProblemSubmit} className="submit-btn">
                        Envoyer
                    </button>
                </div>
            )}

            {isLayerActive && (
                <div className="layer-sidebox">
                    <div className="sidebox-header">
                        <h3>Option des Couches</h3>
                        <button onClick={toggleLayerBox} className="close-btn close-btn1">
                            <img src={Cl} alt="" />
                        </button>
                    </div>
                    <div className="layer-options">
                        {/* Groupe : Cartes topographiques */}
                        <div className="layer-group">
                            <div className="group-title" onClick={() => toggleGroup('topographiques')}>
                                <img src={openGroups.topographiques ? folderOpen : folderClosed} alt="folder" className="folder-icon" />
                                <span>Cartes topographiques</span>
                            </div>
                            {openGroups.topographiques && (
                                <div className="layer-suboptions">
                                    <div className="layer-option">
                                        <input
                                            type="checkbox"
                                            id="dem"
                                            checked={layerStates.dem}
                                            onChange={() => toggleLayer('dem')}
                                        />
                                        <label htmlFor="dem">Carte de l’altitude (DEM)</label>
                                    </div>
                                    <div className="layer-option">
                                        <input
                                            type="checkbox"
                                            id="pente"
                                            checked={layerStates.pente}
                                            onChange={() => toggleLayer('pente')}
                                        />
                                        <label htmlFor="pente">Carte de pente</label>
                                    </div>
                                    <div className="layer-option">
                                        <input
                                            type="checkbox"
                                            id="aspect"
                                            checked={layerStates.aspect}
                                            onChange={() => toggleLayer('aspect')}
                                        />
                                        <label htmlFor="aspect">Carte d’aspect</label>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Groupe : Occupation et couverture du sol */}
                        <div className="layer-group">
                            <div className="group-title" onClick={() => toggleGroup('occ_couv_Sol')}>
                                <img src={openGroups.occ_couv_Sol ? folderOpen : folderClosed} alt="folder" className="folder-icon" />
                                <span>Occupation et couverture du Sol</span>
                            </div>
                            {openGroups.occ_couv_Sol && (
                                <div className="layer-suboptions">
                                    <div className="layer-option">
                                        <input
                                            type="checkbox"
                                            id="occ_sol"
                                            checked={layerStates.occ_sol}
                                            onChange={() => toggleLayer('occ_sol')}
                                        />
                                        <label htmlFor="occ_sol">Occupation du sol</label>
                                    </div>
                                    <div className="layer-option">
                                        <input
                                            type="checkbox"
                                            id="den_for"
                                            checked={layerStates.den_for}
                                            onChange={() => toggleLayer('den_for')}
                                        />
                                        <label htmlFor="den_for">Densité Forestière</label>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Groupe : Les indices de végetation */}
                        <div className="layer-group">
                            <div className="group-title" onClick={() => toggleGroup('indice_veg')}>
                                <img src={openGroups.indice_veg ? folderOpen : folderClosed} alt="folder" className="folder-icon" />
                                <span>Les indices de végetation</span>
                            </div>
                            {openGroups.indice_veg && (
                                <div className="layer-suboptions">
                                    <div className="layer-option">
                                        <input
                                            type="checkbox"
                                            id="ndvi"
                                            checked={layerStates.ndvi}
                                            onChange={() => toggleLayer('ndvi')}
                                        />
                                        <label htmlFor="ndvi">Carte NDVI</label>
                                    </div>
                                    <div className="layer-option">
                                        <input
                                            type="checkbox"
                                            id="ndwi"
                                            checked={layerStates.ndwi}
                                            onChange={() => toggleLayer('ndwi')}
                                        />
                                        <label htmlFor="ndwi">Carte NDWI</label>
                                    </div>
                                    <div className="layer-option">
                                        <input
                                            type="checkbox"
                                            id="savi"
                                            checked={layerStates.savi}
                                            onChange={() => toggleLayer('savi')}
                                        />
                                        <label htmlFor="savi">Carte SAVI</label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isFavoriteActive && (
                <div className="favorite-sidebox">
                    <div className="sidebox-header">
                        <h3>Mes favoris</h3>
                        <button onClick={toggleFavorite} className="close-btn close-btn1">
                            <img src={Cl} alt="" />
                        </button>
                    </div>
                    <div className="favorites-list">
                        {favorites.length === 0 ? (
                            <p className="empty-message">Aucun favoris enregistré</p>
                        ) : (
                            favorites.map((fav) => (
                                <div className="favorite-item" key={fav.id}>
                                    <div className="item">
                                        <span className="fav-icon">
                                            <img src={foret} alt="" className="icon-img" />
                                        </span>
                                        <span className="fav-name">{fav.name}</span>
                                    </div>
                                    <button className="goto-btn">Voir sur la carte</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default MiddleBox;