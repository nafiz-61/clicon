import React from "react";

type props = {
  children: React.ReactNode;
  className: string;
};

const Button: React.FC<props> = ({ children, className }) => {
  return <button className={className}>{children}</button>;
};

export default Button;
