import { Route, Routes } from "react-router-dom";

/* ===== ADMIN IMPORTS ===== */
import AdminLayout from "./admin/Index";
import AdminDashboardPage from "./admin/Dashbaord/AdminDashboard";
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
import BlogListing from "./pages/BlogListing";
import BlogDetail from "./pages/BlogDetail";

/* ===== PATIENT ===== */
import PatientDashboardp from "./components/patient/PatientDashboard";
import PatientLogin from "./components/patient/PatientLogin";
import PatientRegister from "./components/patient/PatientRegister";


/* ===== REACT ROUTER ===== */
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import BiodataApp from "./p1";
import CategoryManagement from "./admin/adminSetting/CategorySetting";
import SubcategoryManagement from "./admin/adminSetting/subCategoryManagement";
import DoctorManagement from "./admin/Doctor/DoctorManagement";
import HospitalManagement from "./admin/Hospital/Hospital";
import HospitalList from "./admin/Hospital/HospitalList";
import BlogManagement from "./admin/Blog/BlogManagement";
import BlogForm from "./admin/Blog/BlogForm";
import SEOManagement from "./admin/SEO/SEOManagement";
import ClinicalPsychology from "./pages/ClinicalPsychology";
// import AdminDashboard from "./admin/Dashbaord/AdminDashboard";
import DoctorHome from "./pages/Doctor/DoctorHome";
import HospitalListingPage from "./pages/Hospital/HospitalListing";
import HospitalHome from "./pages/Hospital/HospitalHome";
import DoctorDetailPage from "./pages/Doctor/DoctorDetailsPage/DoctorDetailPage";
import HospitalDetailPage from "./pages/Hospital/HospitalDetailPage";
import Host from "./pages/webrtc/Host";
import Viewer from "./pages/webrtc/Viewer";
import PsychiatricServicesDetails from "./pages/ClinicalPsychology";

/* ===== LAYOUTS ===== */
const PublicLayout = () => (
  <div className="min-h-screen flex flex-col text-gray-800">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);


/* ===== APP ===== */
export default function App() {
  return (
    <AuthProvider>
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
          <Route path="/doctors" element={<DoctorHome />} />
          <Route path="/doctor/:slug" element={<DoctorDetailPage />} />
          {/* <Route path="/doctors" element={<Doctors />} /> */}
          <Route path="/doctors/:id" element={<DoctorDetails />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/treatments/:id" element={<TreatmentDetails />} />
          {/* <Route path="/hospitals" element={<Hospitals />} /> */}
          <Route path="/hospitals" element={<HospitalHome />} />
          <Route path="/hospital/:slug" element={<HospitalDetailPage />} />
          {/* <Route path="/hospitals/:id" element={<HospitalDetails />} /> */}
          <Route path="/book/:hospitalId?/:doctorId?" element={<BookingFlow />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/blog" element={<BlogListing />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/specialities/:name" element={<PsychiatricServicesDetails />} />


          <Route path='/service/:name' element={<PsychiatricServicesDetails />} />

          <Route path="/host" element={<Host />} />
          <Route path="/view" element={<Viewer />} />

        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin/login" element={
          <ProtectedRoute requireAuth={false}>
            <AdminLogin />
          </ProtectedRoute>
        } />

        <Route path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="doctors/list" element={<DoctorTable />} />
          <Route path="doctors-add" element={<DoctorManagement />} />
          <Route path="hospitals-add" element={<HospitalManagement />} />
          <Route path="hospitals/list" element={<HospitalList />} />
          <Route path="master/countries" element={<CountrySetting />} />
          <Route path="hospital/language-setting" element={<LanguageSetting />} />
          <Route path="master/categories" element={<CategoryManagement />} />
          <Route path="master/sub-categories" element={<SubcategoryManagement />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="blogs/create" element={<BlogForm />} />
          <Route path="blogs/edit/:id" element={<BlogForm />} />
          <Route path="seo" element={<SEOManagement />} />
        </Route>

        {/* ================= PATIENT ROUTES ================= */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/patient/dashboard" element={<PatientDashboardp />} />




        <Route path="/bio-data" element={<BiodataApp />} />

      </Routes>
    </AuthProvider>
  );
}

