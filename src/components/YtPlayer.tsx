'use client';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  defaultList,
  sunnyList,
  rainyList,
  winterSnowList,
  njwmxList,
} from '../app/lib/playList';
import getTitleByVideoIndex from '../app/utils/getTitleByIndex';
import Image from 'next/image';
import book from '../img/book.png';
import EN from '../img/영어.png';
import KO from '../img/한글.png';
import KOREA from '../img/한국.png';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const images = [
  'https://i.gifer.com/6vIk.gif',
  'https://i.gifer.com/xK.gif',
  'https://i.gifer.com/YQgT.gif',
  'https://i.gifer.com/PPy.gif',
  'https://i.gifer.com/GVue.gif',
  'https://i.gifer.com/2swA.gif',
  'https://i.gifer.com/Mf08.gif',
  'https://i.gifer.com/Xgd3.gif',
  'https://i.gifer.com/6OmH.gif',
];

const MySwal = withReactContent(Swal);

export default function YtPlayer() {
  const [videoTitle, setVideoTitle] = useState('');
  const [currentPlayList, setCurrentPlayList] = useState(defaultList);
  const [ytPlayer, setYtPlayer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [issPlayListChanged, setIsPlayListChanged] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(images[0]);
  const [previousImageIndex, setPreviousImageIndex] = useState(0);
  const [consecutiveSameImageCount, setConsecutiveSameImageCount] = useState(0);
  const [isBookClicked, setIsBookClicked] = useState(false);
  const [isKoreanImageClicked, setIsKoreanImageClicked] = useState(false);
  useEffect(() => {
    showNotification();
  }, []);

  const showNotification = () => {
    Swal.fire({
      text: 'Hey If you are new to Elementalsky, why not give the heart a click? 😊',
      timer: 3000,
      timerProgressBar: true,
      toast: true,

      showConfirmButton: false,
      background: '#C5BFB1',
    });
  };

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
    const handleKeyDown = (event) => {
      if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
        handleRandomImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  let playList = defaultList.map((item) => item.videoId);
  let player;

  useEffect(() => {
    loadYT();
  }, []);

  const pickPlayList = (value) => {
    if (value === 'rain') {
      ytPlayer?.cuePlaylist(rainyList.map((item) => item.videoId));
      setCurrentPlayList(rainyList);
    } else if (value === 'storm') {
      ytPlayer?.cuePlaylist(sunnyList.map((item) => item.videoId));
      setCurrentPlayList(sunnyList);
    } else if (value === 'snow') {
      ytPlayer?.cuePlaylist(winterSnowList.map((item) => item.videoId));
      setCurrentPlayList(winterSnowList);
    } else if (value === 'clear') {
      ytPlayer?.cuePlaylist(defaultList.map((item) => item.videoId));
      setCurrentPlayList(defaultList);
    } else if (value === 'njwmxList') {
      ytPlayer?.cuePlaylist(njwmxList.map((item) => item.videoId));
      setCurrentPlayList(njwmxList);
    }

    setVideoTitle('');
    setIsPlaying(false);
  };

  const changeVolume = (volume) => {
    if (player) {
      player.setVolume(volume);
      updateVolumeBar();
    }
  };

  const updateVolumeBar = () => {
    const volumeBar = document.getElementById('volume-bar');
    if (volumeBar) {
      volumeBar.style.width = `${player.getVolume()}%`;
    }
  };

  const loadYT = () => {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player('ytplayer', {
        height: '360',
        width: '640',
        playerVars: {
          controls: 0,
          enablejsapi: 1,
          autoplay: 1,
          loop: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
      setYtPlayer(player);
    };
  };

  function onPlayerReady(event) {
    document.addEventListener('keydown', function (event) {
      if (event.code == 'ArrowRight') {
        player?.nextVideo();
      }
      if (event.code == 'ArrowLeft') {
        player?.previousVideo();
      }

      if (event.code === 'ArrowUp') {
        changeVolume(player?.getVolume() + 10);
      }
      if (event.code === 'ArrowDown') {
        changeVolume(player?.getVolume() - 10);
      }
    });
    event.target.playVideo();
    player?.cuePlaylist(playList);
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      setCurrentIndex(player.getPlaylistIndex());
      setIsPlayListChanged((prev) => !prev);
    }
  }

  useEffect(() => {
    changeTitle();
  }, [issPlayListChanged]);

  const changeTitle = () => {
    const title = getTitleByVideoIndex(currentPlayList, currentIndex);
    setVideoTitle(title);
  };

  const toggleBookClick = () => {
    setIsBookClicked((prev) => !prev);
  };

  const toggleKoreanImage = () => {
    setIsBookClicked(true);
    setIsKoreanImageClicked((prev) => !prev);
  };

  const closeENImage = () => {
    setIsBookClicked(false);
  };

  return (
    <>
      <div className="pointer-events-none ">
        <div id="ytplayer"></div>
      </div>
      <div
        className="absolute z-60 bottom-20 left-0 "
        style={{ zIndex: 10 }}
      ></div>
      <div
        className="absolute z-60 bottom-0 left-0 mb-5"
        style={{ zIndex: 10 }}
      >
        <span className="flex items-center">
          <select
            onChange={(e) => pickPlayList(e.target.value)}
            className="appearance-none bg-transparent border-none w-12 text-xl outline-none ml-2"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
            }}
          >
            <option value="rain">🌧️</option>
            <option value="storm">⛈</option>
            <option value="snow">❄︎</option>
            <option value="clear">☀️</option>
            <option value="njwmxList">🐰</option>
          </select>
          <Image
            src="https://staging.cohostcdn.org/attachment/8acfdaa0-1dbe-49e6-8ba5-4a59c429fd17/PROGMAN.exe%20CD.png"
            alt="cd"
            width={50}
            height={50}
            className={clsx('-ml-9', { 'animate-spin': isPlaying === true })}
          ></Image>
        </span>
        <button
          className="ml-2"
          onClick={() => {
            ytPlayer?.playVideo();
            setIsPlaying(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
            />
          </svg>
        </button>

        <button
          className={''}
          onClick={() => {
            ytPlayer?.pauseVideo();
            setIsPlaying(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
            />
          </svg>
        </button>
      </div>
      <div
        className="absolute z-60 bottom-0 left-1/2 transform -translate-x-1/2 mb-5"
        style={{ zIndex: 10 }}
      >
        <p>{videoTitle}</p>
      </div>
      <Image
        alt="zzz"
        src={backgroundImage}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-screen absolute top-0 right-0"
      ></Image>
      <div
        className="absolute z-60 bottom-0 right-0 flex flex-col items-center"
        style={{ zIndex: 10 }}
      >
        <Image
          src={book}
          alt="book"
          width={90}
          height={90}
          className="absolute bottom-20 right-0 z-60 cursor-pointer"
          onClick={toggleBookClick}
        />
        <div className=" bg-400 h-2 w-full mr-10 rounded-full">
          <div
            id="volume-bar"
            className="bg-pink-500 h-full w-full rounded-full"
          ></div>
        </div>
        <p className="text-sm text-black-600 mr-10">
          Control volume up and down
        </p>
      </div>{' '}
      {isBookClicked && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {isKoreanImageClicked ? (
              <Image alt="KO Image" src={KO} width={700} height={500} />
            ) : (
              <Image alt="EN Image" src={EN} width={700} height={500} />
            )}
            <button
              onClick={closeENImage}
              className="absolute top-0 right-0 bg-transparent text-white p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {isBookClicked && (
              <button
                onClick={toggleKoreanImage}
                className="absolute top-0 bg-transparent text-white p-2"
                style={{
                  top: '97%',
                  right: '-55px',
                  transform: 'translateY(-50%)',
                }}
              >
                <Image src={KOREA} width={50} height={50} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
