// import { useEffect } from 'react';

// const initializePlayer = () => {
//   new window.YT.Player('player', {
//     height: '360',
//     width: '640',
//     playerVars: {
//       listType: 'playlist',
//       list: 'PLD3MHnA3bEH-lPyn3I5XCbab-ULH8wn9N',
//       controls: 0,
//     },
//   });
// };

// const YoutubePlayer = () => {
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://www.youtube.com/iframe_api';
//     script.async = true;

//     const onScriptLoad = () => {
//       window.onYouTubeIframeAPIReady = initializePlayer;
//     };

//     script.addEventListener('load', onScriptLoad);

//     document.body.appendChild(script);

//     return () => {
//       script.removeEventListener('load', onScriptLoad);
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <div
//       id="player"
//       style={{ width: '800px', height: '450px', margin: 'auto' }}
//     ></div>
//   );
// };

// export default YoutubePlayer;
