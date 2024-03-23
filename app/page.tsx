'use client'
import { Input } from "@/components/ui/input";
import { Layers, Search } from "lucide-react";
import { useEffect, useLayoutEffect, useState, } from "react";
import { DM_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Map = dynamic(() => import('@/components/map'), { ssr: false });

const mainFont = DM_Sans({ subsets: ['latin'], weight: ['400'] });

export default function Home() {
  const [coordinates, setCoordinates] = useState<any>([])
  const [fetched, setFetched] = useState(false)
  const [Data, setData] = useState<any>([])
  const [value, setValue] = useState<any>([])
  const [suggestData, setSuggestData] = useState<any>([]);
  const [layerType, setLayerType] = useState<any>('OpenStreetMap')
  const [layerMode, setLayerMode] = useState<any>('dark')

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

        const res = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=` + place + `&apiKey=oJawmOVpYcJE0LK4Gr1nHMJjZDVPgS5CJ7i-ThpuxKA`);
        const data = await res.json();
        const lat = await data.items[0].position.lat;
        const lng = await data.items[0].position.lng;
        setFetched(true)
        setData(data)
      }
    })
    if (fetched) {
      setCoordinates([Data.items[0].position.lat, Data.items[0].position.lng])
      setFetched(false)
    }
  }, [fetched])

  useEffect(() => {
    const getSuggestions = (async () => {
      const res = await fetch(`https://autosuggest.search.hereapi.com/v1/autosuggest?at=` + coordinates[0] + `,` + coordinates[1] + `&limit=5&lang=en&q=` + value + `&apiKey=oJawmOVpYcJE0LK4Gr1nHMJjZDVPgS5CJ7i-ThpuxKA`)
      const data = await res.json();
      const filteredData = data.items.filter((item: any) => item.resultType === "administrativeArea" || item.resultType === 'locality');
      setSuggestData(filteredData)
    }
    );

    if (value.length !== 0) {
      getSuggestions();
    } else {
      setSuggestData([])
    }

  }, [value])

  function changeTheMap(data: any) {
    setSuggestData([]);
    setValue([])
    setCoordinates([data.position.lat,data.position.lng]);
  }

  const onLayerClick = (layer : string, mode : string) => {
    setLayerType(layer)
    setLayerMode(mode)
  }

  return (
    <main className={mainFont.className + " relative max-w-screen text-neutral-900"}>
      <div className="absolute z-[99999] top-5 left-5 flex gap-5 items-center">
        <div className={cn("w-[30vw] rounded-full border-none text-xl font-semibold backdrop-blur overflow-hidden flex gap-5 items-center pl-2 pr-5", layerMode === 'dark' ? 'bg-neutral-300/80 text-neutral-900' : 'bg-neutral-700/80 text-neutral-100')}>
          <Input id="input" className={cn("bg-transparent border-none rounded-full text-xl")} onChange={e => setValue(e.target.value)} value={value} />
          <Search className={cn(layerMode === 'dark' ? 'text-neutral-900' : 'text-neutral-100')} />
        </div>
        <div className={cn("rounded-full text-xl font-medium backdrop-blur p-2", layerMode === 'dark' ? 'bg-neutral-300/80' : 'bg-neutral-700/80')}>
          <DropdownMenu>
            <DropdownMenuTrigger className={cn("z-[99999] border-none outline-none flex items-center", layerMode === 'dark' ? 'text-neutral-900' : 'text-neutral-100')}>
              <Layers />
            </DropdownMenuTrigger>
            <DropdownMenuContent className={cn("z-[99999] border-none outline-none mt-5 backdrop-blur", layerMode === 'dark' ? 'text-neutral-900 bg-neutral-300/80' : 'text-neutral-100 bg-neutral-700/80')}>
              <DropdownMenuLabel>Choose the layer you prefer:</DropdownMenuLabel>
              <DropdownMenuSeparator className={cn(layerMode === 'dark' ? "bg-neutral-800" : "bg-neutral-200")} />
              <DropdownMenuItem>
                <button onClick={() => onLayerClick('OpenStreetMap', 'light')}>
                  OpenStreetMap Light
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={() => onLayerClick('OpenStreetMap', 'dark')}>
                  OpenStreetMap Dark
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={() => onLayerClick('HERE', 'light')}>
                  HERE Maps Light
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={() => onLayerClick('HERE', 'dark')}>
                  HERE Maps Dark
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className={cn(suggestData.length !== 0  ? "absolute top-20 z-[99999] flex flex-col gap-2 left-5 backdrop-blur w-[30vw] rounded-xl p-5" : 'hidden', layerMode === 'dark' ? 'bg-neutral-300/80 text-neutral-900' : 'bg-neutral-700/80 text-neutral-100')}>
        {suggestData.map((data: any, id: number) => {
          return (
            <div key={id} role="button" onClick={e => changeTheMap(data)}>
              <h1 className="text-xl font-medium">
                {data.title}
              </h1>
              <p className="flex gap-2">
                <span>
                  {data.resultType === "administrativeArea" && data.administrativeAreaType}
                  {data.resultType === "locality" && data.localityType}
                </span>
                <span>
                  ({data.position.lat}, {data.position.lng})
                </span>
              </p>
            </div>
          )
        })}
      </div>
      <Map coordinates={coordinates} layer={layerType} mode={layerMode}/>
    </main>
  );
}