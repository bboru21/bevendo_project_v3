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
        <NextNProgress
          transformCSS={ (css) => {
            css += `
              #nprogress .spinner {
                display: none; /* disabled within _app.js */
              }
            `;
            return <style>{css}</style>
          }}
        />
        {process.env.NODE_ENV === 'production' && <GoogleAnalyticsTag />}
        <Head>
          <title>Bevendo: A Companion App to Drinking with the Saints!</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />

          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        </Head>
        <Component {...pageProps} />
      </Provider>
  );
}

export default App;
