"use client";
import React, { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { playListAll, playOption } from "../app/lib/playList";
import getTitleByVideoIndex from "../app/utils/getTitleByIndex";
import Image from "next/image";
import book from "../img/book.png";
import EN from "../img/영어.png";
import KO from "../img/한글.png";
import KOREA from "../img/한국.png";
import Swal from "sweetalert2";

const images = [
  "https://i.gifer.com/6OmH.gif",
  "https://i.gifer.com/6vIk.gif",
  "https://i.gifer.com/PPy.gif",
  "https://i.gifer.com/380e.gif",
  "https://i.gifer.com/NWi5.gif",
  "https://i.gifer.com/2ruN.gif",
  "https://i.gifer.com/TTOl.gif",
  "https://i.gifer.com/IN4R.gif",
  "https://i.gifer.com/g3Ys.gif",
  "https://i.gifer.com/MVOE.gif",
  "https://i.gifer.com/2qQQ.gif",
  "https://i.gifer.com/YmYu.gif",
  "https://i.gifer.com/G6ut.gif",
  "https://i.gifer.com/Y4Qv.gif",
  "https://i.gifer.com/7M1g.gif",
  "https://i.gifer.com/I0Wr.gif",
  "https://i.gifer.com/8qG.gif",
  "https://i.gifer.com/7Tzm.gif",
  "https://i.gifer.com/1gp7.gif",
  "https://i.gifer.com/2A5.gif",
  "https://i.gifer.com/1gPG.gif",
  "https://i.gifer.com/PArT.gif",
  "https://i.gifer.com/5Q06.gif",
  "https://i.gifer.com/6t1D.gif",
  "https://i.gifer.com/Cay5.gif",
  "https://i.gifer.com/K7l7.gif",
  "https://i.gifer.com/7jnE.gif",
  "https://i.gifer.com/AI5S.gif",
  "https://i.gifer.com/90m5.gif",
  "https://i.gifer.com/C6UO.gif",
];
let randomImgIndex = Math.floor(Math.random() * images.length);

export default function YtPlayer() {
  const arrowUpRef = useRef(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [currentPlayList, setCurrentPlayList] = useState(
    playListAll.defaultList
  );
  const [ytPlayer, setYtPlayer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayListChanged, setIsPlayListChanged] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(
    images[randomImgIndex]
  );
  const [isBookClicked, setIsBookClicked] = useState(false);
  const [isKoreanImageClicked, setIsKoreanImageClicked] = useState(false);
  const [currentIcon, setCurrentIcon] = useState("💗");
  const [showIconOption, setShowIconOption] = useState(false);

  useEffect(() => {
    loadYT();
    showNotification();
  }, []);

  useEffect(() => {
    changeTitle();
  }, [isPlayListChanged]);

  const showNotification = () => {
    Swal.fire({
      text: `Hi there, welcome to ElementalSky and enjoy yourself 😊`,
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

  let playList = playListAll.defaultList.map((item) => item.videoId);
  let player: any;

  const pickPlayList = (value: any, icon: any) => {
    ytPlayer?.cuePlaylist(playListAll[value].map((item: any) => item.videoId));
    setCurrentPlayList(playListAll[value]);

    setVideoTitle("");
    setCurrentIcon(icon);
    setShowIconOption(false);
  };

  // const changeVolume = (volume: any) => {
  //   if (player) {
  //     player.setVolume(volume);
  //     updateVolumeBar();
  //   }
  // };

  // const updateVolumeBar = () => {
  //   const volumeBar = document.getElementById("volume-bar");
  //   if (volumeBar) {
  //     volumeBar.style.width = `${player.getVolume()}%`;
  //   }
  // };

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
  console.log("dd", ytPlayer);

  function onPlayerReady() {
    document.addEventListener("keydown", function (event) {
      if (event.code == "ArrowRight") {
        player?.nextVideo();
      }
      if (event.code == "ArrowLeft") {
        player?.previousVideo();
      }

      if (event.code === "ArrowUp") {
        // changeVolume(player?.getVolume() + 10);
        arrowUpRef.current.click();
      }
      if (event.code === "ArrowDown") {
        handleRandomImage();
        // changeVolume(player?.getVolume() - 10);
      }
    });
    player?.cuePlaylist(playList);
    player.setLoop(true);
  }

  function onPlayerStateChange(event: any) {
    if (event.data === YT.PlayerState.PLAYING) {
      setCurrentIndex(player.getPlaylistIndex());
      setIsPlayListChanged((prev) => !prev);
      setIsPlaying(true);
    } else if (event.data === YT.PlayerState.ENDED) {
      player.playVideoAt(0); // 첫 번째 비디오로 돌아가기
    } else {
      setIsPlaying(false);
    }
  }

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
      <Image
        alt="background img"
        src={backgroundImage}
        fill
        sizes="100vw"
        className="absolute top-0 right-0 select-none "
        objectFit="cover"
      ></Image>

      {/* bottom */}
      <div className="fixed z-50 bottom-0 left-0 right-0 ">
        <div className="flex flex-col lg:flex-row items-center px-10 justify-between">
          {/* left side */}
          <div className="flex items-center w-[120px] justify-between ">
            {/* play */}
            <button
              className="ml-1 hover:text-violet-200 text-white active:scale-75 transition duration-300 ease-in-out"
              onClick={() => {
                ytPlayer?.playVideo();
              }}
              style={{ filter: "drop-shadow(0 0 0.2rem white)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8"
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
            {/* pause */}
            <button
              className="hover:text-violet-200 transition duration-300 ease-in-out text-white active:scale-75"
              onClick={() => {
                ytPlayer?.pauseVideo();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8"
                style={{ filter: "drop-shadow(0 0 0.2rem white)" }}
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
            {/* playlist */}
            <div
              onClick={() => setShowIconOption((prev) => !prev)}
              className="relative cursor-pointer hover:-translate-y-1 transition duration-300 ease-in-out"
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
                    className="cursor-pointer hover:bg-blue-200 rounded p-1 w-20 flex items-center justify-center"
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
            className="flex flex-col items-center text-white mb-3"
            style={{ filter: "drop-shadow(0 0 0.2rem green)" }}
          >
            <button
              className="w-[30px] h-[20px] border rounded-md flex items-center justify-center active:text-sm hover:text-violet-200 hover:border-violet-200"
              onClick={() => {
                handleRandomImage();
              }}
              ref={arrowUpRef}
            >
              △
            </button>
            <div className="flex flex-row">
              <button
                className="w-[30px] h-[20px] border rounded-md flex items-center justify-center active:text-sm hover:text-violet-200 hover:border-violet-200"
                onClick={() => ytPlayer?.previousVideo()}
              >
                ◁
              </button>
              <button
                className="w-[30px] h-[20px] border rounded-md flex items-center justify-center active:text-sm hover:text-violet-200 hover:border-violet-200"
                onClick={handleRandomImage}
              >
                ▽
              </button>
              <button
                className="w-[30px] h-[20px] border rounded-md flex items-center justify-center active:text-sm hover:text-violet-200 hover:border-violet-200"
                onClick={() => ytPlayer?.nextVideo()}
              >
                ▷
              </button>
            </div>
          </div>

          {/* guide */}
          {/* <Image
            src={book}
            alt="book"
            width={90}
            height={90}
            className="cursor-pointer"
            onClick={toggleBookClick}
          /> */}
        </div>
      </div>

      {/* <div
        className="absolute z-60 bottom-0 right-0 flex flex-col items-center"
        style={{ zIndex: 10 }}
      >
        <div className=" bg-400 h-2 w-full mr-10 rounded-full mb-2">
          <div
            id="volume-bar"
            className="bg-pink-500 h-full w-full rounded-full"
          ></div>
        </div>
        <p
          className="text-sm text-black-600 mr-10 mb-2"
          style={{ filter: "drop-shadow(0 0 0.2rem white)" }}
        >
          Control volume with ⬆️ ⬇️
        </p>
      </div> */}
      {isBookClicked && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {isKoreanImageClicked ? (
              <Image alt="KO Image" src={KO} width={500} height={400} />
            ) : (
              <Image alt="EN Image" src={EN} width={500} height={400} />
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
                  top: "97%",
                  right: "-55px",
                  transform: "translateY(-50%)",
                }}
              >
                <Image src={KOREA} width={50} height={50} alt="" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
