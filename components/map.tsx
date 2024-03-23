import { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import markerIcon from '@/public/marker.svg'
import L from 'leaflet';
import { CircleX } from "lucide-react";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const headingFont = DM_Serif_Display({ subsets: ['latin'], weight: ['400'] });
const contentFont = DM_Sans({ subsets: ['latin'], weight: ['400'] });

const myIcon = L.divIcon({
    html: `<img src=${markerIcon.src} alt="marker" />`,
    iconSize: [0, 0],
    className: 'leaflet-div-icon',
    iconAnchor: [-15, -15]
});


interface MapProps {
    coordinates: number[],
    layer : string,
    mode : string,
}

const Map = ({ coordinates, layer, mode }: MapProps) => {
        const lat = coordinates[0]
        const lng = coordinates[1]
        const [markers, setMarkers] = useState<any>([])
        const [Data, setData] = useState<any>([])
        const [modal, setModal] = useState(false)
        const [markerData, setMarkerData] = useState<any>([])

        useEffect(() => {
            const getMarkers = (async () => {
                console.log("inside getSuggestions");
                const resHistoricalMonuments = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=200000&q=historical+monuments&apiKey=v3oh-ib_9QUwuc4GFdDzm8I21nq41fVaTyjro6eXQE0`)
                const resTouristAttractions = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=2000000&q=tourist+attractions&apiKey=v3oh-ib_9QUwuc4GFdDzm8I21nq41fVaTyjro6eXQE0`)
                const resLandmarkAttractions = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=2000000&q=landmark+attractions&apiKey=v3oh-ib_9QUwuc4GFdDzm8I21nq41fVaTyjro6eXQE0`)
                const dataHistoricalMonuments = await resHistoricalMonuments.json();
                const dataTouristAttractions = await resTouristAttractions.json();
                const dataLandmarkAttractions = await resLandmarkAttractions.json();
                const data = dataHistoricalMonuments.items.concat(dataTouristAttractions.items, dataLandmarkAttractions.items)
                setMarkers(data)
              }
            );
            if(coordinates[0]!==undefined && coordinates[1]!==undefined){
                getMarkers();
            }
      
        }, [coordinates])
        return (
            <>
            {modal && (<Modal markerData={markerData} state={modal} stateFunction={setModal} mode={mode} />)}
            <MapContainer
                id="Map"
                center={[28.679079, 77.069710]}
                zoom={15}
                scrollWheelZoom={true}
                zoomControl={false}
                zoomAnimation
                className="w-[100vw] h-[100vh]"
            >
                {layer === 'HERE' && mode === 'light' &&(<TileLayer
                    url="https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?apiKey=I8lpkuRyJfxK5An9NzPrFalvL_9Nyjh5Qx76yN9xRQs&ppi=320"
                    // attribution="&copy; <a>HERE Maps</a> contributors" 
                    className=" grayscale"
                />)}
                {layer === 'HERE' && mode === 'dark' &&(<TileLayer
                    url="https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/reduced.night/{z}/{x}/{y}/512/png8?apiKey=I8lpkuRyJfxK5An9NzPrFalvL_9Nyjh5Qx76yN9xRQs&ppi=320"
                    // attribution="&copy; <a>HERE Maps</a> contributors" 
                    className=" grayscale contrast-200"
                />)}
                {layer === 'OpenStreetMap' && mode === 'light' &&(<TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // attribution="&copy; <a>OpenStreetMap</a> contributors" 
                    className=" grayscale"
                />)}
                {layer === 'OpenStreetMap' && mode === 'dark' &&(<TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // attribution="&copy; <a>OpenStreetMap</a> contributors" 
                    className=" grayscale invert"
                />)}
                <RecenterAutomatically lat={lat} lng={lng} />
                {markers?.map((marker: any, index : any) => {
                    return (
                        <Marker icon={myIcon} key={index} position={[marker.position.lat, marker.position.lng]}>
                            <Popup className="">
                                <div className="py-2 px-5">
                                    <h1 className=" text-base font-semibold">
                                        {marker.title}
                                    </h1>
                                    <button className=" text-blue-950 pt-2" onClick={() => {setModal(true); setMarkerData(marker)}}>
                                        Read More...
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
            </>
    );
}

export default Map;

const RecenterAutomatically = ({lat,lng} : any) => {
    const map = useMap();
     useEffect(() => {
       if (lat !== undefined )
        {
            map.setView([lat, lng]);
        } else {
            map.setView([28.679079, 77.069710]);
        }
    }, [lat, lng]);
    return null;
}

interface ModalProps {
    markerData : any,
    state : boolean,
    stateFunction : any,
    mode : string
}

const Modal = ({markerData, state, stateFunction, mode} : ModalProps) => {
    return (
        <div className={cn("absolute z-[99999] w-screen h-screen top-0 left-0 flex items-center justify-center", contentFont.className)}>
            <div className={cn("w-[75vw] h-[75vh] backdrop-blur-xl p-5 rounded-xl", mode === 'dark' ? 'bg-neutral-300/80 text-neutral-900' : 'bg-neutral-700/80 text-neutral-100')}>
                <div role="button" onClick={() => stateFunction(!state)}>
                    <CircleX size={30} />
                </div>
                <div className="pt-10">
                    <p className={cn("text-5xl uppercase", headingFont.className)}>
                        {markerData.title}
                    </p>
                    <p className="pt-2 font-light">
                        Address : {markerData.address.label} ({markerData.position.lat}, {markerData.position.lng})
                    </p>
                    <p className="font-light">
                        Category : {markerData.categories[0].name}
                    </p>
                </div>
            </div>
        </div>
    )
}