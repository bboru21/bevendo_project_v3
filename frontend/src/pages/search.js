import Layout from '../hocs/Layout';
import cookie from 'cookie';
import { API_URL } from '../config/index';
import loginRedirect from '../hooks/loginRedirect';
import Heading from '../components/Heading';
import Link from 'next/link';
import { formatSearchLabel } from '../utils/search';
import { title } from '../utils/strings';
import _ from 'underscore';

const Search = ({ error, q, results: resultsProp }) => {

    loginRedirect();

    const results = {};
    resultsProp.forEach( result => {

        if (!(result.type in results)) {
            results[result.type] = [];
        }

        results[result.type].push({ ...result });
    });

    return (
        <Layout
            title='Bevendo | Dashboard'
            content='Search Page for Bevendo, a companion app to Drinking with the Saints'
        >
           <div className='p-3 p-md-5 bg-light rounded-3 mb-3'>
                <div className='container-fluid py-3'>
                    <Heading text={`Search Results for "${q}"`} />
                    {error && (
                        <p className='fs-4 mt-3'>
                            {error}
                        </p>
                    )}
                </div>

                {!error && (
                    <>
                        {Object.keys(results).map( category => (
                            <div key={category}>
                                <h2>{title(category)}s</h2>

                                <ul>
                                    {results[category].map( result => (
                                        <li key={result.value}>
                                            <Link href={result.value} legacyBehavior>
                                                <a>
                                                    {formatSearchLabel(result.label, result.q)}
                                                </a>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </>
                )}
           </div>
        </Layout>
    );
};


export async function getServerSideProps({ req, query }) {

  const cookies = cookie.parse(req.headers.cookie ?? '');
  const access = cookies.access ?? false;

  // this should never happen, but just in case
  if (access === false) {
      return {
          props: {
              error: 'User unauthorized to load page data',
          }
      };
  }

  try {
      const { q } = query;

      const res = await fetch(`${API_URL}/api/v1/search?q=${q}&limit=unlimited`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${access}`,
          },
      });

      if (res.status === 200) {
          const data = await res.json();

          return {
              props: {
                  results: data.results,
                  q,
              }
          };

      } else {
          console.error(`API request returned status ${res.status}`);
          return {
              props: {
                  error: 'Something went wrong loading page data',
                  q,
              }
          };
      }
  } catch(error) {
      console.error(error);
      return {
          props: {
              error: 'Something went wrong loading page data',
          }
      }
  }
}

export default Search;