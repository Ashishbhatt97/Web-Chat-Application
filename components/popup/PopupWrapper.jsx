import React from "react";
import { IoClose } from "react-icons/io5";
import Icon from "@/components/Icon";

const PopupWrapper = (props) => {
  return (
    <div
      className=" fixed flex top-0 left-0 z-20 w-full h-full items-center justify-center"
      onClick={props.onHide}
    >
      <div
        className=" w-full h-full absolute glass-effect "
        onClick={props.onHide}
      ></div>

      <div
        className={`flex flex-col w-[660px] max-h-[80%]  relative bg-c2  z-10 rounded-3xl ${
          props.shortHeight ? "" : "min-h-[600px]"
        } `}
      >
        {!props.noHeader && (
          <div className=" p-6 flex items-center justify-between shrink-0">
            <div className="text-lg font-semibold">{props.title || ""}</div>
            <Icon
              size="small"
              icon={<IoClose size={24} />}
              className="right-0"
              onClick={props.onHide}
            />
          </div>
        )}
        <div className="grow flex flex-col p-6 pt-0">{props.children}</div>
      </div>
    </div>
  );
};

export default PopupWrapper;
