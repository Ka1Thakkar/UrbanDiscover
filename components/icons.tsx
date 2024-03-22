import L from 'leaflet';
const myIcon = new L.Icon({
    iconUrl: require('../public/marker.svg'),
    iconRetinaUrl: require('../public/marker.svg'),
    popupAnchor:  [-0, -0],
    iconSize: new L.Point(50,50), 
    shadowUrl: undefined,    
    shadowSize : [0,0],
    shadowRetinaUrl: undefined,
    className: 'leaflet-div-icon'
});

export{myIcon};