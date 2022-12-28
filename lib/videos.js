import videoData from "../data/videos.json";

export const getCommonVideos = async (url) => {
  const YOUTUB_API_KEY = process.env.YOUTUBE_API_KEY;

  try {
    const BASE_URL = "youtube.googleapis.com/youtube/v3";
    const response = await fetch(
      `https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUB_API_KEY}`
    );
    const data = await response.json();
    if (data?.error) {
      console.log("Youtube API error", data.error);
      return [];
    }
    return data?.items?.map((item) => {
      const id = item.id?.videoId || item.id;
      return {
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url,
        id,
      };
    });
  } catch (err) {
    console.error("Sth went wrong with video library ", err);
    return [];
  }
};

export const getVideos = (searchQuery) => {
  const URL = `search?part=snippet&q=${searchQuery}&type=video`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  //   'https://youtube.googleapis.com/youtube/v3/&regionCode=US&key=[YOUR_API_KEY]' \

  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular`;
  return getCommonVideos(URL);
};
