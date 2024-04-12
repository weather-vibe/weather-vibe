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
import { useAtom } from 'jotai';
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
  const [isPlaying, segIsPlaying] = useState(false);
  const [currentWeather] = useAtom(weatherDescriptionAtom);

  let playList = defaultList.map((item) => item.videoId);

  const pickPlaylist = () => {
    if (
      currentWeather &&
      currentWeather.weather &&
      currentWeather.weather.length > 0
    ) {
      switch (currentWeather.weather[0].description) {
        case 'clear sky':
          playList = sunnyList.map((item) => item.videoId);
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    pickPlaylist();
    loadYT();
  }, []);

  const pickPlayList = (value) => {
    if (ytPlayer) {
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
      segIsPlaying(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadYT();
    }
  }, []);

  const loadYT = () => {
    if (typeof window !== 'undefined') {
      // Load the IFrame Player API code asynchronously.
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      let player;
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
    }
  };

  function onPlayerReady(event) {
    console.log('ready');
    document.addEventListener('keydown', function (event) {
      console.log(event.code);
      if (event.code == 'ArrowRight') {
        ytPlayer?.nextVideo();
      }
      if (event.code == 'ArrowLeft') {
        ytPlayer?.previousVideo();
      }
      if (event.code == 'ArrowDown') {
        ytPlayer?.stopVideo();
        ytPlayer?.cuePlaylist(sunnyList.map((item) => item.videoId));
      }
    });
    event.target.playVideo();
    ytPlayer?.cuePlaylist(playList);
  }

  function onPlayerStateChange(event) {
    console.log('changed');
    console.log('state', event.data);
    if (event.data === YT.PlayerState.PLAYING) {
      const currentIndex = ytPlayer.getPlaylistIndex();
      const title = getTitleByVideoIndex(defaultList, currentIndex);
      setVideoTitle(title);
    }
  }

  const changeVolume = (volume) => {
    if (ytPlayer) {
      ytPlayer.setVolume(volume);
      updateVolumeBar();
    }
  };

  const updateVolumeBar = () => {
    const volumeBar = document.getElementById('volume-bar');
    if (volumeBar) {
      volumeBar.style.width = `${ytPlayer.getVolume()}%`;
    }
  };

  document.addEventListener('keydown', function (event) {
    if (ytPlayer) {
      if (event.code === 'ArrowUp') {
        ytPlayer?.setVolume(ytPlayer.getVolume() + 10);
        changeVolume(ytPlayer?.getVolume() + 10);
      }
      if (event.code === 'ArrowDown') {
        ytPlayer?.setVolume(ytPlayer.getVolume() - 10);
        changeVolume(ytPlayer?.getVolume() - 10);
      }
    }
  });

  useEffect(() => {
    changeTitle();
  }, [issPlayListChanged]);

  const changeTitle = () => {
    if (currentPlayList && currentPlayList.length > 0) {
      const title = getTitleByVideoIndex(currentPlayList, currentIndex);
      setVideoTitle(title);
    }
  };

  return (
    <>
      <div className="pointer-events-none ">
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
          className="bg-pink-200 "
          onClick={() => {
            ytPlayer?.playVideo();
            segIsPlaying(true);
          }}
        >
          play
        </button>
        <button
          className="bg-slate-300"
          onClick={() => {
            ytPlayer?.pauseVideo();
            segIsPlaying(false);
          }}
        >
          pause
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
          className={clsx({ 'animate-spin': isPlaying === true })}
        ></Image>
      </div>
    </>
  );
}
