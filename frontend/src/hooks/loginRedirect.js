import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const loginRedirect = () => {
  const [calledPush, setCalledPush] = useState(false);

  const router = useRouter();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const loading = useSelector(state => state.auth.loading);

  useEffect(() => {
    if (typeof window !== 'undefined' && !calledPush && !loading) {
      if (!isAuthenticated) {

        const redirect = encodeURIComponent(window.location.pathname);
        setCalledPush(true);
        router.push(`/login?redirect=${redirect}`);
      }
    }
  }, [loading, isAuthenticated]);
};

export default loginRedirect
