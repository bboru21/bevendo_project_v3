// Import Swiper React components


import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { displayDate } from '../utils/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


const FeastSwiper = ({ feasts }) => {
  return feasts.length === 0 ? (
    <></>
  ) : (
    <Swiper
      onSlideChange={() => { /*...*/ }}
      onSwiper={(swiper) => { /*...*/ }}
      slidesPerView={1}
      spaceBetween={20}
      breakpoints={{
        576: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 50,
        }
      }}
      pagination={{ clickable: true }}
      modules={[ Pagination ]}
    >
      {feasts.map(feast => {

        return (
          <SwiperSlide key={`feast-${feast.pk}`}>
            <div className="swiper-slide-content p-3">
              <h3 className="fs-4 text-center">
                <Link href={feast.urlname}>{feast.name}</Link>
              </h3>
              <p className="mb-1 text-secondary text-center">{displayDate(feast.date)}</p>
              {feast.cocktails && (
                  <div className="swiper-slide-cocktails p-2 bg-light">
                    <ul>
                        {feast.cocktails.map(cocktail => (
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
