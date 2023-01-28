import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loading from '../components/loading';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

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
