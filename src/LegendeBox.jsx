import React, { useState, useEffect } from 'react';
import './CSS/LegendBox.css';
import legendData from './JS/Legend.json';
import lg from './Images/legend.svg';

function LegendBox({ activeLayers }) {
    const [selectedLayer, setSelectedLayer] = useState(null);

    useEffect(() => {
        if (activeLayers.length > 0 && !activeLayers.includes(selectedLayer)) {
            setSelectedLayer(activeLayers[0]);
        } else if (activeLayers.length === 0) {
            setSelectedLayer(null);
        }
    }, [activeLayers]);

    // ✅ لا تظهر البوكس إذا ما فماش طبقات مفعّلة
    if (!activeLayers.length) return null;

    const selectedLegend = legendData.find(item => item.name === selectedLayer);

    return (
        <div className="legend-box">
            <div className="legend-titre">
                <div className="groub-titre">
                    <img src={lg} alt="Légende" />
                    <span>Légende :</span>
                </div>
                <select
                    className="layer-select"
                    value={selectedLayer || ''}
                    onChange={(e) => setSelectedLayer(e.target.value)}
                >
                    <option value="" disabled>-- Choisir une couche --</option>
                    {activeLayers.map((layer, i) => (
                        <option key={i} value={layer}>
                            {layer.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>

            {selectedLegend && (
                <div className="legend-item">
                    {selectedLegend.name === 'dem' ? (
                        <div className="dem-gradient">
                            <div
                                className="gradient-bar"
                                style={{
                                    background: `linear-gradient(to top, #${selectedLegend.classColor[0]}, #${selectedLegend.classColor[1]})`
                                }}
                            ></div>
                            <div className="gradient-labels">
                                <span>{selectedLegend.class[1]}</span>
                                <span>{selectedLegend.class[0]}</span>
                            </div>
                        </div>
                    ) : (
                        selectedLegend.class.map((label, i) => (
                            <div className="legend-row" key={i}>
                                <span
                                    className="color-box"
                                    style={{ backgroundColor: `#${selectedLegend.classColor[i]}` }}
                                ></span>
                                <span className="label-text">{label}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default LegendBox;