import Head from 'next/head';
import Navbar from '../components/Navbar';

const Layout = ({ title, content, children }) => (
    <>
        <Head>
            <title>{title}</title>
            <meta name='description' content={content} />
        </Head>
        <Navbar />
        <div className='container mt-5'>{children}</div>
    </>
);

Layout.defaultProps = {
    title: 'Bevendo',
    content: 'A companion app to Drinking with the Saints'
};

export default Layout;