import { useSelector } from 'react-redux';
import Link from 'next/link';

import _ from 'underscore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons';

import Layout from '../../hocs/Layout';
import Heading from '../../components/Heading';
import css from './favorites.module.scss';


const Favorites = () => {

  const user = useSelector(state => state.auth.user);
  const cocktails = _.get(user, 'favorites', []).map(obj => obj['cocktail']);

  const breadcrumbs = [
    { href: '/favorites', text: 'Favorites'},
  ];

  return (
    <Layout
      title='Favorites'
      content='Favorites Page for Bevendo, a companion app to Drinking with the Saints'
      breadcrumbs={breadcrumbs}
    >
      <div className='p-3 p-md-5 bg-light rounded-3 mb-3'>
        <div className='container-fluid py-3'>
          <Heading text={"Favorites"} />
        </div>

        {cocktails.length === 0 ? (
          <div>
          <p>You haven&rsquo;t favorited any cocktails yet!</p>
          <p>To favorite a cocktail, visits its profile page and click the <span className={css.button}><FontAwesomeIcon icon={faThumbsUpRegular} size="2x" /></span> button next to its title.</p>
          </div>
        ) : (
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

export default Favorites;