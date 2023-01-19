import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

import { magic } from "../lib/magic-client"

import styles from '../styles/login.module.css'

const Login = () => {
  const [userMsg, setuserMsg] = useState('')
  const [email, setemail] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const router = useRouter();

  const handleComplete = () => {
    setisLoading(false);
  };

  const handleEmailChange = (e) => {
    setuserMsg('')
    const email = e.target.value;
    setemail(email);
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault()

    if (email) {
      if (email === 'ahmedahmed1919a@gmail.com') {
        try {
          setisLoading(true)
          const didtoken = await magic.auth.loginWithMagicLink({email})
          if (didtoken) {
            router.push('/')
          }
        } catch(err) {
          console.log(err);
        }

      } else {
        setisLoading(false)
        setuserMsg('Sth went wrong logging in')
      }

    }else {
      setisLoading(false)
      setuserMsg('Enter a valid email address !!')
    } 
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
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
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>

          <input className={styles.emailInput} onChange={handleEmailChange} type='text' placeholder="Email address"/>
          <p className={styles.userMsg}>{userMsg}</p>
          <button className={styles.loginBtn} onClick={handleLoginWithEmail}>{isLoading ? 'Loading...' : 'Sign In'}</button>
        </div>
      </main>
    </div>
  )
}

export default Login