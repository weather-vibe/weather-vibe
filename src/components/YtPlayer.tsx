"use client";
import React, { useEffect } from "react";

const loadYT = () => {
  // Load the IFrame Player API code asynchronously.
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
      height: "360",
      width: "640",
      videoId: "M7lc1UVf-VE",
      events: {
        onReady: onPlayerReady,
      },
    });
  }
  function onPlayerReady(event) {
    event.target.playVideo();
  }
};
export default function YtPlayer() {
  useEffect(() => {
    loadYT();
  }, []);
  return <div id="ytplayer"></div>;
}
