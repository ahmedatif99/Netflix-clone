import Head from "next/head"

import SectionCards from "../../components/card/section-cards.components"
import NavBar from "../../components/navbar/navbar.components"

import { getMyVideosList } from "../../lib/videos";

import styles from '../../styles/MyList.module.css'
import useRedirectUser from "../../utils/redirectUser";

export async function getServerSideProps(context) {
    const { userId, token } = await useRedirectUser(context);
    if(!userId) {
      return {
          props: {},
          redirect: {
              destination: '/login',
              permanent: false,
          },
      }
    } 
    const myListVideos = await getMyVideosList(userId, token);
    return {
      props: { myListVideos },
    };
  }

const MyList = ({ myListVideos = [] }) => {
  return (
    <div>
        <Head>
            <title>My List</title>
        </Head>

        <main className={styles.main}>
            <NavBar />
            <div className={styles.sectionWrapper}>
                <SectionCards
                    title="My List"
                    videos={myListVideos}
                    size="small"
                    shouldWrap={true}
                    shouldScale={false}
                />
            </div>
        </main>
    </div>
  )
}

export default MyList