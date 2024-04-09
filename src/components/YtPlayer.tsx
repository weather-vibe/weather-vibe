"use client";
import React, { useEffect } from "react";

export default function YtPlayer() {
  useEffect(() => {
    loadYT();
  }, []);

  const loadYT = () => {
    // Load the IFrame Player API code asynchronously.
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player("ytplayer", {
        height: "360",
        width: "640",
        videoId: "5yx6BWlEVcY",
        playerVars: {
          controls: 0,
          enablejsapi: 1,
          autoplay: 1,
        },
        events: {
          onReady: onPlayerReady,
        },
      });
    };
    function onPlayerReady(event) {
      event.target.playVideo();
    }
    document.addEventListener("keydown", function (event) {
      if (event.code == "KeyZ") {
        player?.playVideo();
      }
      if (event.code == "KeyX") {
        player?.pauseVideo();
      }
    });

    player.cuePlaylist(["4xDzrJKXOOY", "rt1mRnRp79A", "0Fjjjdm2c2g"]);
  };

  return (
    <div className="pointer-events-none ">
      <div id="ytplayer"></div>
    </div>
  );
}
