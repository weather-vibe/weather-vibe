import { Suspense } from "react";
import WeatherInfo from "../../components/WeatherInfo";
import YtPlayer from "../../components/YtPlayer";

export default function Page({
  searchParams,
}: {
  searchParams?: { lat?: string; lon?: string; city?: string };
}) {
  return (
    <div>
      <Suspense fallback={<div>!!!</div>}>
        <WeatherInfo searchParams={searchParams}></WeatherInfo>
      </Suspense>
      <YtPlayer></YtPlayer>
    </div>
  );
}
