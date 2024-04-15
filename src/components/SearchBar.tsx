'use client';
import { fetchCityList, fetchCurrentWeather } from '@/app/lib/weatherData';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import Suggestion from './Suggestion';
import { Suspense, useState } from 'react';
import { IoLocationOutline } from 'react-icons/io5';

type Props = {};
type CityArray = any[] | null;
export default function SearchBar({}: Props) {
  const searchParams = useSearchParams(); //get current search params
  const pathname = usePathname(); //get current path name
  const { replace } = useRouter();
  const [cityList, setCityList] = useState<CityArray>(null);
  const [location, setLocation] = useState('');
  const params = new URLSearchParams(searchParams);

  const suggestionRequest = useDebouncedCallback(async (location: string) => {
    if (location) {
      const list = await fetchCityList(location);
      setCityList(list);
    } else {
      setCityList(null);
    }
  }, 300);

  const handleInputChange = (location: string) => {
    setLocation(location);
    suggestionRequest(location);
  };

  const onCityClick = (lat: number, lon: number, location: string) => {
    params.set('lat', lat.toString());
    params.set('lon', lon.toString());
    params.set('city', location);

    replace(`${pathname}?${params.toString()}`);
    setLocation(location);
    setCityList(null);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        params.set('lat', latitude.toString());
        params.set('lon', longitude.toString());
        const currentWeather = await fetchCurrentWeather(
          latitude.toString(),
          longitude.toString()
        );
        params.set('city', currentWeather.name);
        replace(`${pathname}?${params.toString()}`);
        console.log(position);
      });
    }
  };

  return (
    <div className="absolute z-50 right-10 ">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="search location.."
          className="px-3 py-2 border border-pink-400 rounded-md focus:outline-none focus:border-green-300"
          onChange={(e) => {
            handleInputChange(e.target.value);
          }}
          value={location}
        ></input>

        <div onClick={getCurrentLocation} className="cursor-pointer">
          <IoLocationOutline />
        </div>
      </div>
      <Suggestion listData={cityList} onCityClick={onCityClick}></Suggestion>
    </div>
  );
}
