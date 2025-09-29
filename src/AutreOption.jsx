import './CSS/MapStyle.css';
import React, {useState, useRef, useEffect} from 'react';
import sea from './Images/search.svg';
import more from './Images/plus.svg';
import Cl from './Images/close.svg'
import ai from './Images/ai.svg'
import down from './Images/download.svg'
import para from './Images/partage.svg'

function AutreOption({ map, layerStates }) {
    const [activeBox, setActiveBox] = useState(null);
    const inputRef = useRef(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (activeBox === 'search' && inputRef.current){
            inputRef.current.focus();
        }
    }, [activeBox]);

    const toggleSearch = () => {
        setActiveBox(activeBox === 'search' ? null : 'search');
    };

    const toggleMore = () => {
        setActiveBox(activeBox === 'more' ? null : 'more');
    };

    const handleCopyLink = () => {
        const zoom = map.getZoom();
        const center = map.getCenter(); // {lat, lng}
        
        const layerState = layerStates;

        const url = new URL(window.location.origin + '/map');
        url.searchParams.set("zoom", zoom);
        url.searchParams.set("lat", center.lat.toFixed(5));
        url.searchParams.set("lng", center.lng.toFixed(5));
        url.searchParams.set("layers", JSON.stringify(layerState));

        navigator.clipboard.writeText(url.toString())
            .then(() => {
                alert("Lien copié !");
            })
            .catch(err => {
                console.error("Erreur lors de la copie du lien :", err);
            });
    };

    const handleDownload = () => {
        // نمرّ الطبقات المفعّلة للباك
        const activeLayers = Object.keys(layerStates).filter(layer => layerStates[layer]);

        if (activeLayers.length === 0) {
            alert("Aucune couche active !");
            return;
        }

        // نرسل جميع الطبقات المفعّلة في نفس الطلب
        const layersParam = activeLayers.join(',');
        const downloadUrl = `${import.meta.env.REACT_APP_API_URL || 'http://localhost:3001'}/download?layers=${layersParam}`;
        
        // نفتح رابط التنزيل في نافذة جديدة أو تحميل مباشر
        window.open(downloadUrl, '_blank');
    };

    return(
        <>
            <div className={`search-container ${activeBox === 'search' ? 'active' : ''}`}>
                <img src={sea} alt="search" className='search-icon' onClick={toggleSearch} />
                <input type="text" 
                    placeholder='Search...'
                    ref={inputRef}
                    className='search-input'
                    value={searchText} 
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            <div className={`more-container ${activeBox === 'search' ? 'move' : ''}`}>
                <button onClick={toggleMore}
                    className={`more-btn ${activeBox === 'more' ? 'active' : ''} ${activeBox === 'more' ? 'colorMove' : ''}`}
                >
                    {activeBox === 'more' ? (
                        <img src={ Cl } alt="close" />
                    ) : (
                        <img src={ more } alt="more options" />
                    )}
                </button>

                {activeBox === 'more' &&(
                    <div className="extra-btns">
                        <div className="extra-btn"><img src={ ai } alt="AI" /></div>
                        <div className="extra-btn" onClick={handleDownload}>
                            <img src={ down } alt="Download" />
                        </div>
                        <div className="extra-btn" onClick={handleCopyLink}>
                            <img src={para} alt="Partage" />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default AutreOption