import React from "react";

const Icons = ({ size, icon, onClick, className }) => {
  const c =
    size === "small"
      ? "w-8 h-8"
      : size === "medium"
      ? "w-9 h-9"
      : size === "large"
      ? "w-10 h-10"
      : "w-12 h-12";

  return (
    <div
      onClick={onClick}
      className={`rounded-full flex ${className} items-center justify-center hover:bg-c1 cursor-pointer ${c}` }>
   {icon && icon}
    </div>
  );
};

export default Icons;
