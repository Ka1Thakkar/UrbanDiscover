import { useEffect, useState } from "react";
import { HPlatform, HMap } from "react-here-map";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';

import L from 'leaflet';
import Anthropic from "@anthropic-ai/sdk"
import { Button } from "@/components/ui/button"
import "leaflet/dist/leaflet.css";

import {myIcon} from './icons';

// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//     iconUrl: require('leaflet/dist/images/marker-icon.png'),
//     shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// });

const anthropic = new Anthropic({
  apiKey: "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",
})




interface MapProps {
    coordinates: number[]
}

const Map = ({ coordinates }: MapProps) => {
        const lat = coordinates[0]
        const lng = coordinates[1]
        const [markers, setMarkers] = useState<any>([])
        const [Data, setData] = useState<any>([])
        const [Msg,setMsg] =useState<any>([]);
        const [place,setPlace] = useState<any>([])

        // useEffect(()=>{
        //     const getMsg = ((location:string)=>{
        //         setMsg(async()=>{return (await anthropic.messages.create({
        //             model: "claude-3-opus-20240229",
        //             max_tokens: 1024,
        //             messages: [{ role: "user", content: "Give a historical Decription of " + location + " in 5 lines." }],
        //         }))})
        //     })

        //     getMsg(place)
            
        // },[place]);

        function LocationMarker() {
            const map = useMapEvents({
              click(e) {
                console.log(e);
                map.locate()
                // getInfo()
              },
              locationfound(e) {        
                map.flyTo(e.latlng, map.getZoom())
              },
            })
          

            return markers.items?.map((marker: any, index : any) => {
                return(
                    <>
                    <Button>
                        <Marker icon={myIcon} key={index} position={[marker.position.lat, marker.position.lng]}>
                            <Popup>
                                {marker.title}
                                {getInfo(marker.title)}
                            </Popup>
                        </Marker>
                    </Button>
                    </>
                    )
                }
                )
          }


        function getInfo(location : string){
            console.log(location)
            setPlace(location);
            return Msg;
        }
        
        // const placeInfo = async(location : string)  =>
        // {
        //                         const msg = await anthropic.messages.create({
        //                         model: "claude-3-opus-20240229",
        //                         max_tokens: 1024,
        //                         messages: [{ role: "user", content: "Give a historical Decription of " + location + " in 5 lines." }],
        //                         })
        //                         console.log(msg.content[0].text)
        //                         return msg.content;
        // }

        useEffect(() => {
            const getMarkers = (async () => {
                console.log("inside getSuggestions");
                const res = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=20000&q=historical+monuments&apiKey=5VMF81RZmt3xzNGQFjH5oJ7UWGkm8BjqNIrPmW97Ntw`)
                const data = await res.json();
                setMarkers(data)
                console.log(data)
                console.log(markers.length)
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
                <LocationMarker/>
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