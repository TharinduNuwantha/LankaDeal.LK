
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Product from './Product'; // Import Product component

import './Styles/styles.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const adsElement = [
  {
    imageUrl: 'https://cdn.pixabay.com/photo/2023/08/08/15/15/strawberries-8177601_1280.jpg',
    title: 'Summer Sale',
    subtitle: 'Up to 70% OFF'
  },
  {
    imageUrl: 'https://cdn.pixabay.com/photo/2017/11/29/13/28/a-discount-2986181_1280.jpg',
    title: 'New Arrivals',
    subtitle: 'Latest Collection'
  },
  {
    imageUrl: 'https://cdn.pixabay.com/photo/2016/03/02/20/13/grocery-1232944_1280.jpg',
    title: 'Free Shipping',
    subtitle: 'On orders over $50'
  },
];

const Ads = () => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (_, time, progress) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty('--progress', 1 - progress);
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  return (
    <div className="w-full">
      {/* Banner Slider */}
      <div className="w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden">
        <Swiper
          spaceBetween={0}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true 
          }}
          navigation
          modules={[Autoplay, Pagination, Navigation]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="mySwiper"
        >
          {adsElement.map((ad, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img
                  src={ad.imageUrl}
                  alt={`ad-${index}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center pl-8 md:pl-16">
                  <div className="text-white">
                    <h3 className="text-2xl md:text-4xl font-bold mb-2">{ad.title}</h3>
                    <p className="text-lg md:text-2xl mb-4">{ad.subtitle}</p>
                    <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          <div className="autoplay-progress" slot="container-end">
            <svg viewBox="0 0 48 48" ref={progressCircle}>
              <circle cx="24" cy="24" r="20" />
            </svg>
            <span ref={progressContent}></span>
          </div>
        </Swiper>
      </div>
      
      {/* Product Section - Displayed below the banner */}
      <div className="mt-8">
        <Product title="Trending Products" rowsCount={1} slidesPerView={3}/>
      </div>
    </div>
  );
};

export default Ads;