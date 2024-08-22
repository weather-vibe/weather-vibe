"use client";
import React, { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { playListAll, playOption } from "../app/lib/playList";
import Image from "next/image";
import Swal from "sweetalert2";
import images from "../app/lib/bgImg";
import pause from "../img/pause.png";
import play from "../img/play.png";
import arrowDown from "../img/arrow-down.png";
import arrowUp from "../img/arrow-top.png";
import arrowLeft from "../img/arrow-left.png";
import arrowRight from "../img/arrow-right.png";

let randomImgIndex = Math.floor(Math.random() * images.length);

export default function YtPlayer() {
  const arrowUpRef = useRef(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [ytPlayer, setYtPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(
    images[randomImgIndex]
  );
  const [currentIcon, setCurrentIcon] = useState("🌙");
  const [showIconOption, setShowIconOption] = useState(false);
  const [showInitialPlayButton, setShowInitialPlayButton] = useState(true);

  useEffect(() => {
    loadYT();
    showNotification();

    const timer = setTimeout(() => {
      setShowInitialPlayButton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const showNotification = () => {
    Swal.fire({
      text: `Hi there, welcome to our space and enjoy yourself 😊`,
      timer: 3000,
      timerProgressBar: true,
      toast: true,

      showConfirmButton: false,
      background: "#C5BFB1",
    });
  };

  const handleRandomImage = () => {
    const previousImgIndex = randomImgIndex;
    randomImgIndex = Math.floor(Math.random() * images.length);
    if (previousImgIndex === randomImgIndex) {
      previousImgIndex === images.length - 1
        ? randomImgIndex--
        : randomImgIndex++;
    }
    setBackgroundImage(images[randomImgIndex]);
  };

  let playList = playListAll.nightList.map((item) => item.videoId);
  let player: any;

  const pickPlayList = (value: any, icon: any) => {
    ytPlayer?.cuePlaylist(playListAll[value].map((item: any) => item.videoId));

    setVideoTitle("");
    setCurrentIcon(icon);
    setShowIconOption(false);

    setTimeout(() => {
      ytPlayer?.playVideoAt(0);
      ytPlayer?.setLoop(true);
    }, 100);
  };

  const loadYT = () => {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player("ytplayer", {
        height: "0",
        width: "0",
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

  function onPlayerReady() {
    document.addEventListener("keydown", function (event) {
      if (event.code == "ArrowRight") {
        player?.nextVideo();
      }
      if (event.code == "ArrowLeft") {
        player?.previousVideo();
      }

      if (event.code === "ArrowUp") {
        handleRandomImage();
      }
      if (event.code === "ArrowDown") {
        handleRandomImage();
        // changeVolume(player?.getVolume() - 10);
      }
    });
    player?.cuePlaylist(playList);
    player?.setLoop(true);
  }

  function onPlayerStateChange(event: any) {
    if (event.data === YT.PlayerState.PLAYING) {
      setVideoTitle(player.getVideoData().title);
      setIsPlaying(true);
    } else if (event.data === YT.PlayerState.ENDED) {
      player.playVideoAt(0); // 첫 번째 비디오로 돌아가기
    } else {
      setIsPlaying(false);
    }
  }

  return (
    <>
      <div className="pointer-events-none ">
        <div id="ytplayer"></div>
      </div>
      <div>
        <Image
          alt="background img"
          src={backgroundImage}
          fill
          sizes="100vw"
          className="absolute top-0 right-0 select-none "
          objectFit="cover"
        ></Image>
      </div>
      {/* line */}
      <div className="bg-[url('../img/lines.jpg')] bg-repeat absolute top-0 right-0 left-0 bottom-0 mix-blend-overlay bg-[length:7px_auto] select-none animate-move-up opacity-20"></div>

      {/* centre play button */}
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          className={`w-[500px] h-[200px] flex items-center justify-center transition-opacity duration-200 ease-in-out select-none focus:outline-none ${
            showInitialPlayButton
              ? "opacity-100"
              : "lg:opacity-0 hover:opacity-100"
          }`}
          onClick={() => {
            isPlaying ? ytPlayer?.pauseVideo() : ytPlayer?.playVideo();
          }}
        >
          {!isPlaying ? (
            <div
              className="hover:text-violet-200 text-white active:scale-75"
              style={{ filter: "drop-shadow(0 0 0.2rem white)" }}
            >
              <Image src={play} alt="play" width={32} height={32} />
            </div>
          ) : (
            <div className="hover:text-violet-200 text-white active:scale-75">
              <Image src={pause} alt="pause" width={32} height={32} />
            </div>
          )}
        </button>
      </div>
      {/* bottom */}
      <div className="fixed z-50 bottom-0 left-0 right-0 ">
        <div className="flex flex-col lg:flex-row items-center px-10 justify-between">
          {/* left side playlist */}
          <div
            onClick={() => setShowIconOption((prev) => !prev)}
            className="relative cursor-pointer hover:-translate-y-1 transition duration-300 ease-in-out lg:ml-5 select-none focus:outline-none"
          >
            <p className="text-2xl">{currentIcon}</p>
            <ul
              className={clsx(
                " rounded p-3 z-60 absolute bottom-10 -left-11 bg-white bg-opacity-50 flex w-70 flex-wrap",
                {
                  hidden: showIconOption === false,
                }
              )}
            >
              {playOption.map((pl, index) => (
                <li
                  key={index}
                  className="cursor-pointer rounded p-1 w-20 flex items-center justify-center hover:text-xl transition-all duration-200 h-[30px]"
                  onClick={() => {
                    pickPlayList(pl.name, pl.icon);
                    setShowIconOption((prev) => !prev);
                  }}
                >
                  {pl.icon}
                </li>
              ))}
            </ul>
          </div>
          {/* center */}
          <div className="flex items-center h-[70px]">
            {/* song title */}
            <p
              style={{
                filter: "drop-shadow(0 0 0.2rem white)",
                color: "white",
              }}
            >
              {videoTitle}
            </p>
            {/* cd */}
            {videoTitle && (
              <Image
                src="https://staging.cohostcdn.org/attachment/8acfdaa0-1dbe-49e6-8ba5-4a59c429fd17/PROGMAN.exe%20CD.png"
                alt="cd"
                width={70}
                height={70}
                className={clsx("", {
                  "animate-spin": isPlaying === true,
                })}
              ></Image>
            )}
          </div>
          {/* right */}
          <div
            className="flex  items-end text-white mb-3"
            style={{ filter: "drop-shadow(0 0 0.2rem green)" }}
          >
            <button onClick={() => ytPlayer?.previousVideo()}>
              <Image src={arrowLeft} alt="arrowLeft" width={32} height={32} />
            </button>
            <div className="flex flex-col  justify-between -mb-1 mx-2">
              <button
                onClick={() => {
                  handleRandomImage();
                }}
                ref={arrowUpRef}
              >
                <Image src={arrowUp} alt="arrowUp" width={32} height={32} />
              </button>

              <button onClick={handleRandomImage}>
                <Image src={arrowDown} alt="arrowDown" width={32} height={32} />
              </button>
            </div>
            <button onClick={() => ytPlayer?.nextVideo()}>
              <Image src={arrowRight} alt="arrowRight" width={32} height={32} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
