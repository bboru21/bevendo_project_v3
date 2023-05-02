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


const FavoriteSwiper = () => {

  const user = useSelector(state => state.auth.user);
  const cocktails = _.get(user, 'favorites', []).map(obj => obj['cocktail']);

  return cocktails.length === 0 ? (
    <></>
  ) : (
    <>
      <h2 className='display-7 fw-bold mb-3'>
        Favorites
      </h2>
      <Swiper
        onSlideChange={() => { /*...*/ }}
        onSwiper={(swiper) => { /*...*/ }}
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={breakpoints}
        pagination={{ clickable: true }}
        modules={[ Pagination ]}
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
