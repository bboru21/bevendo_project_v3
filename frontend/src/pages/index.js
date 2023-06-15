import { useSelector } from 'react-redux';
import Layout from '../hocs/Layout';
import Link from 'next/link';
import Heading from '../components/Heading';

const HomePage = () => {

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <Layout
      title='Bevendo | Home'
      content='Home page for Bevendo, a companion app to Drinking with the Saints'
    >
      <div className='p-3 p-md-5 bg-light rounded-3'>
        <div className='container-fluid py-3'>
          <Heading text="Home Page" />
          <p className='fs-4 mt-3'>
            Welcome to Bevendo, a cocktail app project.
          </p>
          {!isAuthenticated && (
            <p className="text-muted">Please <Link href="/login">login</Link> to continue.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;