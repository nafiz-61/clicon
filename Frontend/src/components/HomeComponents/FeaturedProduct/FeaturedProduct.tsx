import React, { useState } from "react";
import Container from "../../CommonComponents/Container/Container";
import { assets } from "../../../helpers/AssetProvider";
import Button from "../../CommonComponents/Button/Button";
import { icons } from "../../../helpers/IconsProvider";
import Product from "../../CommonComponents/Product/Product";
import { useQuery } from "@tanstack/react-query";
import { GetFeatureProduct } from "../../../api/FeatureProduct";
import { getCategoryData } from "../../../api/Category";

const FeaturedProduct: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  /**
   * @description  get features product
   * @returns {isPending , isError , data , error}
   * @version 1.0.0
   */
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["featuresProduct"],
    queryFn: GetFeatureProduct,
  });

  /**
   * @description  get category data
   * @returns {isPending , isError , data , error}
   * @version 1.0.0
   */

  const { data: categoryData } = useQuery({
    queryKey: ["category"],
    queryFn: getCategoryData,
  });

  /**
   * @description handle category
   * @version 1.0.0
   * @param {string}category
   */
  const handleClick = (item: string) => {
    setSelectedCategory(item);
  };

  return (
    <div className="p-[40px]!">
      <Container>
        <div className="grid grid-cols-[1.1fr_4fr]  gap-x-6">
          <div className="grid grid-rows-[auto_1fr] gap-0 ">
            <div className="bg-warning-300 border-t-2 border-r-2 border-l-2 border-solid border-[#000000] rounded-tl-[3px] rounded-tr-[3px]">
              <div className="flex flex-col  items-center gap-y-2 py-8! px-[18px]! ">
                <h2 className="body-small-600 text-danger-600 ">
                  COMPUTER & ACCESSORIES
                </h2>
                <p className="heading1 text-gray-900 mb-1!">32% Discount</p>
                <p className="body-medium-400 text-gray-700 ">
                  For all ellectronics products
                </p>
                <p className="body-small-500 text-gray-900 mt-2!">
                  Offers ends in:
                  <span className="body-small-600 text-gray-900 py-1.5! px-2! bg-gray-00 rounded">
                    ENDS OF CHRISTMAS
                  </span>
                </p>
                <Button className=" bg-primary-500 px-6! py-1! rounded cursor-pointer mt-6! hover:bg-gray-900 transition-colors">
                  <div className="grid auto-cols-max grid-flow-col items-center gap-x-3">
                    <span className="heading4 text-gray-00">SHOP NOW</span>
                    <span className="text-gray-00 ">{icons.btnArrow}</span>
                  </div>
                </Button>
              </div>
            </div>
            <div>
              <img
                src={assets.FeaturedProductLeft}
                alt="FeaturedProductLeft"
                className="w-full h-full object-cover rounded-bl-[3px] rounded-br-[3px]"
              />
            </div>
          </div>
          <div className="grid grid-rows-[0.2fr_4fr]">
            <div className="grid grid-cols-[1fr_4fr] mb-8!">
              <h1 className="heading3 text-gray-900">Featured Products</h1>
              <div className="justify-self-end">
                <div className="flex items-center gap-x-6">
                  <ul className="flex gap-x-4">
                    {categoryData?.slice(0, 7).map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleClick(item)}
                        className="body-small-400 text-gray-600 cursor-pointer customHover hover:body-small-600 hover:text-gray-900 hover:-translate-y-[2px] transition-all capitalize"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="cursor-pointer py-[6px]! bg-gray-00 ">
                    <div className="grid auto-cols-max grid-flow-col items-center gap-x-[8px]">
                      <span className="body-small-600 text-primary-500 ">
                        Browse All Product
                      </span>
                      <span className="text-primary-500">{icons.btnArrow}</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Product
                key={0}
                status={{
                  isPending,
                  isError,
                  data,
                  error,
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default React.memo(FeaturedProduct) || FeaturedProduct;
