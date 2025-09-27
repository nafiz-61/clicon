import React from "react";
import { Swiper } from "swiper/react";
import {
  Pagination,
  A11y,
  Autoplay,
  EffectFlip,
  EffectFade,
  EffectCards,
  EffectCoverflow,
} from "swiper/modules";

//@ts-ignore
import "swiper/css";
//@ts-ignore
import "swiper/css/navigation";
//@ts-ignore
import "swiper/css/pagination";

interface sliderProps {
  children: React.ReactNode;
  animationStyle: string;
  PaginationActive: boolean;
  autoplayDelay?: number;
  slidesPerView?: number;
}

const Slider: React.FC<sliderProps> = ({
  children,
  animationStyle,
  PaginationActive,
  autoplayDelay = 4000,
  slidesPerView = 1,
}) => {
  return (
    <div>
      <Swiper
        // install Swiper modules
        modules={[
          A11y,
          Autoplay,
          EffectFlip,
          EffectFade,
          EffectCards,
          EffectCoverflow,
          ...(PaginationActive ? [Pagination] : []),
        ]}
        autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
        effect={animationStyle}
        spaceBetween={50}
        slidesPerView={slidesPerView}
        grabCursor={true}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log("slide change")}
      >
        {children}
      </Swiper>
    </div>
  );
};

export default React.memo(Slider) || Slider;
