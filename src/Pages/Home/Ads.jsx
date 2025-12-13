import React, { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import './Styles/styles.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const Ads = () => {
    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };
    return (
        <>
        <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            }}
            pagination={{
            clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            className="mySwiper"
        >
            <SwiperSlide>
                <img src='https://images.squarespace-cdn.com/content/v1/54ec2161e4b01dbc251cbdae/8109841b-663b-476b-beee-e72bd234ee95/best-ideas-For-Successful-Banner-Advertising-30.jpg' className='w-full object-contain'/>
            </SwiperSlide>
                        <SwiperSlide>
                <img src='https://images.squarespace-cdn.com/content/v1/54ec2161e4b01dbc251cbdae/8109841b-663b-476b-beee-e72bd234ee95/best-ideas-For-Successful-Banner-Advertising-30.jpg' className='w-full object-contain'/>
            </SwiperSlide>
                        <SwiperSlide>
                <img src='https://images.squarespace-cdn.com/content/v1/54ec2161e4b01dbc251cbdae/8109841b-663b-476b-beee-e72bd234ee95/best-ideas-For-Successful-Banner-Advertising-30.jpg' className='w-full object-contain'/>
            </SwiperSlide>

            <div className="autoplay-progress" slot="container-end">
            <svg viewBox="0 0 48 48" ref={progressCircle}>
                <circle cx="24" cy="24" r="20"></circle>
            </svg>
            <span ref={progressContent}></span>
            </div>
        </Swiper>
        </>
    );
}

export default Ads
