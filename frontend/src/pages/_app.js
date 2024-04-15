import { useEffect } from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { useStore } from '../store';
import NextNProgress from 'nextjs-progressbar';
import GoogleAnalyticsTag from '../components/GoogleAnalyticsTag';

// Font Awesome setup
// https://fontawesome.com/docs/web/use-with/react/use-with#next-js
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// custom styles
import "../styles/styles.scss";

import { usePreserveScroll } from '../hooks/usePreserveScroll';

const App = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState);
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);


  usePreserveScroll();

  return (
      <Provider store={store}>
        <NextNProgress />
        {process.env.NODE_ENV === 'production' && <GoogleAnalyticsTag />}
        <Head>
          <title>Bevendo: A Companion App to Drinking with the Saints!</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
        </Head>
        <Component {...pageProps} />
      </Provider>
  );
}

export default App;
