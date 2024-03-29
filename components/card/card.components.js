import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import cls from "classnames";

import styles from "./card.module.css";

const Card = (props) => {
  const {
    id,
    imgUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80",
    size = "medium",
    shouldScale = true
  } = props;
  const [imgSrc, setimgSrc] = useState(imgUrl);

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleOnError = (e) => {
    setimgSrc(
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80"
    );
  };
  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };
  const shouldHover = shouldScale&&{
    ...scale
  }
  return (
    <div className={styles.container}>
      <motion.div
        className={cls(classMap[size], styles.imgMotionWrapper)}
        whileHover={shouldHover}
      >
        <Image
          className={styles.cardImg}
          src={imgSrc}
          onError={handleOnError}
          alt="image"
          fill
        />
      </motion.div>
    </div>
  );
};

export default Card;
