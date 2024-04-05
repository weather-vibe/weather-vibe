// import Link from 'next/link';
// import YoutubePlayer from '../components/YouTubePlayerAPI';

// const IndexPage = () => {
//   return (
//     <div
//       style={{
//         backgroundColor: '#ffffff',
//         minHeight: '100vh',
//         padding: '20px',
//       }}
//     >
//       <h1
//         style={{
//           color: 'black',
//         }}
//       >
//         YOTUBE
//       </h1>
//       <YoutubePlayer />
//       <Link href="/AnotherPage">
//         <div style={{ color: 'black', cursor: 'pointer' }}>
//           다른 페이지로 이동
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default IndexPage;
import React, { useEffect } from 'react';
import Link from 'next/link';

const IndexPage = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;

    const onScriptLoad = () => {
      window.onYouTubeIframeAPIReady = initializePlayer;
    };

    script.addEventListener('load', onScriptLoad);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', onScriptLoad);
      document.body.removeChild(script);
    };
  }, []);

  const initializePlayer = () => {
    new window.YT.Player('player', {
      height: '360',
      width: '640',
      playerVars: {
        listType: 'playlist',
        list: 'PLD3MHnA3bEH-lPyn3I5XCbab-ULH8wn9N',
        controls: 0,
      },
    });
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <h1
        style={{
          color: 'black',
        }}
      >
        YOTUBE
      </h1>
      <div
        id="player"
        style={{ width: '800px', height: '450px', margin: 'auto' }}
      ></div>
      <Link href="/AnotherPage">
        <div style={{ color: 'black', cursor: 'pointer' }}>
          다른 페이지로 이동
        </div>
      </Link>
    </div>
  );
};

export default IndexPage;
