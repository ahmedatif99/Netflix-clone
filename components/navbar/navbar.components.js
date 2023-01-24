import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import { magic } from "../../lib/magic-client";
import styles from "./navbar.module.css";

const NavBar = () => {
  const router = useRouter();
  const [showDropdown, setshowDropdown] = useState(false);
  const [username, setUsername] = useState('');

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await magic.user.logout();
      // console.log(await magic.user.isLoggedIn());
      router.push('/login')
    } catch (err) {
      console.error(err);
    }
  }

  const getMagicData = async () => {
    try {
      const {email, issuer} = await magic.user.getMetadata();
      const didtoken = await magic.user.getIdToken();
      // console.log({didtoken})
      email && setUsername(email);
    } catch (err) {
      console.error('Error', err);
    }
  }

  useEffect(() => {
    getMagicData();
  }, [username]);
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <a className={styles.logoLink} href="">
          <div className={styles.logoWrapper}>
            <Image
              src={"/static/netflix.svg"}
              alt="Netflix Logo"
              width={"128"}
              height={"34"}
            />
          </div>
        </a>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button
              className={styles.usernameBtn}
              onClick={() => setshowDropdown(!showDropdown)}
            >
              <p className={styles.username}>{username}</p>
              <Image
                src={"/static/expand_more.svg"}
                alt="Expand more"
                width="24"
                height="24"
              />
            </button>
            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <Link className={styles.linkName} onClick={handleSignOut} href="/login">
                    Sign out
                  </Link>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
