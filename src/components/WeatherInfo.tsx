import { fetchCurrentWeather } from "@/app/lib/weatherData";
import convertKelvinToCelsius from "@/app/utils/convertKelvinToCelsius";
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
    <div className="z-50 absolute flex flex-col items-center  lg:flex-row">
      <div className="flex items-center">
        <span
          className="filter drop-shadow-md text-white-500 text-md lg:text-2xl"
          style={{ filter: "drop-shadow(0 0 0.2rem white)" }}
        >
          {temp}°C {weather.description}
        </span>
        <Image
          alt="weather-icon"
          width={50}
          height={50}
          src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
        ></Image>
      </div>
      <p
        className="filter drop-shadow-md text-white-500 text-md lg:text-2xl"
        style={{ filter: "drop-shadow(0 0 0.2rem white)" }}
      >
        {city || currentWeather.name}
      </p>
    </div>
  );
}
