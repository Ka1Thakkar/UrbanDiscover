'use client'
import Map from "@/components/map";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative max-w-screen">
      <input className="bg-white/50 absolute z-[999999] w-[20vw] rounded-full top-10 left-10 focus:outline-none backdrop-blur-sm px-5 py-2" />
      <Map />
    </main>
  );
}
