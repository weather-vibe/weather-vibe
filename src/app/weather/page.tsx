import { Suspense } from "react";
import WeatherInfo from "../../components/WeatherInfo";
import Image from "next/image";
import YtPlayer from "../../components/YtPlayer";
import { useAtom } from "jotai";
import { weatherDescriptionAtom } from "../atom";

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
      <Image
        alt="zzz"
        src="https://i.gifer.com/6OmH.gif"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-screen absolute top-0 right-0 z-0"
      ></Image>
      <YtPlayer></YtPlayer>
      <p className="z-50 absolute">press z to play, x to pause</p>
    </div>
  );
}
