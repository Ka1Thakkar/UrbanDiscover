import { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import markerIcon from '@/public/marker.svg'
import L from 'leaflet';
import { CircleX } from "lucide-react";
import { DM_Serif_Display, DM_Sans, Roboto_Condensed, Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer";

const headingFont = Roboto_Condensed({ subsets: ['latin'], weight: 'variable' });
const contentFont = Roboto({ subsets: ['latin'], weight: ['400','500','700'] });

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
        const [locationData, setLocationData] = useState<any>([])

        
        useEffect(() => {
            const getMarkers = (async () => {
                console.log("inside getSuggestions");
                const resHistoricalMonuments = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=200000&q=historical+monuments&apiKey=v3oh-ib_9QUwuc4GFdDzm8I21nq41fVaTyjro6eXQE0`)
                const resTouristAttractions = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=2000000&q=tourist+attractions&apiKey=v3oh-ib_9QUwuc4GFdDzm8I21nq41fVaTyjro6eXQE0`)
                const resLandmarkAttractions = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=2000000&q=landmark+attractions&apiKey=v3oh-ib_9QUwuc4GFdDzm8I21nq41fVaTyjro6eXQE0`)
                const resReligiousPlaces = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=2000000&q=religious+places&apiKey=v3oh-ib_9QUwuc4GFdDzm8I21nq41fVaTyjro6eXQE0`)
                const resMuseums = await fetch(`https://discover.search.hereapi.com/v1/discover?in=circle:`+ coordinates[0] + `,` + coordinates[1] + `;r=2000000&q=museums&apiKey=v3oh-ib_9QUwuc4GFdDzm8I21nq41fVaTyjro6eXQE0`)
                const dataHistoricalMonuments = await resHistoricalMonuments.json();
                const dataTouristAttractions = await resTouristAttractions.json();
                const dataLandmarkAttractions = await resLandmarkAttractions.json();
                const dataMuseums = await resMuseums.json();
                const dataReligiousPlaces = await resReligiousPlaces.json();
                const data = dataHistoricalMonuments.items.concat(dataTouristAttractions.items, dataLandmarkAttractions.items, dataMuseums.items, dataReligiousPlaces.items)
                setMarkers(data)
            }
            );
            if(coordinates[0]!==undefined && coordinates[1]!==undefined){
                getMarkers();
            }
            
        }, [coordinates])
        return (
            <>
            <AnimatePresence>
                {modal && (<Modal markerData={markerData} state={modal} stateFunction={setModal} mode={mode} />)}
            </AnimatePresence>
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
                {markers?.map((marker : any, index : any) => {
                    return (
                        <Marker icon={myIcon} key={index} position={marker !== undefined ? [marker?.position.lat, marker?.position.lng] : [lat, lng]}>
                            <Popup className="">
                                <div className="">
                                    <h1 className={cn(headingFont.className, " text-base font-semibold")}>
                                        {marker?.title}
                                    </h1>
                                    <button className={cn(contentFont.className, " text-blue-950 pt-2")} onClick={() => {setModal(true); setMarkerData(marker)}}>
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
    // const getMessage = async (marker : any) => {
    //     if (marker.title !== undefined) {const res = await fetch('/api/claude-ai', {
    //         method : 'POST',
    //         headers :{
    //             'ContentType' : 'application/json'
    //         },
    //         body : JSON.stringify({
    //             someData : true,
    //             topic : marker.title
    //         })
    //     })}
    // }

    // useEffect(() => {
    //     getMessage(markerData)
    // })

    return (
        <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            transition={{duration:0.2,ease:"easeInOut"}}
            exit={{opacity:0}}
            className={cn("absolute z-[9999] h-fit lg:h-screen lg:top-0 bottom-0 left-0 flex items-end lg:items-end p-5 w-[100vw] lg:w-fit", contentFont.className)}
        >
            <motion.div 
                initial={{opacity:0, y:500}}
                animate ={{opacity:1, y:0}}
                transition={{duration:0.2,ease:"easeInOut"}}
                exit={{opacity:0, y:500}}
                className={cn("lg:w-[30vw] w-full h-fit backdrop-blur-xl p-10 rounded-2xl z-[99999] relative overflow-y-auto", mode === 'dark' ? 'bg-neutral-300/80 text-neutral-900' : 'bg-neutral-700/80 text-neutral-100')}
            >
                <div role="button" className={cn("fixed top-5 right-5", mode === 'dark' ? 'text-red-700' : 'text-red-400')} onClick={() => stateFunction(!state)}>
                    <CircleX size={30} />
                </div>
                <div className=" flex flex-col gap-2">
                    <p className={cn("text-5xl font-semibold", headingFont.className)}>
                        {markerData.title}
                    </p>
                    <p className="pt-10 text-sm font-light">
                        <span className="font-bold">Address</span> : {markerData.address.label} ({markerData.position.lat}, {markerData.position.lng})
                    </p>
                    <div className="text-sm flex gap-5">
                        <p className="font-bold">Categories :</p>
                        <ul className=" list-disc list-inside">
                            {markerData.categories?.map((category : any, index : any) => {
                                return (
                                    <li key={index} className="font-light">{category.name}</li>
                                )
                            })}
                        </ul>
                    </div>
                    <p className="text-sm">
                        <span className="font-bold">Distance</span> : {markerData.distance/1000} km
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}