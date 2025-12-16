import React from 'react';
import { FaCode } from 'react-icons/fa';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const WindowHeader = () => {
  return (
    <div className="flex items-center h-7 bg-white  shadow-sm px-4 z-50">
      <div className="flex items-center px-2">
        <div className="flex space-x-1.5">
          <span className="w-2.5 h-2.5 md:w-1.5 md:h-1.5 xl:w-2.5 xl:h-2.5 rounded-full bg-red-500"></span>
          <span className="w-2.5 h-2.5 md:w-1.5 md:h-1.5 xl:w-2.5 xl:h-2.5 rounded-full bg-yellow-400"></span>
          <span className="w-2.5 h-2.5 md:w-1.5 md:h-1.5 xl:w-2.5 xl:h-2.5 rounded-full bg-green-500"></span>
        </div>

      </div>

      <div className="ml-4 flex space-x-2 text-gray-400">
        <HiChevronLeft className="cursor-pointer hover:text-black" />
        <HiChevronRight className="cursor-pointer hover:text-black" />
      </div>
    </div>
  );
};

export default WindowHeader;
