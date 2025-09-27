import React from "react";
import Container from "../../CommonComponents/Container/Container.tsx";
import { shopByCategory } from "../../../libs/lib.ts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { icons } from "../../../helpers/IconsProvider.tsx";
// @ts-ignore
import "swiper/css";
//@ts-ignore
import "swiper/css/navigation";

const ShopCategory = () => {
  return (
    <div className="py-4!">
      <Container>
        <div className="grid justify-center">
          <h1 className="heading1 text-gray-900">Shop with Categorys</h1>
        </div>
        {/* slide category */}
        <div className="py-10! relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={18}
            slidesPerView={6}
            grabCursor={true}
            navigation={{
              nextEl: ".next",
              prevEl: ".prev",
            }}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {shopByCategory?.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="border border-gray-100 w-full py-6! px-3! rounded-[4px] flex flex-col items-center gap-x-[18px] shadow">
                  <img src={item.image} alt={item.name} />
                  <p className="body-medium-500 text-gray-900 mt-2!">
                    {item.name}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* arrow button */}
          <span className="prev w-12 h-12 bg-primary-500 rounded-full z-2  cursor-pointer  absolute top-1/2 -translate-y-1/2  -left-6  text-center leading-[51px] ">
            <span className="text-gray-00">{icons.arrowLeft}</span>
          </span>
          <span className="next w-12 h-12 bg-primary-500 rounded-full z-2 cursor-pointer  absolute top-1/2 -translate-y-1/2  -right-6 text-center leading-[51px]">
            <span className="text-gray-00">{icons.arrowRight}</span>
          </span>
        </div>
      </Container>
    </div>
  );
};

export default React.memo(ShopCategory) || ShopCategory;
