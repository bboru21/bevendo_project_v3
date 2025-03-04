import Layout from '../hocs/Layout';

export default function Custom404() {
    return (
        <Layout title='404' content='Page not found'>
            <div className='bg-light p-5 mt-5 mb-5'>
                <h1>404 - Page Not Found</h1>
                <p>Whoops, looks like we can&rsquo;t find what you&rsquo;re looking for.</p>
            </div>
        </Layout>
    );
}
