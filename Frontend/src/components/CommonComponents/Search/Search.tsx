import React from "react";

type propTypes = {
  children: React.ReactNode;
  className?: string;
};

const Search: React.FC<propTypes> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export default Search;
