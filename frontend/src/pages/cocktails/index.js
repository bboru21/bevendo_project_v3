import Layout from '../../hocs/Layout';
import loginRedirect from '../../hooks/loginRedirect';
import Heading from '../../components/Heading';
import Link from 'next/link';
import { performAPIGet } from '../../utils/api';


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
            <ul>
                {cocktails.map( cocktail => (
                  <li key={cocktail.pk}>
                      <Link href={cocktail.urlname} legacyBehavior>
                          <a>{cocktail.name}</a>
                      </Link>
                  </li>
                ))}
            </ul>
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