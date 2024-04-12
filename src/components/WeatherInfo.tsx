import { fetchCurrentWeather } from "@/app/lib/weatherData";
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
  const weather = currentWeather.weather[0];

  return (
    <div className="z-50 absolute flex items-center">
      {temp}°C {weather.description}
      <Image
        alt="weather-icon"
        width={50}
        height={50}
        src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
      ></Image>
      <p>{city || currentWeather.name}</p>
    </div>
  );
}
