import { useSelector } from 'react-redux';
import _ from 'underscore';

// Import Swiper React components
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { breakpoints } from './constants';
import Card from '../Card';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


const _SESSION_KEY = "favoriteSwiperIndex";


const FavoriteSwiper = () => {

  const user = useSelector(state => state.auth.user);
  const cocktails = _.get(user, 'favorites', []).map(obj => obj['cocktail']);

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

          // const image = _.get(cocktail, 'images[0].medium_url'); // TODO determine why this doesn't work
          const images = _.get(cocktail, 'images', []);
          const image = images.length > 0 ? images[0].medium_url : null;

          return (
            <SwiperSlide key={`favorite-${cocktail.pk}`}>
              <div className="swiper-slide-content p-3">
                <Card href={cocktail.urlname} title={cocktail.name} image={image} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default FavoriteSwiper;
