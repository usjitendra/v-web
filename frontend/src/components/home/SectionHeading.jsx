import { useEffect, useState } from 'react';

import url_prefix from "../../data/variable";
import { useLanguage } from '../../hooks/useLanguage';


// export default function SectionHeading({ title, subtitle, description, center = false }) {
export default function SectionHeading({ title, page = 'home', detail = 'nav', subtitle = '', description = '', lang = 'EN', center = false, activeTab, setActiveTab, itemNo = 0 }) {
  const [language] = useLanguage();
  const [navbarTabs, setNavbarTabs] = useState(['Not found for the selected language']);


  const [headings, setHeadings] = useState({
    'heading': 'Not Available For Selected Language',
    'subheading': '',
    'description': ''
  });




  useEffect(() => {
    const fetchHeadings = async () => {
      if (!language) return;
      const response = await fetch(`${url_prefix}/api/headings/${title}/${language}`);
      const result = await response.json();
      if (result.success) {
        if (page === 'home') {
          setHeadings(result.data.home[0]);
        } else if (page === 'page') {
          setHeadings(result.data.page[0]);
        } else if (page === 'detailPage') {
          setNavbarTabs(result.data.detailPage.navbar);
          setHeadings(result.data.detailPage.headings[0]);
        }
      }
    };
    fetchHeadings();
  }, [language, title, page]);  // <— Correct dependency array


  if (page == 'home') {
    return (

      <div className={`${center ? 'text-center' : ''} mb-12`}>
        <h2 className="text-3xl md:text-4xl font-bold text-darktext mb-4">
          {headings.heading}
        </h2>
        {headings.subheading && (
          <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3">
            {headings.subheading}
          </h3>
        )}
        {headings.description && (
          <p className="text-lg text-lighttext max-w-3xl mx-auto">
            {headings.description}
          </p>
        )}
      </div>
    );
  };
  if (page == 'page') {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Treatments & Procedures</h1> */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{headings?.heading}</h1>

        <p className="text-gray-600">
          {/* Explore {treatments.length} medical treatments and procedures with advanced filtering options to find the right care for your needs. */}
          {headings.description}
        </p>

      </div>

    );
  }
  if (page === 'detailPage') {
    if (detail === 'nav')
      return (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex space-x-8 border-b overflow-x-auto">
            {navbarTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`pb-4 px-2 font-medium transition-colors ${activeTab === index
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      );
  }
  // if (detail = 'homenav') {
  //   // {console.log(navbarTabs);}
  //   return (
  //     navbarTabs[itemNo]
  //   )
  // }
}
