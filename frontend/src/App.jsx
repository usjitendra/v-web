import { Route, Routes } from "react-router-dom";

/* ===== ADMIN IMPORTS ===== */
import AdminDashboard from "./admin/Index";
import AdminLogin from "./components/admin/AdminLogin";
import DoctorTable from "./admin/Doctor/DoctoreList";
import LanguageSetting from "./admin/adminSetting/LanguageSetting";
import WorkInProgress from "./admin/components/WorkInProgress";
import CountrySetting from "./admin/adminSetting/CountrySetting";

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


/* ===== REACT ROUTER ===== */
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BiodataApp from "./p1";
import CategoryManagement from "./admin/adminSetting/CategorySetting";

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


/* ===== APP ===== */
export default function App() {
  return (
    <>
      {/* ✅ Toaster OUTSIDE Routes */}
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

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/treatments/:id" element={<TreatmentDetails />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/hospitals/:id" element={<HospitalDetails />} />
          <Route path="/book" element={<BookingFlow />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="dashboard" element={<WorkInProgress />} />
          <Route path="doctors/list" element={<DoctorTable />} />
          <Route path="doctors/list" element={<WorkInProgress />} />
          <Route path="doctors-add" element={<WorkInProgress />} />
          <Route path="master/countries" element={<CountrySetting />} />
          <Route path="hospital/language-setting" element={<LanguageSetting />} />
          <Route path="master/categories" element={<CategoryManagement/>} />
          <Route path="master/sub-categories" element={<WorkInProgress />} />
        </Route>

        {/* ================= PATIENT ROUTES ================= */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/patient/dashboard" element={<PatientDashboardp />} />

        {/* ================= ADMIN LOGIN ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />



                <Route path="/bio-data" element={<BiodataApp/>} />

      </Routes>
    </>
  );
}

