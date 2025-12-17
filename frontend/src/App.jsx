import { Route, Routes } from "react-router-dom";

/* ===== ADMIN IMPORTS ===== */
import AboutUs from "./components/admin/AdminAbout";
import AddPatient from "./components/admin/AdminAddPatient";
import Bookings from "./components/admin/AdminAppointments";
import AdminDashboard from "./admin/Index";
import AdminDoctors from "./components/admin/AdminDoctors";
import AdminDoctorTreatment from "./components/admin/AdminDoctorTreatment";
import AdminFaqs from "./components/admin/AdminFAQ";
import Headings from "./components/admin/AdminHeadings";
import AdminHospitalDetails from "./components/admin/AdminHospitalDetails";
import AdminHospitals from "./components/admin/AdminHospitals";
import AdminHospitalTreatment from "./components/admin/AdminHospitalTreatment";
import Languages from "./components/admin/AdminLanguageManagement";
import AdminLogin from "./components/admin/AdminLogin";
import User from "./components/admin/AdminPassword";
import PatientManagement from "./components/admin/AdminPatient";
import AdminPatientOpinions from "./components/admin/AdminPatientOpinions";
import AdminProcedures from "./components/admin/AdminProcedures";
import AdminTreatment from "./components/admin/AdminTreatment";
import AdminBlogManagement from "./components/admin/AdminBlog";
import MainContent from "./admin/MainContent";

import DoctorTable from "./admin/Doctor/DoctoreList";

/* ===== PUBLIC IMPORTS ===== */
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";
import Appointment from "./pages/Appointment";
import BookingFlow from "./pages/BookingFlow";
import Contact from "./pages/Contact";
import DoctorDetails from "./pages/DoctorDetails";
import Doctors from "./pages/Doctors";
import Home from "./pages/Home";
import HospitalDetails from "./pages/HospitalDetails";
import Hospitals from "./pages/Hospitals";
import TreatmentDetails from "./pages/TreatmentDetails";
import Treatments from "./pages/Treatments";

/* ===== BLOG ===== */
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

/* ===== PATIENT ===== */
import PatientDashboardp from "./components/patient/PatientDashboard";
import PatientLogin from "./components/patient/PatientLogin";
import PatientRegister from "./components/patient/PatientRegister";
import PatientDashboard from "./pages/PatientDashboard";

/* ===== REACT ROUTER ===== */
import { Outlet } from "react-router-dom";
import LanguageSetting from "./admin/adminSetting/LanguageSetting";
import { Toaster } from "react-hot-toast";

/* ===== LAYOUTS ===== */
const PublicLayout = () => (
  <div className="min-h-screen flex flex-col text-gray-800">
    <Header />
    <main className="flex-grow mt-2 pt-14">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AdminLayout = () => (
  <div className="min-h-screen bg-gray-100">
    <Outlet />
  </div>
);

/* ===== APP ===== */
export default function App() {
  return (
    <Routes>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "Poppins",
            fontSize: "14px",
          },
        }}
      />
      {/* ================= PUBLIC ROUTES (WITH HEADER & FOOTER) ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
        <Route path="/treatments" element={<Treatments />} />
        <Route path="/treatments/:id" element={<TreatmentDetails />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/hospitals/:id" element={<HospitalDetails />} />
        <Route path="/hospitals/:hospitalId/book" element={<BookingFlow />} />
        <Route path="/doctors/:doctorId/book" element={<BookingFlow />} />
        <Route path="/book" element={<BookingFlow />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Route>

      {/* ================= ADMIN ROUTES (NO HEADER / FOOTER) ================= */}
      <Route path="/admin" element={<AdminDashboard />}>
        {/* <Route index element={<index/>} /> */}
        {/* <Route path="dashboard" element={<AdminDashboard/>} /> */}
        <Route path="hospitals" element={<DoctorTable />} />
        <Route path="hospital/language-setting" element={<LanguageSetting />} />
        <Route path="hospital-treatment" element={<AdminHospitalTreatment />} />
        <Route path="treatments" element={<AdminTreatment />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="doctor-treatment" element={<AdminDoctorTreatment />} />
        <Route path="faqs" element={<AdminFaqs />} />
        <Route path="patient-opinions" element={<AdminPatientOpinions />} />
        <Route path="procedures" element={<AdminProcedures />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="user" element={<User />} />
        <Route path="lang" element={<Languages />} />
        <Route path="head" element={<Headings />} />
        <Route path="patients" element={<PatientManagement />} />
        <Route path="patients/add" element={<AddPatient />} />
        <Route path="patients/:patientId/dashboard" element={<PatientDashboard />} />
        <Route path="blogs" element={<AdminBlogManagement />} />
      </Route>


      {/* ================= PATIENT ROUTES ================= */}
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/register" element={<PatientRegister />} />
      <Route path="/patient/dashboard" element={<PatientDashboardp />} />

      {/* ================= ADMIN LOGIN (NO HEADER/FOOTER) ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />
    </Routes>
  );
}
