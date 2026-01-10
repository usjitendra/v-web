import React from 'react'
import HospitalSearch from './Search'
import HospitalListingPage from './HospitalListing'
import BreadCrumbs from '@/components/Breadcums';
import SEOHead from '../../components/SEOHead';

const HospitalHome = () => {


  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    // { label: 'About ASTITVA CLINIC ' },
    { label: 'About Us' }
  ];
  return (
    <div>
      <SEOHead pageType="hospital-listing" />
      <BreadCrumbs headText={"About Shanya Scans & Theranostics"} items={breadcrumbItems} />
      <HospitalSearch />
      <HospitalListingPage />
    </div>
  )
}

export default HospitalHome