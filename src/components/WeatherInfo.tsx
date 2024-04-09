import { fetchCurrentWeather } from "@/app/lib/data";
import convertKelvinToCelsius from "@/app/utils/convertKelvinToCelsius";
import metersToKilometers from "@/app/utils/convertMetersToKilometers";
import Image from "next/image";

export default async function WeatherInfo({
  searchParams,
}: {
  searchParams?: { lat?: string; lon?: string; city?: string };
}) {
  const lat = searchParams?.lat;
  const lon = searchParams?.lon;
  const city = searchParams?.city;
  const currentWeather = await fetchCurrentWeather(lat, lon);
  const temp = convertKelvinToCelsius(currentWeather?.main.temp);
  const visibility = metersToKilometers(currentWeather.visibility);
  const weather = currentWeather.weather[0];
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
