import Head from 'next/head';
import { Provider } from 'react-redux';
import { useStore } from '../store';

const App = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState);
  return (
      <Provider store={store}>
        <Head>
          <title>Bevendo: A Companion App to Drinking with the Saints</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
            crossOrigin="anonymous"
          ></link>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2"
            crossOrigin="anonymous"
          ></script>
        </Head>
        <Component {...pageProps} />
      </Provider>
  );
}

export default App
