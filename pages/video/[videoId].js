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
    const { videoId } = router.query;

    const {
        title,
        publishTime,
        description,
        channelTitle,
        statistics: { viewCount } = { viewCount: 0 },
      } = video;
  return (
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
                    <button>
                      <div className={styles.btnWrapper}>
                        <Like/>
                      </div>
                    </button>
                </div>
                <button>
                    <div className={styles.btnWrapper}>
                        <DisLike />
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
  )
}

export default Video