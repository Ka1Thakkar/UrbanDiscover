'use client'
import Map from "@/components/map";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { stringify } from "querystring";
import { useEffect, useState, useLayoutEffect } from "react";

export default function Home() {
  const [coordinates, setCoordinates] = useState<any>([])
  const [fetched, setFetched] = useState(false)
  const [Data, setData] = useState<any>([])
  const [value, setValue] = useState<any>([])

  // const fetchMenu = async ({place} : any) => {
  //   console.log(place)
  //   const res = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=` + place+ `&apiKey=Y2rF_WsjbbUAFLC8WHMQGQIP-WkR_BYXZn8Jl44cJSc`);
  //   const data = await res.json();
  //   setSearchedCoordinates(data);
  //   setFetching(true);
  //   console.log(res, data, searchedCoordinates, fetching)
  // };

  const getGeoCode = () => {}

  useLayoutEffect(() => {
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
    };

    function success(pos: { coords: any; }) {
      const crd = pos.coords;
      
      setCoordinates([crd.latitude, crd.longitude])
    }
    
    function error(err: { code: any; message: any; }) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    
    navigator.geolocation.getCurrentPosition(success, error, options);

  }, [setCoordinates])

  useEffect(() => {
    document.getElementById('input')?.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const place = (document.getElementById('input') as HTMLInputElement)?.value.toString();
        console.log(place)
        
        const res = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=` + place + `&apiKey=Y2rF_WsjbbUAFLC8WHMQGQIP-WkR_BYXZn8Jl44cJSc`);
        const data = await res.json();
        const lat = await data.items[0].position.lat;
        const lng = await data.items[0].position.lng;
        setFetched(true)
        setData(data)
        console.log(data, lat, lng)
      }
      else{
        setValue((document.getElementById('input') as HTMLInputElement)?.value)
      }
    })
    if (fetched) {
      setCoordinates([Data.items[0].position.lat, Data.items[0].position.lng])
      console.log(coordinates)
    }
  },[fetched])
  return (
    <main className="relative max-w-screen text-white">
      <Input id="input" className="w-[30vw] rounded-full bg-[#5E5E5E]/75 border-none text-xl font-bold backdrop-blur-md absolute z-[99] top-5 left-5"/>
      <Map coordinates={coordinates} />
    </main>
  );
}
