import Image from "next/image";
import React from "react";
const Loader = () => {
  return (
    <div className="flex justify-center items-center w-[100vw] h-[100vh] bg-black">
      <Image src="/Rolling.svg" alt="Loading" height={100} width={100}  priority/>
    </div>
  );
};

export default Loader;
