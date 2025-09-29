L.tileLayer.wms("http://localhost:8080/geoserver/NabeulPFE/wms", { 
    layers: "NabeulPFE:NDVI", 
    format: "image/png", 
    transparent: true 
}).addTo(map); 