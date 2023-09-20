import Layout from '../../hocs/Layout';
import loginRedirect from '../../hooks/loginRedirect';
import Heading from '../../components/Heading';
import Link from 'next/link';
import { performAPIGet } from '../../utils/api';
import { displayDate } from '../../utils/dates';


const Feasts = ({ feasts, error }) => {

  loginRedirect();

  // TODO refactor so parents do not have to be repeated
  const breadcrumbs = [
    { href: '/dashboard', text: 'Dashboard'},
    { href: '/feasts', text: 'Feasts'},
  ];

  return (
    <Layout
      title='Bevendo | Feasts'
      content='Feasts Page for Bevendo, a companion app to Drinking with the Saints'
      breadcrumbs={breadcrumbs}
    >
      <div className='p-3 p-md-5 bg-light rounded-3 mb-3'>
        <div className='container-fluid py-3'>
          <Heading text={"Feasts"} />
            {error && (
                <p className='fs-4 mt-3'>
                    {error}
                </p>
            )}
        </div>

        {!error && (
          <>
            <ul>
                {feasts.map( feast => (
                  <li key={feast.pk}>
                      <Link href={feast.urlname} legacyBehavior>
                          <a>{feast.name}{ feast.date ? ` (${displayDate(feast.date)})` : ''}</a>
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

    const res = await performAPIGet('/pages/feasts', req);

    if (res.status === 200) {
      const data = await res.json();

      return {
        props: {
          feasts: data.feasts,
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

export default Feasts;