import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import {
  defaultList,
  sunnyList,
  rainyList,
  winterSnowList,
  njwmxList,
} from '../app/lib/playList';
import getTitleByVideoIndex from '../app/utils/getTitleByIndex';
import Image from 'next/image';
import { weatherDescriptionAtom } from '../app/atom';

export default function YtPlayer({
  backgroundImage,
  onPreviousImage,
  onNextImage,
}) {
  const [videoTitle, setVideoTitle] = useState('');
  const [currentPlayList, setCurrentPlayList] = useState(defaultList);
  const [ytPlayer, setYtPlayer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [issPlayListChanged, setIsPlayListChanged] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWeather] = useAtom(weatherDescriptionAtom);

  useEffect(() => {
    pickPlaylist();
    loadYT();
  }, []);

  const pickPlaylist = () => {
    if (currentWeather.weather && currentWeather.weather.length > 0) {
      switch (currentWeather.weather[0].description) {
        case 'clear sky':
          setCurrentPlayList(sunnyList);
          break;
        case 'rain':
          setCurrentPlayList(rainyList);
          break;
        case 'snow':
          setCurrentPlayList(winterSnowList);
          break;
        case 'storm':
          setCurrentPlayList(sunnyList);
          break;
        default:
          setCurrentPlayList(defaultList);
          break;
      }
    } else {
    }
  };

  const loadYT = () => {
    if (typeof document !== 'undefined') {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = function () {
        const player = new YT.Player('ytplayer', {
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
    }
  };

  const onPlayerReady = (event) => {
    event.target.playVideo();
    if (ytPlayer) {
      ytPlayer.cuePlaylist(defaultList.map((item) => item.videoId));
    }
  };

  function onPlayerStateChange(event) {
    console.log('changed');
    console.log('state', event.data);
    if (event.data === YT.PlayerState.PLAYING) {
      setCurrentIndex(player.getPlaylistIndex());
      setIsPlayListChanged((prev) => !prev);
    }
  }

  const pickPlayList = (value) => {
    let selectedList;
    switch (value) {
      case 'rain':
        selectedList = rainyList;
        break;
      case 'storm':
        selectedList = sunnyList;
        break;
      case 'snow':
        selectedList = winterSnowList;
        break;
      case 'clear':
        selectedList = defaultList;
        break;
      case 'njwmxList':
        selectedList = njwmxList;
        break;
      default:
        selectedList = defaultList;
        break;
    }

    if (ytPlayer && selectedList) {
      ytPlayer.cuePlaylist(selectedList.map((item) => item.videoId));
      setCurrentPlayList(selectedList);
    }
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

    setVideoTitle('');
    setIsPlaying(false);
    document.addEventListener('keydown', function (event) {
      if (event.code === 'ArrowUp') {
        player?.setVolume(player.getVolume() + 10);
        changeVolume(player?.getVolume() + 10);
      }
      if (event.code === 'ArrowDown') {
        player?.setVolume(player.getVolume() - 10);
        changeVolume(player?.getVolume() - 10);
      }
    });
  };

  return (
    <>
      <div className="pointer-events-none">
        <div id="ytplayer"></div>
        <p className="absolute z-60 bottom-40">{videoTitle}</p>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-300 h-2 w-48">
          <div id="volume-bar" className="bg-blue-500 h-full"></div>
        </div>
        <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm text-black-600">
          Press ArrowUp to increase volume and ArrowDown to decrease
        </p>
        <button onClick={onPreviousImage}>Previous Image</button>
        <button onClick={onNextImage}>Next Image</button>
      </div>
      <div className="absolute z-60 bottom-10">
        <button
          className="bg-pink-200"
          onClick={() => {
            ytPlayer?.playVideo();
            setIsPlaying(true);
          }}
        >
          Play
        </button>
        <button
          className="bg-slate-300"
          onClick={() => {
            ytPlayer?.pauseVideo();
            setIsPlaying(false);
          }}
        >
          Pause
        </button>
        <select onChange={(e) => pickPlayList(e.target.value)}>
          <option value="rain">⛆</option>
          <option value="storm">⛈</option>
          <option value="snow">❄︎</option>
          <option value="clear">🌞</option>
          <option value="njwmxList">🐰</option>
        </select>
        <Image
          src="https://staging.cohostcdn.org/attachment/8acfdaa0-1dbe-49e6-8ba5-4a59c429fd17/PROGMAN.exe%20CD.png"
          alt="cd"
          width={50}
          height={50}
          className={clsx({ 'animate-spin': isPlaying })}
        />
      </div>
    </>
  );
}
