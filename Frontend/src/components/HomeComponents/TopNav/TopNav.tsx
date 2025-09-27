import React from "react";
import { useState } from "react";
import Container from "../../CommonComponents/Container/Container";
import { icons } from "../../../helpers/IconsProvider.tsx";

const TopNav = () => {
  const [topNav] = useState([
    icons.twitter,
    icons.facebook,
    icons.pinterest,
    icons.reddit,
    icons.youtube,
    icons.instagram,
  ]);
  return (
    <div className="bg-secondary-700  py-3!">
      <Container>
        <div className="grid grid-cols-2">
          <h1 className="body-small-400 text-gray-00">
            Welcome to Clicon online eCommerce store.
          </h1>
          <div className="grid justify-end">
            <div className="grid auto-cols-max grid-flow-col items-center gap-x-3 body-small-400 text-gray-00">
              Follow us:
              <div className="grid grid-cols-6 gap-x-3">
                {topNav?.map((icons, index) => (
                  <span
                    className="text-lg text-gray-00 cursor-pointer hover:text-warning-400 hover:scale-110 transition-all"
                    key={index}
                  >
                    {icons}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default React.memo(TopNav) || TopNav;
