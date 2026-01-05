import React from 'react'
import HospitalSearch from './Search'
import HospitalListingPage from './HospitalListing'
import BreadCrumbs from '@/components/Breadcums';

const HospitalHome = () => {


  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    // { label: 'About ASTITVA CLINIC ' },
    { label: 'About Us' }
  ];
  return (
    <div>
      <BreadCrumbs headText={"About Shanya Scans & Theranostics"} items={breadcrumbItems} />
      <HospitalSearch />
      <HospitalListingPage />
    </div>
  )
}

export default HospitalHome