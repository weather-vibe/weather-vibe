import Image from "next/image";
import { Suspense } from "react";
import WeatherInfo from "../components/WeatherInfo";
import YtPlayer from "../components/YtPlayer";
import SearchBar from "@/components/SearchBar";

export default function Home({
  searchParams,
}: {
  searchParams?: { lat?: string; lon?: string };
}) {
  const loading = (
    <div className="w-full h-full bg-black flex items-center justify-center text-white text-lg">
      Loading...
    </div>
  );
  return (
    <Suspense fallback={loading}>
      <div className="px-10">
        <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:items-start">
          <WeatherInfo searchParams={searchParams}></WeatherInfo>
          <SearchBar></SearchBar>
        </div>
        <YtPlayer></YtPlayer>
      </div>
    </Suspense>
  );
}
