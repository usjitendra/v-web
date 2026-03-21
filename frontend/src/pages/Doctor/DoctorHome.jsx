import React from 'react';
import DoctorListingPage from './DoctorListing';
import BreadCrumbs from '@/components/Breadcums';
import SEOHead from '../../components/SEOHead';

const DoctorHome = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Doctors' },
  ];

  return (
    <div>
      <SEOHead pageType="doctor-listing" />
      {/* <BreadCrumbs headText="Find the Right Doctor" items={breadcrumbItems} /> */}
      <DoctorListingPage />
    </div>
  );
};

export default DoctorHome;
