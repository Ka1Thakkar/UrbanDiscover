'use client'
import Map from "@/components/map";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useLayoutEffect, useState, } from "react";
import { Roboto } from "next/font/google";

const mainFont = Roboto({ subsets: ['latin'], weight: ['400'] });

export default function Home() {
  const [coordinates, setCoordinates] = useState<any>([])
  const [fetched, setFetched] = useState(false)
  const [Data, setData] = useState<any>([])
  const [value, setValue] = useState<any>([])
  const [suggestData, setSuggestData] = useState<any>([]);
  const [markers, setMarkers] = useState<any>([])

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

        const res = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=` + place + `&apiKey=3gSXkune0p-YKqCe8cho9flyOW5QeBe3Wj-4CJTqfrQ`);
        const data = await res.json();
        const lat = await data.items[0].position.lat;
        const lng = await data.items[0].position.lng;
        setFetched(true)
        setData(data)
        console.log(data, lat, lng)
      }
    })
    if (fetched) {
      setCoordinates([Data.items[0].position.lat, Data.items[0].position.lng])
      console.log(coordinates)
    }
  }, [fetched])

  useEffect(() => {
    const getSuggestions = (async () => {
      console.log("inside getSuggestions");
      const res = await fetch(`https://autosuggest.search.hereapi.com/v1/autosuggest?at=` + coordinates[0] + `,` + coordinates[1] + `&limit=5&lang=en&q=` + value + `&apiKey=3gSXkune0p-YKqCe8cho9flyOW5QeBe3Wj-4CJTqfrQ`)
      const data = await res.json();
      const filteredData = data.items.filter((item: any) => item.resultType === "administrativeArea" || item.resultType === 'locality');
      setSuggestData(filteredData)
      console.log(suggestData)
    }
    );

    if (value.length !== 0) {
      getSuggestions();
    }

  }, [value])

  //   useEffect(() => {
  //     const getMarkers = (async () => {
  //         console.log("inside getSuggestions");
  //         const res = await fetch(`https://discover.search.hereapi.com/v1/discover?in=cirlce:`+ coordinates[0] + `,` + coordinates[1] + `r=20000&q=historical+monuments&apiKey=3gSXkune0p-YKqCe8cho9flyOW5QeBe3Wj-4CJTqfrQ`)
  //         const data = await res.json();
  //         setMarkers(data)
  //         console.log(Data)
  //       }
  //     );
  //     if(coordinates[0]!==undefined && coordinates[1]!==undefined)
  //     getMarkers();

  // }, [setMarkers])

  function changeTheMap(data: any) {
    console.log(data)
    setSuggestData([]);
    setValue([])
    setCoordinates([data.position.lat,data.position.lng]);
  }

  return (
    <main className={mainFont.className + " relative max-w-screen text-white"}>
      <div className="w-[30vw] rounded-full bg-[#434343]/75 border-none text-xl font-semibold backdrop-blur absolute z-[99] top-5 left-5 overflow-hidden flex gap-5 items-center pl-2 pr-5">
        <Input id="input" className="bg-transparent border-none rounded-full text-xl" onChange={e => setValue(e.target.value)} value={value} />
        <Search />
      </div>
      {suggestData.length !== 0 && (
        <div className="absolute top-20 z-[99] flex flex-col gap-2 left-5 bg-[#434343]/75 backdrop-blur w-[30vw] rounded-xl p-5">
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
      )}
      <Map coordinates={coordinates} />
    </main>
  );
}
