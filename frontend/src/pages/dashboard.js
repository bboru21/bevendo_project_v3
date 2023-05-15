import { useSelector } from 'react-redux';
import Layout from '../hocs/Layout';
import cookie from 'cookie';
import { API_URL } from '../config/index';
import FeastSwiper from '../components/swipers/FeastSwiper';
import FavoriteSwiper from '../components/swipers/FavoriteSwiper';
import loginRedirect from '../hooks/loginRedirect';
import ExternalLink from '../components/ExternalLink';
import { displayDate } from '../utils/dates';
import { USDollar } from '../utils/currency';
import ProConIcon from '../components/ProConIcon';

const Dashboard = ({ error, feasts, deals, latestPullDate }) => {

    loginRedirect();

    const user = useSelector(state => state.auth.user);

    return (
        <Layout
            title='Bevendo | Dashboard'
            content='Dashboard for Bevendo, a companion app to Drinking with the Saints'
        >
           <div className='p-5 bg-light rounded-3'>
                <div className='container-fluid py-3'>
                    <h1 className='display-5 fw-bold'>
                        User Dashboard
                    </h1>
                    <p className='fs-4 mt-3'>
                        Welcome to Bevendo{user === null ? '' : `, ${user.first_name}`}!
                    </p>
                    {error && (
                        <p className='fs-4 mt-3'>
                            {error}
                        </p>
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

                        <FavoriteSwiper />

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
        const res = await fetch(`${API_URL}/api/v1/pages/dashboard`, {
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