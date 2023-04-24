import Layout from '../hocs/Layout';
import Link from 'next/link';

const homePage = () => (
  <Layout
    title='Bevendo | Home'
    content='Home page for Bevendo, a companion app to Drinking with the Saints'
  >
    <div className='p-5 bg-light rounded-3'>
      <div className='container-fluid py-3'>
        <h1 className='display-5 fw-bold'>Home Page</h1>
        <p className='fs-4 mt-3'>
          Welcome to Bevendo, a cocktail app project.
        </p>
        <p className="text-muted">Please <Link href="/login">login</Link> to continue.</p>
      </div>
    </div>
  </Layout>
);

export default homePage;