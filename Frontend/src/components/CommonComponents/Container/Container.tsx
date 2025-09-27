import React from "react";
type containerProps = {
  children: React.ReactNode;
};
const Container: React.FC<containerProps> = ({ children }) => {
  return (
    <div className="container " style={{ margin: "0 auto" }}>
      {children}
    </div>
  );
};

export default Container;
