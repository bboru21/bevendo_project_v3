import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';


export const loginRedirect = () => {

  const router = useRouter();

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const loading = useSelector(state => state.auth.loading);

  if (typeof window !== 'undefined' && !loading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  }
};
