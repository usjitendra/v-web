import React from 'react';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowRight } from 'react-icons/md';

const ServiceBreadCrumbs = ({ items = [], headText }) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto py-2 px-4">
        <div className="flex items-center text-sm text-gray-600 flex-wrap">
          {items.map((item, index) => (
            <span key={index} className="flex items-center">
              {item.path ? (
                <Link to={item.path} className="hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`${
                    index === items.length - 1
                      ? 'text-[#7e3f8f] font-medium'
                      : ''
                  }`}
                >
                  {item.label}
                </span>
              )}
              {index < items.length - 1 && (
                <MdKeyboardArrowRight className="mx-1" />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceBreadCrumbs;
