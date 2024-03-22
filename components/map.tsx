import { useEffect, useState } from "react";
import { HPlatform, HMap } from "react-here-map";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';

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

interface MapProps {
    coordinates: number[]
}

const Map = ({ coordinates }: MapProps) => {
        const lat = coordinates[0]
        const lng = coordinates[1]
        const [markers, setMarkers] = useState<any>([])
        const [Data, setData] = useState<any>([])

        useEffect(() => {
            const getMarkers = (async () => {
                console.log("inside getSuggestions");
                const res = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=20000&q=historical+monuments&apiKey=I8lpkuRyJfxK5An9NzPrFalvL_9Nyjh5Qx76yN9xRQs`)
                const data = await res.json();
                setMarkers(data)
                console.log(Data)
              }
            );
            if(coordinates[0]!==undefined && coordinates[1]!==undefined){
                getMarkers();
            }
      
        }, [coordinates])
        return (
            <MapContainer
                id="Map"
                center={[28.679079, 77.069710]}
                zoom={15}
                scrollWheelZoom={true}
                zoomControl={false}
                zoomAnimation
                className="w-[100vw] h-[100vh]"
            >
                {/* {() => {
                    const L = require('leaflet');
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
                    return (myIcon)
                }} */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" 
                    className=" grayscale invert <brightness-75></brightness-75> contrast-100"
                />
                <RecenterAutomatically lat={lat} lng={lng} />
                {markers.items?.map((marker: any, index : any) => {
                    return (
                        <Marker icon={myIcon} key={index} position={[marker.position.lat, marker.position.lng]}>
                            <Popup>
                                {marker.title}
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
    );
}

export default Map;

const RecenterAutomatically = ({lat,lng} : any) => {
    const map = useMap();
     useEffect(() => {
       map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
}