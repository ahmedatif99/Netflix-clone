import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import clsx from "classnames"

import NavBar from '../../components/navbar/navbar.components';
import Like from "../../components/icons/like-icon";
import DisLike from "../../components/icons/dislike-icon";

import { getYoutubeVideoById } from '../../lib/videos';

import styles from '../../styles/Video.module.css';

Modal.setAppElement("#__next")

export async function getStaticProps(context) {
    const videoArray = await getYoutubeVideoById(context.params.videoId)

    return {
        props: {
            video: videoArray.length > 0 ? videoArray[0] : {},
        },
        revalidate: 10,
    }
}

export async function getStaticPaths () {
    const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"]

    const paths = listOfVideos.map((videoId) => ({
        params: { videoId },
    }));

    return { paths, fallback: "blocking" }
}

const Video = ({ video }) => {
    const router = useRouter()
    const videoId = router.query.videoId;

    const [toggleLike, setToggleLike] = useState(false);
    const [toggleDisLike, setToggleDisLike] = useState(false);

    const {
        title,
        publishTime,
        description,
        channelTitle,
        statistics: { viewCount } = { viewCount: 0 },
    } = video;

    const runRatingService = async (favourited) => {
        return await fetch('/api/stats', {
            method: 'POST',
            body: JSON.stringify({
                videoId, 
                favourited,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    const handleToggleDisLike = async () => {
        const val = !toggleDisLike;
        await runRatingService(val ? 0 : 1)
        setToggleDisLike(!toggleDisLike)
        setToggleLike(toggleDisLike)
    }

    const handleToggleLike = async () => {
        const val = !toggleLike;
        await runRatingService(val ? 1 : 0)
        setToggleLike(val)
        setToggleDisLike(toggleLike)
    }

    const videoData = async () => {
        const response = await fetch(`/api/stats?videoId=${videoId}`, {
            method: 'GET',
        });
        const data = await response.json();
        if (data.length > 0) {
            const favourited = data[0].favourited;
            if (favourited === 1) {
              setToggleLike(true);
            } else if (favourited === 0) {
              setToggleDisLike(true);
            }
          }
    }

    useEffect(() => {
        videoData()
    }, []);

  return (
    <div>
        <Head>
            <title>{title}</title>
        </Head>
        <div className={styles.container}>
            <NavBar />
            <Modal
                isOpen={true}
                onRequestClose={()=>{router.back()}}
                contentLabel='Watch the video'
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <iframe 
                    className={styles.videoPlayer}
                    id='ytplayer'
                    type='text/html'
                    width='100%'
                    height='360'
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
                    frameBorder='0'
                ></iframe>

                <div className={styles.likeDislikeBtnWrapper}>
                    <div className={styles.likeBtnWrapper}>
                        <button onClick={handleToggleLike} >
                        <div className={styles.btnWrapper}>
                            <Like selected={toggleLike} />
                        </div>
                        </button>
                    </div>
                    <button onClick={handleToggleDisLike} >
                        <div className={styles.btnWrapper}>
                            <DisLike selected={toggleDisLike} />
                        </div>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.modalBodyContent}>
                        <div className={styles.col1}>
                            <p className={styles.publishTime}>{publishTime}</p>
                            <p className={styles.title}>{title}</p>
                            <p className={styles.description}>{description}</p>
                        </div>
                        <div className={styles.col2}>
                            <p className={clsx(styles.subText, styles.subTextWrapper)}>
                            <span className={styles.textColor}>Cast: </span>
                            <span className={styles.channelTitle}>{channelTitle}</span>
                            </p>
                            <p className={clsx(styles.subText, styles.subTextWrapper)}>
                            <span className={styles.textColor}>View Count: </span>
                            <span className={styles.channelTitle}>{viewCount}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    </div>
    
  )
}

export default Video