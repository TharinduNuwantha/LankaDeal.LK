import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import { Grid, Pagination } from 'swiper/modules';


const productArr = [
    {
        imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNFIe_UOOTOW-MUM5T_LzzEcINK_LDSR4wJA&s',
        price:'5600',
        productTitle:'Mini Power Bank'
    },
        {
        imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNFIe_UOOTOW-MUM5T_LzzEcINK_LDSR4wJA&s',
        price:'5600',
        productTitle:'Mini Power Bank'
    },
        {
        imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNFIe_UOOTOW-MUM5T_LzzEcINK_LDSR4wJA&s',
        price:'5600',
        productTitle:'Mini Power Bank'
    },
        {
        imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNFIe_UOOTOW-MUM5T_LzzEcINK_LDSR4wJA&s',
        price:'5600',
        productTitle:'Mini Power Bank'
    },
        {
        imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNFIe_UOOTOW-MUM5T_LzzEcINK_LDSR4wJA&s',
        price:'5600',
        productTitle:'Mini Power Bank'
    },
        {
        imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNFIe_UOOTOW-MUM5T_LzzEcINK_LDSR4wJA&s',
        price:'5600',
        productTitle:'Mini Power Bank'
    },
        {
        imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNFIe_UOOTOW-MUM5T_LzzEcINK_LDSR4wJA&s',
        price:'5600',
        productTitle:'Mini Power Bank'
    },
        {
        imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNFIe_UOOTOW-MUM5T_LzzEcINK_LDSR4wJA&s',
        price:'5600',
        productTitle:'Mini Power Bank'
    },
        {
        imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNFIe_UOOTOW-MUM5T_LzzEcINK_LDSR4wJA&s',
        price:'5600',
        productTitle:'Mini Power Bank'
    },
]


const Product = ({title,rowsCount,slidesPerView}) => {
  return (
    <section>
      <h1>{title}</h1>
      <Swiper
        slidesPerView={Number(slidesPerView)}
        grid={{
          rows: Number(rowsCount),
        }}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Grid, Pagination]}
 
      >
        {productArr.map(({imageUrl,price,productTitle},index)=>
        <SwiperSlide key={index}>
            <ProductUnit imageUrl={imageUrl} price={price} productTitle={productTitle} id={index}/>
        </SwiperSlide>
        )}

        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>
      </Swiper>
    </section>
  )
}

export default Product

const ProductUnit = ({imageUrl,price,productTitle,id})=>
   <div className='w-full'>
    <img src={imageUrl} alt={`product_unot_${id}`} className='w-full object-contain'/>
    <h3>{productTitle}</h3>
    <h3>Rs.{price}/=</h3>
   </div> 