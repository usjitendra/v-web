import React from 'react';

export default function BiodataApp() {
  const generatePDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 px-4">
      <style>{`
        @media print {
          body { 
            background: white !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print { display: none !important; }
          .print-container { 
            box-shadow: none !important; 
            margin: 0 !important;
            max-width: 100% !important;
          }
          @page {
            margin: 0.5cm;
          }
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden print-container">
        {/* OM Symbol */}
        <div className="text-center py-6 text-6xl text-red-800 font-bold">
          ॐ
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-800 to-red-900 text-white py-8 px-6 text-center border-b-4 border-yellow-700">
          <h1 className="text-5xl font-bold tracking-widest mb-2">BIODATA</h1>
          <p className="text-sm tracking-wider uppercase">For Matrimonial Proposal</p>
        </div>

        {/* Photo Section */}
        {/* <div className="bg-amber-50 py-8 border-b-2 border-yellow-700">
          <div className="w-40 h-48 mx-auto border-4 border-red-800 bg-white flex items-center justify-center">
            <div className="text-center text-gray-500 text-sm px-4">
              Passport Size<br/>Photograph
            </div>
          </div>
        </div> */}

        {/* Content */}
        <div className="p-8">
          {/* Personal Details */}
          <div className="mb-8">
            <h2 className="bg-red-800 text-white py-2 px-4 font-bold uppercase tracking-wider mb-4">
              Personal Details
            </h2>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700 w-2/5">Full Name</td>
                  <td className="py-3 px-4 text-gray-600">Ayush Mishra</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Date of Birth</td>
                  <td className="py-3 px-4 text-gray-600">23rd December, 1999</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Time of Birth</td>
                  <td className="py-3 px-4 text-gray-600">05:45 AM</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Age</td>
                  <td className="py-3 px-4 text-gray-600">25 Years</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Height</td>
                  <td className="py-3 px-4 text-gray-600">169 cm (5 feet 7 inches)</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Complexion</td>
                  <td className="py-3 px-4 text-gray-600">Fair</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Marital Status</td>
                  <td className="py-3 px-4 text-gray-600">Unmarried</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Religious Information */}
          <div className="mb-8">
            <h2 className="bg-red-800 text-white py-2 px-4 font-bold uppercase tracking-wider mb-4">
              Religious Information
            </h2>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700 w-2/5">Religion</td>
                  <td className="py-3 px-4 text-gray-600">Hindu</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Caste</td>
                  <td className="py-3 px-4 text-gray-600">Brahmin</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Gotra</td>
                  <td className="py-3 px-4 text-gray-600">Vatsya</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Manglik Status</td>
                  <td className="py-3 px-4 text-gray-600">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Educational Qualifications */}
          <div className="mb-8">
            <h2 className="bg-red-800 text-white py-2 px-4 font-bold uppercase tracking-wider mb-4">
              Educational Qualifications
            </h2>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700 w-2/5">Graduation</td>
                  <td className="py-3 px-4 text-gray-600">Bachelor of Computer Applications (BCA)</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Post Graduation</td>
                  <td className="py-3 px-4 text-gray-600">Master of Computer Applications (MCA)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Professional Details */}
          <div className="mb-8">
            <h2 className="bg-red-800 text-white py-2 px-4 font-bold uppercase tracking-wider mb-4">
              Professional Details
            </h2>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700 w-2/5">Occupation</td>
                  <td className="py-3 px-4 text-gray-600">Software Developer</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Employment Type</td>
                  <td className="py-3 px-4 text-gray-600">Private Sector</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Family Background */}
          <div className="mb-8">
            <h2 className="bg-red-800 text-white py-2 px-4 font-bold uppercase tracking-wider mb-4">
              Family Background
            </h2>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700 w-2/5">Father's Name</td>
                  <td className="py-3 px-4 text-gray-600">Late Shri Surendra Mishra</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Father's Occupation</td>
                  <td className="py-3 px-4 text-gray-600">Expired</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Mother's Name</td>
                  <td className="py-3 px-4 text-gray-600">Smt. Usha Mishra</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Mother's Occupation</td>
                  <td className="py-3 px-4 text-gray-600">Pensioner</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Siblings</td>
                  <td className="py-3 px-4 text-gray-600">3 Sisters (All Married)</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Family Type</td>
                  <td className="py-3 px-4 text-gray-600">Nuclear Family</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Family Status</td>
                  <td className="py-3 px-4 text-gray-600">Middle Class</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Property & Assets */}
          <div className="mb-8">
            <h2 className="bg-red-800 text-white py-2 px-4 font-bold uppercase tracking-wider mb-4">
              Property & Assets
            </h2>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700 w-2/5">Ancestral Property</td>
                  <td className="py-3 px-4 text-gray-600">Own House & Agricultural Land in Village Balliya</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-700">Additional Property</td>
                  <td className="py-3 px-4 text-gray-600">House in Shivpur, Varanasi, Uttar Pradesh</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="bg-red-800 text-white py-2 px-4 font-bold uppercase tracking-wider mb-4">
              Contact Information
            </h2>
            <div className="bg-amber-50 p-4 border-l-4 border-red-800">
              <p className="mb-2 text-gray-700"><span className="font-semibold">Permanent Address:</span> Village Balliya, Uttar Pradesh</p>
              <p className="mb-2 text-gray-700"><span className="font-semibold">Contact Number:</span> +91 81155 54102</p>
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center no-print">
            <button 
              onClick={generatePDF}
              className="bg-gradient-to-r from-red-800 to-red-900 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wider shadow-lg hover:shadow-xl hover:from-red-900 hover:to-red-950 transition-all duration-300 transform hover:-translate-y-1"
            >
              Download as PDF
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-amber-50 py-6 text-center border-t-2 border-yellow-700 mt-8">
          <p className="italic text-gray-600">
            "We seek a well-educated, cultured girl from a respectable family"
          </p>
        </div>
      </div>
    </div>
  );
}