'use client';
import { Suspense } from 'react';
import WeatherInfo from '../../components/WeatherInfo';
import { useState, useEffect } from 'react';
import YtPlayer from '../../components/YtPlayer';
import Image from 'next/image';

export default function Page({
  searchParams,
}: {
  searchParams?: { lat?: string; lon?: string; city?: string };
}) {
  const images = [
    'https://i.gifer.com/6vIk.gif',
    'https://i.gifer.com/xK.gif',
    'https://i.gifer.com/YQgT.gif',
    'https://i.gifer.com/PPy.gif',
    'https://i.gifer.com/GVue.gif',
    'https://i.gifer.com/2swA.gif',
    'https://i.gifer.com/Mf08.gif',
    'https://i.gifer.com/Xgd3.gif',
  ];

  const [backgroundImage, setBackgroundImage] = useState(images[0]);
  const [previousImageIndex, setPreviousImageIndex] = useState(0);
  const [consecutiveSameImageCount, setConsecutiveSameImageCount] = useState(0);

  const getRandomImage = () => {
    let randomIndex = Math.floor(Math.random() * images.length);
    while (
      randomIndex === previousImageIndex &&
      consecutiveSameImageCount >= 1
    ) {
      randomIndex = Math.floor(Math.random() * images.length);
    }
    return randomIndex;
  };

  const handleRandomImage = () => {
    let randomIndex = getRandomImage();
    if (randomIndex === previousImageIndex) {
      setConsecutiveSameImageCount((count) => count + 1);
    } else {
      setConsecutiveSameImageCount(0);
    }
    setBackgroundImage(images[randomIndex]);
    setPreviousImageIndex(randomIndex);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
        handleRandomImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <Suspense fallback={<div>!!!</div>}>
        <WeatherInfo searchParams={searchParams}></WeatherInfo>
      </Suspense>
      <Image
        alt="background"
        src={backgroundImage}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        className="z-0"
      />
      <YtPlayer backgroundImage={backgroundImage}></YtPlayer>
      <p className="z-50 absolute">press z to play, x to pause</p>
    </div>
  );
}
