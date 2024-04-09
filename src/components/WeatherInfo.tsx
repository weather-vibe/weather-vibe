"use client";
import { fetchCurrentWeather } from "@/app/lib/weatherData";
import convertKelvinToCelsius from "@/app/utils/convertKelvinToCelsius";
import metersToKilometers from "@/app/utils/convertMetersToKilometers";
import Image from "next/image";
import { useAtom } from "jotai";

import { weatherDescriptionAtom } from "../app/atom";
import { useEffect, useState } from "react";

export default function WeatherInfo({
  searchParams,
}: {
  searchParams?: { lat?: string; lon?: string; city?: string };
}) {
  const lat = searchParams?.lat;
  const lon = searchParams?.lon;
  const city = searchParams?.city;
  const [currentWeather, setCurrentWeather] = useAtom(weatherDescriptionAtom);

  const fetchWeather = async () => {
    const current = await fetchCurrentWeather(lat, lon);
    setCurrentWeather(current);
    console.log("ccc", currentWeather);
  };

  const temp = convertKelvinToCelsius(currentWeather?.main.temp);
  const visibility = metersToKilometers(currentWeather.visibility);
  const weather = currentWeather.weather[0];

  useEffect(() => {
    fetchWeather();
  }, []);
  return (
    <div className="z-50 absolute">
      {temp}°C {weather.description}
      <Image
        alt="weather-icon"
        width={100}
        height={100}
        src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
      ></Image>
      visibility:{visibility}
      city name:{city || currentWeather.name}
    </div>
  );
}
