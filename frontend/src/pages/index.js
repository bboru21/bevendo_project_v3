import Layout from '../hocs/Layout';

const homePage = () => (
  <Layout
    title='Bevendo | Home'
    content='Home page for Bevendo, a companion app to Drinking with the Saints'
  >
    <div className='p-5 bg-light rounded-3'>
      <div className='container-fluid py-3'>
        <h1 className='display-5 fw-bold'>Home Page</h1>
        <p className='fs-4 mt-3'>
          Welcome to Bevendo, a companion app to <i>Drinking with the Saints</i>!
        </p>
      </div>
    </div>
  </Layout>
);

export default homePage;