"use client";
import React, { useEffect, useState } from "react";
import { defaultList, sunnyList } from "../app/lib/playList";
import getTitleByVideoIndex from "../app/utils/getTitleByIndex";
import { useAtom } from "jotai";
import { weatherDescriptionAtom } from "../app/atom";

export default function YtPlayer() {
  const [videoTitle, setVideoTitle] = useState("");
  const [currentWeather] = useAtom(weatherDescriptionAtom);
  let playList = defaultList.map((item) => item.videoId);
  var player;

  const pickPlaylist = (currentWeather) => {
    console.log("vvv", currentWeather.weather[0].description);
    switch (currentWeather.weather[0].description) {
      case "scattered clouds":
        playList = sunnyList.map((item) => item.videoId);
        console.log("playlist", playList);
        player.stopVideo();
        break;

      default:
        break;
    }
  };
  useEffect(() => {
    loadYT();
  }, []);

  useEffect(() => {
    if (player) {
      pickPlaylist(currentWeather);
    }
  }, [currentWeather]);

  const loadYT = () => {
    // Load the IFrame Player API code asynchronously.
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function () {
      console.log("neww");
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
    };
    function onPlayerReady(event) {
      event.target.playVideo();
      player.cuePlaylist(playList);
    }
    document.addEventListener("keydown", function (event) {
      console.log(event.code);
      if (event.code == "KeyZ") {
        player?.playVideo();
      }
      if (event.code == "KeyX") {
        player?.pauseVideo();
      }
      if (event.code == "ArrowRight") {
        player?.nextVideo();
      }
      if (event.code == "ArrowLeft") {
        player?.previousVideo();
      }
    });

    function onPlayerStateChange(event) {
      console.log("state", event.data);
      if (event.data === YT.PlayerState.PLAYING) {
        const currentIndex = player.getPlaylistIndex();
        const title = getTitleByVideoIndex(defaultList, currentIndex);
        setVideoTitle(title);
      }
      if (event.data === YT.PlayerState.ENDED) {
      }
    }
  };

  return (
    <div className="pointer-events-none ">
      <div id="ytplayer"></div>
      <p className="absolute z-60 bottom-20">{videoTitle}</p>
    </div>
  );
}
