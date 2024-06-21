import Image from "next/image";
import { Suspense } from "react";
import WeatherInfo from "../components/WeatherInfo";
import YtPlayer from "../components/YtPlayer";

export default function Home({
  searchParams,
}: {
  searchParams?: { lat?: string; lon?: string };
}) {
  return (
    <div className="px-10">
      <Suspense fallback={<div>!!!</div>}>
        <WeatherInfo searchParams={searchParams}></WeatherInfo>
      </Suspense>
      <YtPlayer></YtPlayer>
    </div>
  );
}
