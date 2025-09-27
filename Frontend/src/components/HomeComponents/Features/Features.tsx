import React, { useState } from "react";
import Container from "../../CommonComponents/Container/Container";
import { assets } from "../../../helpers/AssetProvider";

const Features: React.FC = () => {
  type Features = {
    id: number;
    name: string;
    description: string;
    icon: string;
  };
  const [feature] = useState<Features[]>([
    {
      id: 1,
      name: "FASTED DELIVERY",
      description: "Delivery in 24/H",
      icon: assets.packageImage,
    },
    {
      id: 2,
      name: "24 HOURS RETURN",
      description: "100% money-back guarantee",
      icon: assets.trophy,
    },
    {
      id: 3,
      name: "SECURE PAYMENT",
      description: "Your money is safe",
      icon: assets.creditCard,
    },
    {
      id: 4,
      name: "SUPPORT 24/7",
      description: "Live contact/message",
      icon: assets.headphones,
    },
  ]);
  return (
    <div className="pt-5!">
      <Container>
        <div className="border border-gray-100 !p-8 rounded-[6px] grid grid-cols-4 gap-x-10">
          {feature?.map((item) => (
            <div
              className={
                feature.length == item.id
                  ? "flex items-center gap-x-4 cursor-pointer z-20 "
                  : "flex items-center gap-x-4 border-r border-gray-100 cursor-pointer z-20 "
              }
              key={item.id}
            >
              <img src={item.icon} alt="package" />
              <div className="flex flex-col gap-y-1">
                <h1 className="label3 text-gray-900">{item.name}</h1>
                <p className="body-small-400 text-gray-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default React.memo(Features) || Features;
