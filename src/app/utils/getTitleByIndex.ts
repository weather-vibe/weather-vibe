interface Video {
  videoId: string;
  title: string;
}
export default function getTitleByVideoIndex(
  playList: Array<Video>,
  index: number
): string {
  const temp = playList[index];
  return temp.title;
}
