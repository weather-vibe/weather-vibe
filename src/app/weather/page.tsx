import WeatherInfo from "@/components/WeatherInfo";
import YtPlayer from "@/components/YtPlayer";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/YtPlayer"),
  { ssr: false }
);

export default async function Page({
  searchParams,
}: {
  searchParams?: { lat?: string; lon?: string; city?: string };
}) {
  return (
    <div>
      <Suspense fallback={<div>!!!</div>}>
        <WeatherInfo searchParams={searchParams}></WeatherInfo>
      </Suspense>

      {/* <DynamicComponentWithNoSSR></DynamicComponentWithNoSSR> */}
      <YtPlayer></YtPlayer>
    </div>
  );
}
