'use client'
import Map from "@/components/map";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [coordinates, setCoordinates] = useState<any>([])
  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout : 5000
    };

    function success(pos: { coords: any; }) {
      const crd = pos.coords;
      
      setCoordinates([crd.latitude, crd.longitude])
    }
    
    function error(err: { code: any; message: any; }) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, [0])
  return (
    <main className="relative max-w-screen">
      <Input className="w-[30vw] rounded-full bg-[#5E5E5E]/75 border-none text-xl font-bold backdrop-blur-md absolute z-[99] top-5 left-5" />
      <Map coordinates={coordinates} />
    </main>
  );
}
