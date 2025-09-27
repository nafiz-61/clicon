import React from "react";
import { assets } from "../../../helpers/AssetProvider";
import { icons } from "../../../helpers/IconsProvider";
import ProductSkeleton from "../../Skeletion/ProductSkeletion";
import type { productDataType } from "../../../types/ProductTypeData";

type featureProductprop = {
  key: number;
  status: { isPending: boolean; isError: boolean; data: any; error: any };
};

const Product: React.FC<featureProductprop> = ({ status }) => {
  // console.log(status.data);
  if (status.isPending) {
    return <ProductSkeleton />;
  }

  return (
    <div className="h-full grid grid-cols-4 gap-4">
      {status.data?.products.slice(0, 8).map((item: productDataType) => (
        <div className="max-w-[300px] p-4! border border-gray-200  rounded shadow relative">
          <div className="flex items-center justify-center">
            <img
              src={item.images[0] || assets.productOne}
              alt="productOne"
              className="max-w-[202px] max-h-[172px] object-cover"
            />
          </div>

          <div className="pt-6! bg-gray-00 flex flex-col gap-y-2">
            {/* rating */}
            <div className="flex items-center gap-x-1">
              <div className="flex items-center gap-x-[2px]">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <span className="text-primary-500" key={i}>
                    {icons.fullStar}
                  </span>
                ))}
              </div>
              <span className="body-tiny-400 text-gray-500">
                {" "}
                ({item.reviews.length})
              </span>
            </div>
            {/* product details */}
            <h1>{item.title}</h1>
            <p className="body-small-400 text-gray-900  truncate">
              {item.description}
            </p>

            {/* prize */}
            <div className="flex items-center gap-x-1">
              <span className="body-small-400 text-gray-400 delete line-through">
                {" "}
                $99
              </span>
              <span className="body-small-600 text-secondary-500">
                {" "}
                {item.price}
              </span>
            </div>

            {/* offer */}
            <div>
              <p className="absolute top-3 left-3 body-tiny-600 text-gray-00 px-[10px]! py-[5px]! bg-danger-500 rounded cursor-pointer">
                {"HOT"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(Product) || Product;
