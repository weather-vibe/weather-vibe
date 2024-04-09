'use client';

import React, { useEffect, useState } from 'react';
import { defaultList, sunnyList } from '../app/lib/playList';
import getTitleByVideoIndex from '../app/utils/getTitleByIndex';
import { useAtom } from 'jotai';
import { weatherDescriptionAtom } from '../app/atom';

export default function YtPlayer() {
  const [videoTitle, setVideoTitle] = useState('');
  const [currentWeather] = useAtom(weatherDescriptionAtom);
  let playList = defaultList.map((item) => item.videoId);

  const pickPlaylist = () => {
    switch (currentWeather.weather[0].description) {
      case 'clear sky':
        playList = sunnyList.map((item) => item.videoId);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    pickPlaylist();
    loadYT();
  }, []);

  const loadYT = () => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
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
    };

    function onPlayerReady(event) {
      event.target.playVideo();
      player.cuePlaylist(playList);
    }

    document.addEventListener('keydown', function (event) {
      if (event.code === 'KeyZ') {
        player?.playVideo();
      }
      if (event.code === 'KeyX') {
        player?.pauseVideo();
      }
      if (event.code === 'ArrowRight') {
        player?.nextVideo();
      }
      if (event.code === 'ArrowLeft') {
        player?.previousVideo();
      }
    });

    function onPlayerStateChange(event) {
      if (event.data === YT.PlayerState.PLAYING) {
        const currentIndex = player.getPlaylistIndex();
        const title = getTitleByVideoIndex(defaultList, currentIndex);
        setVideoTitle(title);
      }
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
    <div className="pointer-events-none">
      <div id="ytplayer"></div>
      <p className="absolute z-60 bottom-20">{videoTitle}</p>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-300 h-2 w-48">
        <div id="volume-bar" className="bg-blue-500 h-full"></div>
      </div>
      <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm text-black-600">
        Press ArrowUp to increase volume and ArrowDown to decrease
      </p>
    </div>
  );
}
