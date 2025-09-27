import React from "react";
import Container from "../../CommonComponents/Container/Container";
import Button from "../../CommonComponents/Button/Button";
import { icons } from "../../../helpers/IconsProvider";
import { assets } from "../../../helpers/AssetProvider";

const NewProduct: React.FC = () => {
  return (
    <div className="py-12!">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 ">
          <div className="bg-gray-50 rounded-[4px]">
            <div className="grid grid-cols-2 items-center gap-x-10 p-11! ">
              {/* text and button */}
              <div className="flex flex-col items-start gap-y-2 max-w-[280px]">
                <span className="body-small-600 text-gray-00 px-3! py-[6px]! bg-secondary-500 rounded cursor-pointer">
                  INTRODUCING
                </span>
                <h1 className="heading1 text-gray-900 mb-1!">
                  New Apple Homepod Mini
                </h1>
                <p className="body-medium-400 text-gray-700">
                  Jam-packed with innovation, HomePod mini delivers
                  unexpectedly.
                </p>
                <Button className=" bg-primary-500 px-6! py-1! rounded cursor-pointer mt-3! hover:bg-gray-900 transition-colors">
                  <div className="grid auto-cols-max grid-flow-col items-center gap-x-3">
                    <span className="heading4 text-gray-00">SHOP NOW</span>
                    <span className="text-gray-00 ">{icons.btnArrow}</span>
                  </div>
                </Button>
              </div>
              {/* NewProductLeft Image  */}
              <div>
                <img
                  src={assets.NewProductLeft}
                  alt="NewProductLeft"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side  */}
          <div>
            <div className="w-full h-full relative">
              <img
                src={assets.NewProductRight}
                alt="NewProductRight"
                className="w-full h-full object-cover rounded-[4px]"
              />
              {/* text and button */}
              <div className="absolute top-20 left-11">
                <div className="max-w-[280px] flex flex-col gap-y-2 items-start">
                  <span className="body-small-600 text-gray-900 px-3! py-[6px]! bg-warning-400 rounded cursor-pointer">
                    INTRODUCING NEW
                  </span>
                  <h1 className="heading1 text-gray-00 mb-1!">
                    Xiaomi Mi 11 Ultra 12GB+256GB
                  </h1>
                  <p className="body-medium-400 text-gray-300">
                    *Data provided by internal laboratories. Industry
                    measurment.
                  </p>
                  <Button className=" bg-primary-500 px-6! py-1! rounded cursor-pointer mt-3! hover:bg-warning-500 transition-colors">
                    <div className="grid auto-cols-max grid-flow-col items-center gap-x-3">
                      <span className="heading4 text-gray-00">SHOP NOW</span>
                      <span className="text-gray-00 ">{icons.btnArrow}</span>
                    </div>
                  </Button>
                </div>
              </div>
              {/*  Price Badge */}
              <div className="absolute top-6 right-6 w-22 h-22 bg-secondary-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer">
                <span className="body-xl-600 text-gray-00">$590</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default React.memo(NewProduct) || NewProduct;
