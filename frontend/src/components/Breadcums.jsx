import React from 'react';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowRight } from 'react-icons/md';

const BreadCrumbs = ({ items, headText }) => {
  return (
    <div className="bg-white py-4 px-6 rounded-lg border border-b-2  ">
      {/* Heading */}
      <h1 className="text-xl font-semibold text-gray-800 mb-2">{headText}</h1>

      {/* Breadcrumb navigation */}
      <nav className="flex items-center text-gray-600 text-sm">
        {items?.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <MdKeyboardArrowRight className="text-gray-500 mx-1" />}
            {item.href ? (
              <Link to={item.href} className="text-blue-600 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-800">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default BreadCrumbs;
