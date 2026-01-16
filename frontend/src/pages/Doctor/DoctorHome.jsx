import React from 'react'
import DoctorSearch from './Search'
import DoctorListingPage from './DoctorListing'
import BreadCrumbs from '@/components/Breadcums';
import SEOHead from '../../components/SEOHead';

const DoctorHome = () => {


  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    // { label: 'About ASTITVA CLINIC ' },
    { label: 'About Us' }
  ];

  return (
    <div>
      <SEOHead pageType="doctor-listing" />
      <BreadCrumbs headText={"About Shanya Scans & Theranostics"} items={breadcrumbItems} />
      {/* <DoctorSearch /> */}
      <DoctorListingPage />

    </div>
  )
}

export default DoctorHome