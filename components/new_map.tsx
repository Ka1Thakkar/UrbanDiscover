import React, { useEffect } from 'react';
import { mappls } from  'mappls-web-maps';

const MapComponent: React.FC = () => {
  useEffect(() => {
    const initMap = () => {
      const map = new window.mappls.Map('map', { center: [28.638698386592438, 77.27604556863412] });
    };

    const script = document.createElement('script');
    script.src = `https://apis.mappls.com/advancedmaps/api/3d566c77-3b9d-47ca-9fbf-e983bd2601eb/map_sdk?layer=vector&v=3.0&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      initMap();
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div id="map" style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }} />
  );
};

export default MapComponent;
