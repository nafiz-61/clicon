import React, { useState } from "react";
import Container from "../../CommonComponents/Container/Container";
import { assets } from "../../../helpers/AssetProvider";
import Slider from "../../CommonComponents/Slider/Slider";
import { icons } from "../../../helpers/IconsProvider";
import Button from "../../CommonComponents/Button/Button";
import { SwiperSlide } from "swiper/react";

const Banner = () => {
  type bannerType = {
    id: number;
    name: string;
    image: string;
  };
  const [bannerList] = useState<bannerType[]>([
    {
      id: 1,
      image: assets.bannerleft,
      name: "Xbox Consoles",
    },
    {
      id: 2,
      image: assets.bannerleft,
      name: "Xbox Consoles",
    },

    {
      id: 3,
      image: assets.bannerleft,
      name: "Xbox Consoles",
    },
  ]);
  return (
    <div className="py-6!">
      <Container>
        <div className="grid grid-cols-[2fr_1fr] gap-x-6 ">
          <div className="rounded  w-[1000px] h-[615px] relative">
            <Slider
              animationStyle="slide"
              PaginationActive={true}
              autoplayDelay={4000}
            >
              {bannerList?.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="relative w-full h-full">
                    <img
                      src={item.image ?? assets.bannerleft}
                      alt={item.name}
                      className="w-[1000px] h-[615px]  object-cover rounded"
                    />
                    {/*  Text & Button */}
                    <div className="absolute top-[150px] left-[56px] flex flex-col items-start gap-y-2">
                      <h2 className="body-small-600 text-secondary-600 pl-6! tagline">
                        THE BEST PLACE TO PLAY
                      </h2>
                      <h1 className="display3 text-gray-900">Xbox Consoles</h1>
                      <p className="body-large-400 text-gray-700 max-w-[345px] mt-2!">
                        Save up to 50% on select Xbox games. Get 3 months of PC
                        Game Pass for $2 USD.
                      </p>
                      <Button className=" bg-primary-500 px-8! py-1! rounded cursor-pointer mt-4! hover:bg-warning-500 transition-colors">
                        <div className="grid auto-cols-max grid-flow-col items-center gap-x-3">
                          <span className="heading4 text-gray-00">
                            SHOP NOW
                          </span>
                          <span className="text-gray-00 ">
                            {icons.btnArrow}
                          </span>
                        </div>
                      </Button>
                    </div>

                    {/*  Price Badge */}
                    <div className="absolute top-[56px] right-[54px] w-25 h-25 bg-secondary-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-[22px] text-gray-00 font-semibold font-public-sans">
                        $299
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Slider>
          </div>

          {/*  Right Side Banners */}
          <div className="grid grid-rows-2 justify-items-stretch gap-y-6 ">
            <div className=" rounded w-[500px] h-[250px] relative">
              <Slider
                animationStyle="cards"
                PaginationActive={false}
                autoplayDelay={3500}
              >
                {bannerList?.map(() => (
                  <SwiperSlide>
                    <img
                      src={assets.bannerRigthUp}
                      alt="BannerRightOne"
                      className="w-full h-full object-cover rounded"
                    />

                    <div className="absolute top-[46px] left-[40px] flex flex-col items-start text-gray-00">
                      <h1 className="label3 text-warning-500 mb-[5px]!">
                        Summer Sales
                      </h1>
                      <p className="heading3 text-gray-00 w-[160px]">
                        New Google Pixel 6 Pro
                      </p>
                      <Button className=" bg-primary-500 px-6! py-1! rounded cursor-pointer mt-[18px]!   hover:bg-warning-500 transition-colors">
                        <div className="grid auto-cols-max grid-flow-col items-center gap-x-3">
                          <span className="heading4 text-gray-00">
                            SHOP NOW
                          </span>
                          <span className="text-gray-00 ">
                            {icons.btnArrow}
                          </span>
                        </div>
                      </Button>
                    </div>
                    <div className="absolute top-6 right-6  px-4! py-2! bg-warning-400 rounded">
                      <p className="body-medium-600 text-gray-900">29% OFF</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Slider>
            </div>
            <div className="rounded w-[500px] h-[250px]">
              <Slider
                animationStyle="overflow"
                PaginationActive={false}
                autoplayDelay={3000}
              >
                {bannerList?.map(() => (
                  <SwiperSlide>
                    <img
                      src={assets.bannerRightDown}
                      alt="BannerRightTwo"
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute top-[40px] right-[40px] flex flex-col items-start gap-y-3">
                      <h1 className="heading3 text-gray-900 w-[172px]">
                        Xiaomi FlipBuds Pro
                      </h1>
                      <p className="body-large-600 text-secondary-500">
                        $299 USD
                      </p>
                      <Button className=" bg-primary-500 px-6! py-1! rounded cursor-pointer mt-[8px]!   hover:bg-warning-500 transition-colors">
                        <div className="grid auto-cols-max grid-flow-col items-center gap-x-3">
                          <span className="heading4 text-gray-00">
                            SHOP NOW
                          </span>
                          <span className="text-gray-00 ">
                            {icons.btnArrow}
                          </span>
                        </div>
                      </Button>
                    </div>
                  </SwiperSlide>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default React.memo(Banner) || Banner;
