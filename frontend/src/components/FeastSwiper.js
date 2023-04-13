// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { nthNumber } from '../utils/utils';

// Import Swiper styles
import 'swiper/css';

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
        768: {
          slidesPerView: 3,
          spaceBetween: 50,
        }
      }}
    >
      {feasts.map(feast => {
        const date = new Date(feast.date);
        const weekday = date.toLocaleDateString('en-us', { weekday: 'long' });
        const month = date.toLocaleDateString('en-us', { month: 'long' });
        const day = date.toLocaleDateString('en-us', { day: 'numeric' });

        return (
          <SwiperSlide key={`feast-${feast.pk}`}>
            <div className="swiper-slide-content p-3">
              <h3 className="fs-4 text-center">
                <Link href={feast.urlname}>{feast.name}</Link> 
              </h3>
              <p className="mb-1 text-secondary text-center">{weekday}, {month} {day}{nthNumber(day)}</p>
              {feast.cocktails && (
                  <div className="swiper-slide-cocktails p-2">
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


{/* 
  <ul>
      {feasts.map(feast => (
          <li key={`feast-${feast.pk}`}>
              <p className="mb-0">
                  <Link href={`/feasts/${feast.slug}/`}>{feast.name}</Link> - {feast.date}</p>
              {feast.cocktails && (
                  <ul>
                      {feast.cocktails.map(cocktail => (
                          <li key={`cocktail-${cocktail.pk}`}>
                              {cocktail.name}
                          </li>
                      ))}
                  </ul>
              )}
          </li>
      ))}
  </ul> 
*/}
