import { useEffect, useState } from "react";
import { HPlatform, HMap } from "react-here-map";

interface MapProps {
    coordinates: number[]
}

const Map = ({ coordinates }: MapProps) => {
        const lat = coordinates[0]
        const lng = coordinates[1]
        console.log(lat, lng)
        return (
            <div>
                <HPlatform
                    options={{
                        apiKey: '3gSXkune0p-YKqCe8cho9flyOW5QeBe3Wj-4CJTqfrQ',
                        appId: 'R804K7y7b4l9FoIt7NdY',
                        includePlaces: false,
                        includeUI: false,
                        interactive: true,
                        version: 'v3/3.1',
                        useHTTPS: true,
                        useCIT: true,
                    }}
                >
                    <HMap
                        options={{
                            center: {
                                lat: lat,
                                lng: lng
                            },
                            zoom: 15,
                            mapType: 'raster.normal.mapnight',
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