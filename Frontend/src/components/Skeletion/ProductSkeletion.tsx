import React from "react";

const ProductSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4 ">
      {[...new Array(8)].map((_, i) => (
        <div
          className="!p-4 border border-gray-200 rounded-2xl shadow-md relative animate-pulse"
          key={i}
        >
          {/* Image placeholder */}
          <div className="flex items-center justify-center">
            <div
              className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                          w-[202px] h-[172px] rounded-lg"
            />
          </div>

          <div className="!pt-6 flex flex-col gap-y-3">
            {/* Rating placeholder */}
            <div className="flex items-center gap-x-2 mb-8!">
              <div className="flex gap-x-[2px]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                             w-4 h-4 rounded-sm"
                  />
                ))}
              </div>
              <div
                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                            w-12 h-3 rounded"
              />
            </div>

            {/* Product title */}
            <div
              className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                          h-4 w-32 rounded"
            />

            {/* Product subtitle */}
            <div
              className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                          h-3 w-44 rounded"
            />

            {/* Price placeholder */}
            <div className="flex items-center gap-x-3">
              <div
                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                            h-3 w-14 rounded"
              />
              <div
                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                            h-3 w-16 rounded"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ProductSkeleton);
