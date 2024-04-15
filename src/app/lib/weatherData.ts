import axios from 'axios';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchCityList(location: string) {
  const locationListApi = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`;
  const { data } = await axios.get(locationListApi);
  return data;
}

export async function fetchCurrentWeather(
  lat: string = '37.5666791',
  lon: string = '126.9782914'
) {
  noStore();
  try {
    const currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`;

    const { data } = await axios.get(currentWeatherApi);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
