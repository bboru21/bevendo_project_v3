import { useSelector } from 'react-redux';
import Layout from '../hocs/Layout';
import FeastSwiper from '../components/swipers/FeastSwiper';
import FavoriteSwiper from '../components/swipers/FavoriteSwiper';
import loginRedirect from '../hooks/loginRedirect';
import ExternalLink from '../components/ExternalLink';
import { displayDate } from '../utils/dates';
import { USDollar } from '../utils/currency';
import ProConIcon from '../components/ProConIcon';
import Heading from '../components/Heading';
import { performAPIGet } from '../utils/api';
import Accordion from 'react-bootstrap/Accordion';
import Link from 'next/link';
// TODO consolidate this
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons';
import favoriteButtonCss from '../components/FavoriteButton.module.scss';
import PriceChartButton from '../components/ingredients/PriceChartButton';
import _ from 'underscore';

const Dashboard = ({ error, feasts, deals, latestPullDate }) => {

    loginRedirect();

    const user = useSelector(state => state.auth.user);
    const favoriteCocktails = _.get(user, 'favorites', []).map(obj => obj['cocktail']);

    return (
        <Layout
            title='Dashboard'
            content='Dashboard for Bevendo, a companion app to Drinking with the Saints'
        >
           <div className='p-3 p-md-5 bg-light rounded-3 mb-3'>
                <div className='container-fluid py-3'>
                    <Heading text="Dashboard" />
                    <p className='fs-4 mt-3'>
                        Welcome to Bevendo{user === null ? '' : `, ${user.first_name}`}!
                    </p>
                    {error ? (
                        <p className='fs-4 mt-3'>
                            {error}
                        </p>
                    ) : (
                        <Accordion>
                                <Accordion.Item eventKey="0">
                                <Accordion.Header>Features</Accordion.Header>
                                <Accordion.Body>
                                    <p>
                                        Bevendo is a web app based on the popular &ldquo;Drinking with the Saints&rdquo; book by Michael P. Foley.
                                        The book is great, but is limited by -- well, being a book!
                                        Here on Bevendo, you can...
                                    </p>
                                    <ul>
                                        <li className="mb-2">Browse or search for nearly any Feast, Cocktail or Ingredient from the book.</li>
                                        <li>
                                            Add your favorites to the dashboard by clicking the thumbs up button on the cocktail page:
                                            <button className={classNames("ms-2", favoriteButtonCss.button)}
                                            onClick={() => {}}
                                            title="Favorite Button"
                                            >
                                            <FontAwesomeIcon icon={faThumbsUpRegular} size="2x" />
                                            </button>
                                        </li>
                                        <li>
                                            View ABC pricing data over time on an ingredient page by clicking the chart button:
                                            <PriceChartButton
                                                className="ms-0 mt-2 ms-md-2 mt-md-0 d-block d-md-inline-block"
                                                type="button"
                                                onClick={() => {}}
                                            />
                                        </li>
                                    </ul>
                                </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                    )}
                </div>

                {!error && (
                    <>
                        {/* TODO move heading into component, use mapStateToProps */}
                        {feasts && (
                            <div className='container-fluid py-3'>
                                <h2 className='display-7 fw-bold mb-3'>
                                    Upcoming Feasts
                                </h2>
                                <FeastSwiper feasts={feasts} />
                            </div>
                        )}

                        <div className='container-fluid py-3'>
                            <h2 className='display-7 fw-bold mb-3'>
                                Favorites
                            </h2>
                            {favoriteCocktails.length === 0 ? (
                                <p>
                                    You don&rsquo;t have any favorite cocktails yet. Why don&rsquo;t you visit the <Link href="/cocktails" >cocktails page</Link> and find one?
                                </p>
                                
                            ) : (
                                <FavoriteSwiper cocktails={favoriteCocktails} />
                            )}
                        </div>

                        {deals && deals.length > 0 && (
                            <div className='container-fluid py-3'>
                                <h2 className='display-7 fw-bold mb-3'>
                                    Weekly Virginia ABC Deals
                                </h2>
                                <p>
                                    Below are this weeks deals for a small number of selected products.
                                    Deals are idenfitied by having a <a href="#best-price-score">Best Price Score*</a> of 70 or better according to their size and price per liter, and are sorted by their discount from the average price per bottle size.
                                    Price information is current as of {displayDate(latestPullDate)} and is compared with data from as early as April 2020.</p>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Product</th>
                                            <th scope="col">
                                                <span className="d-block d-md-none">Price</span>
                                                <span className="d-none d-md-block">Price (Below Avg/Size)</span>
                                            </th>
                                            <th scope="col">

                                                <span className="d-block d-md-none">Sale</span>
                                                <span className="d-none d-md-block">Is On-Sale?</span>
                                            </th>
                                            <th scope="col">
                                                <span className="d-block d-md-none">Best</span>
                                                <span className="d-none d-md-block">Is Best Price?</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {deals.map((deal, i) => (
                                        <tr key={`deal-${i}`}>
                                            <td><ExternalLink href={`${deal.url}?productSize=${deal.product_size}`}>{deal.name} ({deal.size})</ExternalLink></td>
                                            <td>{USDollar.format(deal.current_price)} ({USDollar.format(deal.price_below_average_per_size)})</td>
                                            <td><ProConIcon isPro={deal.is_on_sale} /></td>
                                            <td><ProConIcon isPro={deal.is_best_price} /></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                <p id="best-price-score">* &rdquo;Best Price Score&ldquo; is a calculation which is 30% based on price being below average price per liter, and 70% based on being below the average price for the bottle size.</p>
                            </div>
                        )}
                    </>
                )}
           </div>
        </Layout>
    );
};


export async function getServerSideProps({ req }) {

    try {
        const res = await performAPIGet('/pages/dashboard', req);

        if (res.status === 200) {
            const data = await res.json();

            return {
                props: {
                    feasts: data.feasts,
                    deals: data.deals,
                    latestPullDate: data.latest_pull_date,
                }
            };

        } else {
            console.error(`API request returned status ${res.status}`);
            return {
                props: {
                    error: 'Something went wrong loading page data',
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

export default Dashboard;