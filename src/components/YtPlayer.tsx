"use client";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  defaultList,
  sunnyList,
  rainyList,
  winterSnowList,
  njwmxList,
} from "../app/lib/playList";
import getTitleByVideoIndex from "../app/utils/getTitleByIndex";
import Image from "next/image";

const images = [
  "https://i.gifer.com/6vIk.gif",
  "https://i.gifer.com/xK.gif",
  "https://i.gifer.com/YQgT.gif",
  "https://i.gifer.com/PPy.gif",
  "https://i.gifer.com/GVue.gif",
  "https://i.gifer.com/2swA.gif",
  "https://i.gifer.com/Mf08.gif",
  "https://i.gifer.com/Xgd3.gif",
  "https://i.gifer.com/6OmH.gif",
];

export default function YtPlayer() {
  const [videoTitle, setVideoTitle] = useState("");
  const [currentPlayList, setCurrentPlayList] = useState(defaultList);
  const [ytPlayer, setYtPlayer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [issPlayListChanged, setIsPlayListChanged] = useState(0);
  const [isPlaying, segIsPlaying] = useState(false);
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
      if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        handleRandomImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  let playList = defaultList.map((item) => item.videoId);
  let player;

  useEffect(() => {
    loadYT();
  }, []);

  const pickPlayList = (value) => {
    if (value === "rain") {
      ytPlayer?.cuePlaylist(rainyList.map((item) => item.videoId));
      setCurrentPlayList(rainyList);
    } else if (value === "storm") {
      ytPlayer?.cuePlaylist(sunnyList.map((item) => item.videoId));
      setCurrentPlayList(sunnyList);
    } else if (value === "snow") {
      ytPlayer?.cuePlaylist(winterSnowList.map((item) => item.videoId));
      setCurrentPlayList(winterSnowList);
    } else if (value === "clear") {
      ytPlayer?.cuePlaylist(defaultList.map((item) => item.videoId));
      setCurrentPlayList(defaultList);
    } else if (value === "njwmxList") {
      ytPlayer?.cuePlaylist(njwmxList.map((item) => item.videoId));
      setCurrentPlayList(njwmxList);
    }

    setVideoTitle("");
    segIsPlaying(false);
  };

  const changeVolume = (volume) => {
    if (player) {
      player.setVolume(volume);
      updateVolumeBar();
    }
  };
  const updateVolumeBar = () => {
    const volumeBar = document.getElementById("volume-bar");
    if (volumeBar) {
      volumeBar.style.width = `${player.getVolume()}%`;
    }
  };

  const loadYT = () => {
    // Load the IFrame Player API code asynchronously.
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player("ytplayer", {
        height: "360",
        width: "640",
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
    console.log("ready");
    document.addEventListener("keydown", function (event) {
      console.log(event.code);
      if (event.code == "ArrowRight") {
        player?.nextVideo();
      }
      if (event.code == "ArrowLeft") {
        player?.previousVideo();
      }

      if (event.code === "ArrowUp") {
        // player?.setVolume(player.getVolume() + 10);
        changeVolume(player?.getVolume() + 10);
      }
      if (event.code === "ArrowDown") {
        // player?.setVolume(player.getVolume() - 10);
        changeVolume(player?.getVolume() - 10);
      }
    });
    event.target.playVideo();
    player?.cuePlaylist(playList);
  }

  function onPlayerStateChange(event) {
    console.log("changed");
    console.log("state", event.data);
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

  return (
    <>
      <div className="pointer-events-none ">
        <div id="ytplayer"></div>
      </div>

      <div className="absolute z-60" style={{ zIndex: 10 }}>
        <p>{videoTitle}</p>
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
          className={clsx({ "animate-spin": isPlaying === true })}
        ></Image>
        <div className=" bg-gray-300 h-2 w-48">
          <div id="volume-bar" className="bg-blue-500 h-full"></div>
        </div>
        <p className=" text-sm text-black-600">
          Press ArrowUp to increase volume and ArrowDown to decrease
        </p>
      </div>
      <Image
        alt="zzz"
        src={backgroundImage}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-screen absolute top-0 right-0"
      ></Image>
    </>
  );
}
