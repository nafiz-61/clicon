import React, { useState } from "react";
import Container from "../../CommonComponents/Container/Container.tsx";
import { icons } from "../../../helpers/IconsProvider.tsx";

const Category = () => {
  const [categoryopen, setCategoryopen] = useState<Boolean>(false);
  const orderItem: { id: number; name: string; icon: React.ReactNode }[] = [
    {
      id: 1,
      name: "Track Order",
      icon: icons.location ?? null,
    },
    {
      id: 2,
      name: "Compare",
      icon: icons.compare ?? null,
    },
    {
      id: 3,
      name: "Customer Support",
      icon: icons.support ?? null,
    },
    {
      id: 4,
      name: "Need Help",
      icon: icons.info ?? null,
    },
  ];
  return (
    <div className="bg-gray-00">
      <Container>
        <div className="py-3! grid grid-cols-2">
          <div className="flex items-center gap-x-6">
            {/* category */}
            <div className="relative inline-block rounded-[2px]">
              <select
                name="category"
                id="category"
                className="body-small-500 bg-gray-50 py-[14px]! pl-6! pr-[40px]!  appearance-none  cursor-pointer outline-none "
                onClick={() => setCategoryopen(!categoryopen)}
              >
                <option
                  className="text-gray-900 bg-gray-50 body-small-500"
                  value="Mobile"
                >
                  All Category
                </option>
                <option
                  className="text-gray-900 bg-gray-50 body-small-500"
                  value="Laptop"
                >
                  Laptop
                </option>
                <option
                  className="text-gray-900 bg-gray-50 body-small-500"
                  value="Tablet"
                >
                  Tablet
                </option>
                <option
                  className="text-gray-900 bg-gray-50 body-small-500"
                  value="Camera"
                >
                  Camera
                </option>
                <option
                  className="text-gray-900 bg-gray-50 body-small-500"
                  value="Accessories"
                >
                  Accessories
                </option>
              </select>

              {/*  Custom arrows */}
              <span className="absolute  top-1/2 -translate-1/2 right-[8px] pointer-events-none">
                {categoryopen ? icons.uparrow : icons.downarrow}
              </span>
            </div>

            {/*  order item */}
            <div className="flex items-center gap-x-6 ">
              {orderItem.map((item) => (
                <div
                  className="group body-small-400 text-gray-600 flex items-center gap-x-[6px] cursor-pointer  transition-colors"
                  key={item.id}
                >
                  <span className="text-xl group-hover:text-warning-500 ">
                    {item.icon}
                  </span>
                  <span className="body-small-400 text-gray-600  group-hover:text-warning-500">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* contact section */}
          <div className="flex items-center gap-x-2 justify-self-end">
            <span className="text-xl cursor-pointer">{icons.telephone}</span>
            <span className="body-large-400 text-gray-900 ">
              +1-202-555-0104
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default React.memo(Category) || Category;
