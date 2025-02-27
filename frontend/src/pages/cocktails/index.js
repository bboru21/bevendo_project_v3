import Layout from '../../hocs/Layout';
import loginRedirect from '../../hooks/loginRedirect';
import Heading from '../../components/Heading';
import { performAPIGet } from '../../utils/api';
import Card from '../../components/Card';
import _ from 'underscore';
import {Container, Row, Col} from 'react-bootstrap';
import css from './index.module.scss';
const Cocktails = ({ cocktails, error }) => {

  loginRedirect();

  const breadcrumbs = [
    { href: '/cocktails', text: 'Cocktails'},
  ];

  return (
    <Layout
      title='Cocktails'
      content='Cocktails Page for Bevendo, a companion app to Drinking with the Saints'
      breadcrumbs={breadcrumbs}
    >
      <div className='p-3 p-md-5 bg-light rounded-3 mb-3'>
        <div className='container-fluid py-3'>
          <Heading text={"Cocktails"} />
            {error && (
                <p className='fs-4 mt-3'>
                    {error}
                </p>
            )}
        </div>

        {!error && (
          <>
            <Container>
                <Row>
                {cocktails.map( cocktail => {
                  // const image = _.get(cocktail, 'images[0].medium_url'); // TODO determine why this doesn't work
                  const images = _.get(cocktail, 'images', []);
                  const image = images.length > 0 ? images[0].medium_url : null;
 
                  return (
                    <Col key={cocktail.pk} xs={12} md={6} lg={4} xl={3} className="mb-3">
                        
                        <Card 
                          href={cocktail.urlname} 
                          title={cocktail.name} 
                          image={image}
                          zoom
                          className={css.card}
                        />
                    </Col>
                  );
                })}
                </Row>
            </Container>
          </>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {

  try {

    const res = await performAPIGet('/pages/cocktails', req);

    if (res.status === 200) {
      const data = await res.json();

      return {
        props: {
          cocktails: data.cocktails,
        }
      }
    } else {
      console.error(`API request returned status ${res.status}`);
      return {
        props: {
          error: 'Something went wrong loading page data',
        }
      }
    }

  } catch(error) {
    console.error(error);
    return {
      props: {
        error: 'Something went wrong loading page data',
      }
    };
  }
};

export default Cocktails;