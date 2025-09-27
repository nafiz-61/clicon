import React from "react";
import Container from "../../CommonComponents/Container/Container.tsx";
import { assets } from "../../../helpers/AssetProvider.tsx";
import { icons } from "../../../helpers/IconsProvider.tsx";
import Search from "../../CommonComponents/Search/Search.tsx";

const Menu = () => {
  return (
    <div className="bg-secondary-700 py-4! border-t border-gray-500">
      <Container>
        <div className="grid grid-cols-3 items-center">
          <img src={assets.mainlogo} alt={assets.mainlogo} />

          {/* -- Search -------- */}
          <Search className="relative">
            <input
              name="search"
              type="search"
              placeholder="Search for anything..."
              className="body-small-400 text-gray-500 bg-gray-00 outline-none rounded-[2px] w-full py-[12px]! px-5! pr-9!"
            />
            <span className=" text-2xl text-gray-900 absolute right-4 top-2.5 cursor-pointer placeholder:body-small-400">
              {icons.search}
            </span>
          </Search>
          {/* -- Search -------- */}

          {/* cart wishlist and account */}
          <div className="flex  items-center justify-end">
            <div className="flex items-center gap-x-6">
              <span className="relative text-2xl text-gray-00 cursor-pointer">
                {icons.cart}
                <span className="absolute -top-2 -right-2 body-tiny-600 bg-gray-00 text-secondary-700 rounded-full px-1.5! py-0.5!">
                  2
                </span>
              </span>
              <span className="text-2xl text-gray-00 cursor-pointer">
                {icons.heart}
              </span>
              <span className="text-3xl text-gray-00 cursor-pointer">
                {icons.user}
              </span>
            </div>
          </div>
          {/* cart wishlist and account */}
        </div>
      </Container>
    </div>
  );
};

export default React.memo(Menu) || Menu;
