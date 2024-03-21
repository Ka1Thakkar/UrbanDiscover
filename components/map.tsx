import { HPlatform, HMap } from "react-here-map";

interface MapProps {
    coordinates : number[]
}

const Map = ({coordinates} : MapProps) => {
    const lat = coordinates[0]
    const lng = coordinates[1]
    return (
        <div>
            <HPlatform
                options={{
                    apiKey: 'Y2rF_WsjbbUAFLC8WHMQGQIP-WkR_BYXZn8Jl44cJSc',
                    appId: 'R804K7y7b4l9FoIt7NdY',
                    includePlaces: false,
                    includeUI: false,
                    interactive: true,
                    version: 'v3/3.1'
                }}
                >
                <HMap
                    options={{
                    center: {
                        lat: lat,
                        lng: lng
                    },
                    zoom:15,
                    mapType: 'raster.normal.mapnight'
                    }}
                    style={{
                    height: '100vh',
                    width: '100vw'
                    }}
                    useEvents
                />
            </HPlatform>
        </div>
    );
}
 
export default Map;