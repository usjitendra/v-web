import { Route, Routes } from "react-router-dom";
import AboutUs from './components/admin/AdminAbout';
import AddPatient from './components/admin/AdminAddPatient';
import Bookings from "./components/admin/AdminAppointments";
import AdminDashboard from './components/admin/AdminDashboard';
import AdminDoctors from './components/admin/AdminDoctors';
import AdminDoctorTreatment from './components/admin/AdminDoctorTreatment';
import AdminFaqs from './components/admin/AdminFAQ';
import Headings from "./components/admin/AdminHeadings";
import AdminHospitalDetails from './components/admin/AdminHospitalDetails';
import AdminHospitals from './components/admin/AdminHospitals';
import AdminHospitalTreatment from './components/admin/AdminHospitalTreatment';
import Languages from "./components/admin/AdminLanguageManagement";
import AdminLogin from './components/admin/AdminLogin';
import User from "./components/admin/AdminPassword";
import PatientManagement from './components/admin/AdminPatient';
import AdminPatientOpinions from './components/admin/AdminPatientOpinions';
import AdminProcedures from './components/admin/AdminProcedures';
import AdminTreatment from './components/admin/AdminTreatment';
import Footer from "./components/Footer";
import Header from "./components/Header";
import About from "./pages/About";
import Appointment from "./pages/Appointment";
import BookingFlow from "./pages/BookingFlow";
import Contact from "./pages/Contact";
import DoctorDetails from "./pages/DoctorDetails";



import PatientDashboardp from './components/patient/PatientDashboard';
import PatientLogin from './components/patient/PatientLogin';
import PatientRegister from './components/patient/PatientRegister';

import AdminBlogManagement from './components/admin/AdminBlog';

import Doctors from "./pages/Doctors";
import Home from "./pages/Home";
import HospitalDetails from "./pages/HospitalDetails";
import Hospitals from "./pages/Hospitals"; // ✅ Import Hospitals page
import PatientDashboard from './pages/PatientDashboard';
import TreatmentDetails from "./pages/TreatmentDetails";
import Treatments from "./pages/Treatments";


// Add these imports
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Add these routes to your router configuration
export default function App() {
  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      <Header />
      <main className="flex-grow  mt-2 pt-14">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/hospitals" element={<Hospitals />} />{" "}
          <Route path="/hospitals/:id" element={<HospitalDetails />} />
          {/* ✅ New route */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/hospitals/:id" element={<HospitalDetails />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />
          <Route path="/hospitals/:hospitalId/book" element={<BookingFlow />} />
          <Route path="/doctors/:doctorId/book" element={<BookingFlow />} />
          <Route path="/book" element={<BookingFlow />} />
          <Route path="/treatments/:id" element={<TreatmentDetails />} />

          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Public routes */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/hospitals" element={<AdminHospitals />} />
          <Route path="/admin/treatments" element={<AdminTreatment />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/doctor-treatment" element={<AdminDoctorTreatment />} />
          {/* <Route path="/admin/treatments" element={<AdminTreatments />} /> */}
          <Route path="/admin/hospital-treatment" element={<AdminHospitalTreatment />} />
          <Route path="/admin/faqs" element={<AdminFaqs />} />
          <Route path="/admin/patient-opinions" element={<AdminPatientOpinions />} />
          <Route path="/admin/procedures" element={<AdminProcedures />} />
          <Route path="/admin/hospital-details" element={<AdminHospitalDetails />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/about" element={<AboutUs />} />
          <Route path="/admin/user" element={<User />} />
          <Route path="/admin/lang" element={<Languages />} />
          <Route path="/admin/head" element={<Headings />} />
          {/* admin/bookings */}

          {/* // Import the components */}


          {/* // Add these routes */}
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/register" element={<PatientRegister />} />
          <Route path="/patient/dashboard" element={<PatientDashboardp />} />

          <Route path="/admin/patients" element={<PatientManagement />} />
          <Route path="/admin/patients/:patientId/dashboard" element={<PatientDashboard />} />

          {/* import AddPatient from './components/AddPatient'; */}
          <Route path="/admin/blogs" element={<AdminBlogManagement />} />
          <Route path="/admin/patients/add" element={<AddPatient />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<MainContent />} />{" "}
            <Route path="dashboard" element={<MainContent />} />{" "}
          </Route>
        </Routes>

      </main>
      <Footer />
    </div>
  );
}
