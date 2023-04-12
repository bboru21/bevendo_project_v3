// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';

const FeastSwiper = ({ feasts }) => {
  return feasts.length === 0 ? (
    <></>
  ) : (
    <Swiper
      spaceBetween={50}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {feasts.map(feast => {
        const date = new Date(feast.date);
        const weekday = date.toLocaleDateString('en-us', { weekday: 'long' });
        const month = date.toLocaleDateString('en-us', { month: 'long' });
        const day = date.toLocaleDateString('en-us', { day: 'numeric' });

        return (
          <SwiperSlide key={`feast-${feast.pk}`}>
  
            <p className="mb-0">
              <Link href={feast.urlname}>{feast.name}</Link> ({weekday}, {month} {day})
            </p>
            {feast.cocktails && (
                <ul>
                    {feast.cocktails.map(cocktail => (
                        <li key={`cocktail-${cocktail.pk}`}>
                            <Link href={cocktail.urlname}>{cocktail.name}</Link>
                        </li>
                    ))}
                </ul>
            )}
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
