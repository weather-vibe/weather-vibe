import WeatherInfo from "@/components/WeatherInfo";
import { Suspense } from "react";

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
    </div>
  );
}
