import Head from "next/head";

import Banner from "../components/banner/banner.components";
import NavBar from "../components/navbar/navbar.components";
import SectionCards from "../components/card/section-cards.components";

import { getVideos, getPopularVideos, getWatchItAgainVideos } from "../lib/videos";
import useRedirectUser from "../utils/redirectUser";

import styles from "../styles/Home.module.css";

export async function getServerSideProps(context) {
  const { userId, token } = await useRedirectUser(context);

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  const disneyVideos = await getVideos("disney trailer");
  const travelVideos = await getVideos("Travel");
  const productivityVideos = await getVideos("Productivity");
  const popularVideos = await getPopularVideos();
  const bannerVideos = [...disneyVideos, ...travelVideos, ...productivityVideos, ...popularVideos];
  const bannerRandom = await bannerVideos[Math.floor(Math.random() * bannerVideos.length)];
  return {
    props: { disneyVideos, travelVideos, productivityVideos, popularVideos, watchItAgainVideos, bannerRandom },
  };
}

export default function Home({
  disneyVideos,
  travelVideos,
  productivityVideos,
  popularVideos,
  watchItAgainVideos = [],
  bannerRandom = [
    {
      id: "4zH5iYM4wJo", 
      title: "Clifford the red dog", 
      description: "a very cute dog", 
      imgUrl: "/static/clifford.webp"
    },
  ]
}) {
  const id = bannerRandom.id;
  const title = bannerRandom.title.substring(0, bannerRandom.title.indexOf('|'));
  const description = bannerRandom.description.split(/\s+/).slice(0, 6).join(" ");
  const imgUrl = bannerRandom.imgUrl;
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <NavBar username="ahmedatif" />
        <Banner
          videoId={id}
          title={title}
          subTitle={description}
          imgUrl={imgUrl}
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          {watchItAgainVideos.length > 0 ? <SectionCards title="Watch Again" videos={watchItAgainVideos} size="small" /> : null}
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </div>
      {/**
  <NavBar/>
  */}
    </div>
  );
}
