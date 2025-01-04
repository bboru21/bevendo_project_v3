import { useSelector } from 'react-redux';
import _ from 'underscore';

// Import Swiper React components
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { breakpoints } from './constants';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


const _SESSION_KEY = "favoriteSwiperIndex";


const FavoriteSwiper = () => {

  const user = useSelector(state => state.auth.user);
  const cocktails = _.get(user, 'favorites', []).map(obj => obj['cocktail']);

  console.log("*** cocktails ***", cocktails);

  /* store slide index in sessionStorage for better browsing experience */
  const pathname = (typeof window==='undefined') ? 'undefined' : window.location.pathname;

  const handleSlideChange = (swiper) => {
    const data = {};
    data[pathname] = swiper.activeIndex;
    sessionStorage.setItem(_SESSION_KEY, JSON.stringify(data));
  };

  const favoriteSwiperIndex = typeof sessionStorage !== 'undefined' && JSON.parse(sessionStorage.getItem(_SESSION_KEY) || '{}');
  const initialSlide = _.get(favoriteSwiperIndex, pathname, 0);

  return cocktails.length === 0 ? (
    <></>
  ) : (
    <>
      <h2 className='display-7 fw-bold mb-3'>
        Favorites
      </h2>
      <Swiper
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => { /*...*/ }}
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={breakpoints}
        pagination={{ clickable: true }}
        modules={[ Pagination ]}
        initialSlide={initialSlide}
      >
        {cocktails.map(cocktail => {
          return (
            <SwiperSlide key={`favorite-${cocktail.pk}`}>
              <div className="swiper-slide-content p-3">
                <h3 className="fs-4 text-center">
                  <Link href={cocktail.urlname}>{cocktail.name}</Link>
                </h3>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default FavoriteSwiper;
