// next.config.js
module.exports = {
  images: {
    domains: ['staging.cohostcdn.org', 'i.gifer.com', 'openweathermap.org'], // 사용하려는 이미지 호스트의 도메인을 여기에 추가합니다.
  },
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'openweathermap.org',
    },
  ],
};
