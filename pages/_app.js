import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { magic } from '../lib/magic-client';
import Loading from '../components/loading';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(true);

  const checkLogin = async () => {
    const isLoggedIn = await magic.user.isLoggedIn();
    if(isLoggedIn) {
      router.push('/')
    } else {
      router.push('/login')
    }
  }

  useEffect(() => {
    checkLogin()
  }, []);

useEffect(() => {
  const handleComplete = () => {
    setisLoading(false);
  };
  router.events.on('routeChangeComplete', handleComplete);
  router.events.on('routeChangeError', handleComplete);

  return () => {
    router.events.off('routeChangeComplete', handleComplete);
    router.events.off('routeChangeError', handleComplete);
  }
}, [router]);

  return isLoading ? <Loading /> : <Component {...pageProps} />
}

export default MyApp
