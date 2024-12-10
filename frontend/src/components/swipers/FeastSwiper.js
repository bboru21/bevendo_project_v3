// Import Swiper React components


import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { displayDate } from '../../utils/dates';
import { breakpoints } from './constants';

import _ from 'underscore';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


const _SESSION_KEY = "feastSwiperIndex";


const FeastSwiper = ({ feasts }) => {

  /* store slide index in sessionStorage for better browsing experience */
  const pathname = (typeof window==='undefined') ? 'undefined' : window.location.pathname;

  const handleSlideChange = (swiper) => {
    const data = {};
    data[pathname] = swiper.activeIndex;
    sessionStorage.setItem(_SESSION_KEY, JSON.stringify(data));
  };

  const feastSwiperIndex = typeof sessionStorage !== 'undefined' && JSON.parse(sessionStorage.getItem(_SESSION_KEY) || '{}');
  const initialSlide = _.get(feastSwiperIndex, pathname, 0);

  return feasts.length === 0 ? (
    <></>
  ) : (
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
      {feasts.map(feast => {

        const cocktails = _.get(feast, 'cocktails', []).slice(0,3);
        // TODO add a more link if more than 3 cocktails

        return (
          <SwiperSlide key={`feast-${feast.pk}`}>
            <div className="swiper-slide-content p-3">
              <h3 className="fs-4 text-center ellipsis" title={feast.name}>
                <Link href={feast.urlname}>{feast.name}</Link>
              </h3>
              {feast.date && <p className="mb-1 text-secondary text-center">{displayDate(feast.date)}</p>}
              {feast.cocktails && (
                  <div className="swiper-slide-cocktails p-2 bg-light">
                    <ul>
                        {cocktails.map(cocktail => (
                            <li key={`cocktail-${cocktail.pk}`}>
                                <Link href={cocktail.urlname}>{cocktail.name}</Link>
                            </li>
                        ))}
                    </ul>
                  </div>
              )}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default FeastSwiper;
