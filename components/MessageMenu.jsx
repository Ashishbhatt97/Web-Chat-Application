import React, { useEffect, useRef } from "react";
import ClickAwayListener from "react-click-away-listener";

export const MessageMenu = ({
  setShowMenu,
  self,
  showMenu,
  showDeletePopHandler,
  setEditMsg,
}) => {
  const ref = useRef();
  useEffect(() => {
    ref.current.scrollIntoViewIfNeeded();
  }, []);





  return (
    <ClickAwayListener onClickAway={() => setShowMenu(false)}>
      <div
        ref={ref}
        className="w-[200px] absolute top-[20px] right-5 bg-c0/[0.5] z-10 overflow-hidden rounded-md "
      >
        <ul className="flex flex-col py-2">
          {self && (
            <li
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                setEditMsg();
              }}
              className="flex flex-col items-center py-3 px-5 hover:bg-black cursor-pointer"
            >
              Edit Message
            </li>
          )}
          <li
            className="flex flex-col items-center py-3 px-5 hover:bg-black cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              showDeletePopHandler(true);
            }}
          >
            Delete Message
          </li>
        </ul>
      </div>
    </ClickAwayListener>
  );
};
