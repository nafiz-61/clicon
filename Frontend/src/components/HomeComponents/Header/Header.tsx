import React from "react";
import Container from "../../CommonComponents/Container/Container";
import { assets } from "../../../helpers/AssetProvider.tsx";
import Button from "../../CommonComponents/Button/Button.tsx";
import { icons } from "../../../helpers/IconsProvider.tsx";
const Header = () => {
  return (
    <>
      <div className="bg-gray-900 py-5!">
        <Container>
          <div className=" grid grid-cols-3">
            <div className="grid auto-cols-max grid-flow-col items-center gap-x-3">
              <img src={assets.headerlogo} alt={assets.headerlogo} />
              <h1 className="heading3 text-gray-00 ml-2">Friday</h1>
            </div>
            <div className="grid auto-cols-max grid-flow-col items-center gap-x-2 justify-center">
              <div className="grid auto-cols-max grid-flow-col items-center gap-x-2">
                <span className="body-small-500 text-gray-00">Up to</span>
                <h2 className="display4 text-warning-500">59%</h2>
                <span className="body-xl-600 text-gray-00">OFF</span>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Button className="bg-warning-500 py-[14px] px-6! cursor-pointer shadow-2xl rounded-[2px]">
                <div className="grid auto-cols-max grid-flow-col items-center gap-x-2">
                  <span className="heading4 text-gray-900">SHOP NOW </span>
                  <span className="text-gray-900 inline-block">
                    {icons.rightarrow}
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default React.memo(Header) || Header;
