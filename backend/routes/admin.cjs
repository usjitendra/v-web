// routes/admin.cjs - FIXED VERSION
const express = require('express');
const {
    adminLogin,
    adminLogout,
    getDashboardStats,
    getHospitals,
    getDoctors,
    getDoctorById,     // ✅ NEW
    createHospital,
    updateHospital,
    deleteHospital,
    getHospitalTreatments,
    // getHospitalDetails,
    createDoctor,      // ✅ NEW
    updateDoctor,      // ✅ NEW
    deleteDoctor,     // ✅ NEW
    createHospitalTreatment,     // ✅ NEW
    updateHospitalTreatment,     // ✅ NEW
    deleteHospitalTreatment,     // ✅ NEW
    getHospitalTreatmentById,   // ✅ NEW
    getDoctorTreatments,
    getDoctorTreatmentById,
    createDoctorTreatment,
    updateDoctorTreatment,
    deleteDoctorTreatment,
    getTreatments,
    getTreatmentById,
    createTreatment,
    updateTreatment,
    deleteTreatment,
    // ✅ Procedure Costs
    createProcedureCost,
    updateProcedureCost,
    deleteProcedureCost,
    getProcedureCosts,
    getProcedureCostById,

    // ✅ FAQs
    createFAQ,
    updateFAQ,
    deleteFAQ,
    getFAQs,

    // ✅ Patient Opinions
    createPatientOpinion,
    updatePatientOpinion,
    deletePatientOpinion,
    getPatientOpinions,

    getHospitalDetails,
    getHospitalDetailById,
    createHospitalDetail,
    updateHospitalDetail,
    deleteHospitalDetail,

    getBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
    getBookingStats,

    getAboutAdmin,
    updateAboutAdmin,

    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,

    getLanguages,
    getLanguageById,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    setDefaultLanguage,

    getHeadings,
    createHeading,
    getHeadingById,
    updateHeading,
    deleteHeading,


    // Add the new patient and appointment controller functions
    getPatients,
    createPatient,
    getPatientById,
    updatePatient,
    deletePatient,
    getAppointments,
    createAppointment,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    getPatientDashboard,

    registerPatient,

    generatePassword,

    // Blog management functions
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    approveBlogComment,
    deleteBlogComment,
    getBlogStats

} = require('../controllers/adminController.cjs');
const { protectAdmin, restrictTo } = require('../middleware/authAdmin.cjs');

// ✅ Use Express Router (NOT the standalone router package)
const router = express.Router();

// Auth routes
router.post('/login', adminLogin);
router.post('/logout', protectAdmin, adminLogout);

// Dashboard
router.get('/dashboard/stats', protectAdmin, getDashboardStats);

// Hospital management
router.get('/hospitals', protectAdmin, getHospitals);
router.get('/hospitaldetails/:hospitalid', protectAdmin, getHospitalDetails);
router.post('/hospitals', protectAdmin, restrictTo('superadmin', 'admin'), createHospital);
router.put('/hospitals/:id', protectAdmin, restrictTo('superadmin', 'admin'), updateHospital);
router.delete('/hospitals/:id', protectAdmin, restrictTo('superadmin'), deleteHospital);

// Doctor management
router.get('/doctors', protectAdmin, getDoctors);
router.post('/doctors', protectAdmin, restrictTo('superadmin', 'admin'), createDoctor);
router.put('/doctors/:id', protectAdmin, restrictTo('superadmin', 'admin'), updateDoctor);
router.delete('/doctors/:id', protectAdmin, restrictTo('superadmin'), deleteDoctor);

// Treatment management
router.get('/treatments', protectAdmin, getTreatments);
router.post('/treatments', protectAdmin, restrictTo('superadmin', 'admin'), createTreatment);
router.put('/treatments/:id', protectAdmin, restrictTo('superadmin', 'admin'), updateTreatment);
router.delete('/treatments/:id', protectAdmin, restrictTo('superadmin'), deleteTreatment);

// Hospital-Treatment management
router.get('/hospital-treatments', protectAdmin, getHospitalTreatments);
router.put('/hospital-treatments/:id', protectAdmin, restrictTo('superadmin', 'admin'), updateHospitalTreatment);

// User management
// router.get('/users', protectAdmin, restrictTo('superadmin'), getUsers);


// Doctor management
router.get('/doctors', protectAdmin, getDoctors);
router.get('/doctors/:id', protectAdmin, getDoctorById);
router.post('/doctors', protectAdmin, restrictTo('superadmin', 'admin'), createDoctor);
router.put('/doctors/:id', protectAdmin, restrictTo('superadmin', 'admin'), updateDoctor);
router.delete('/doctors/:id', protectAdmin, restrictTo('superadmin'), deleteDoctor);

// Hospital-Treatment management
router.get('/hospital-treatments', protectAdmin, getHospitalTreatments);
router.get('/hospital-treatments/:id', protectAdmin, getHospitalTreatmentById);
router.post('/hospital-treatments', protectAdmin, restrictTo('superadmin', 'admin'), createHospitalTreatment);
router.put('/hospital-treatments/:id', protectAdmin, restrictTo('superadmin', 'admin'), updateHospitalTreatment);
router.delete('/hospital-treatments/:id', protectAdmin, restrictTo('superadmin'), deleteHospitalTreatment);

// Doctor-Treatment management
router.get('/doctor-treatments', protectAdmin, getDoctorTreatments);
router.get('/doctor-treatments/:id', protectAdmin, getDoctorTreatmentById);
router.post('/doctor-treatments', protectAdmin, restrictTo('superadmin', 'admin'), createDoctorTreatment);
router.put('/doctor-treatments/:id', protectAdmin, restrictTo('superadmin', 'admin'), updateDoctorTreatment);
router.delete('/doctor-treatments/:id', protectAdmin, restrictTo('superadmin'), deleteDoctorTreatment);

// Treatments
router.get('/treatments', protectAdmin, getTreatments);
router.get('/treatments/:id', protectAdmin, getTreatmentById);
router.post('/treatments', protectAdmin, restrictTo('superadmin', 'admin'), createTreatment);
router.put('/treatments/:id', protectAdmin, restrictTo('superadmin', 'admin'), updateTreatment);
router.delete('/treatments/:id', protectAdmin, restrictTo('superadmin'), deleteTreatment);

// Procedure Costs
router.get('/procedure-costs', protectAdmin, getProcedureCosts);
router.get('/procedure-costs/:id', protectAdmin, getProcedureCostById);
router.post('/procedure-costs', protectAdmin, restrictTo('superadmin', 'admin'), createProcedureCost);
router.put('/procedure-costs/:id', protectAdmin, restrictTo('superadmin', 'admin'), updateProcedureCost);
router.delete('/procedure-costs/:id', protectAdmin, restrictTo('superadmin'), deleteProcedureCost);

// FAQs
router.get('/faqs', protectAdmin, getFAQs);
router.post('/faqs', protectAdmin, restrictTo('superadmin', 'admin'), createFAQ);
router.put('/faqs/:id', protectAdmin, restrictTo('superadmin', 'admin'), updateFAQ);
router.delete('/faqs/:id', protectAdmin, restrictTo('superadmin'), deleteFAQ);

// Patient Opinions
router.get('/patient-opinions', protectAdmin, getPatientOpinions);
router.post('/patient-opinions', protectAdmin, restrictTo('superadmin', 'admin'), createPatientOpinion);
router.put('/patient-opinions/:id', protectAdmin, restrictTo('superadmin', 'admin'), updatePatientOpinion);
router.delete('/patient-opinions/:id', protectAdmin, restrictTo('superadmin'), deletePatientOpinion);

// ==============================
// Hospital-Detail management
// ==============================
router.get('/hospital-details', protectAdmin, getHospitalDetails);
router.get('/hospital-details/:id', protectAdmin, getHospitalDetailById);
router.post('/hospital-details', protectAdmin, restrictTo('superadmin', 'admin'), createHospitalDetail);
router.put('/hospital-details/:id', protectAdmin, restrictTo('superadmin', 'admin'), updateHospitalDetail);
router.delete('/hospital-details/:id', protectAdmin, restrictTo('superadmin'), deleteHospitalDetail);



// Booking management routes
router.get('/bookings', protectAdmin, getBookings);
router.get('/bookings/stats', protectAdmin, getBookingStats);
router.get('/bookings/:id', protectAdmin, getBookingById);
router.put('/bookings/:id', protectAdmin, updateBookingStatus);
router.delete('/bookings/:id', protectAdmin, restrictTo('superadmin'), deleteBooking);

// About management routes
router.get('/about', protectAdmin, getAboutAdmin);
router.put('/about', protectAdmin, updateAboutAdmin);



// Admin management routes
router.get('/admins', protectAdmin, restrictTo('superadmin'), getAdmins);
router.get('/admins/:id', protectAdmin, restrictTo('superadmin'), getAdminById);
router.post('/admins', protectAdmin, restrictTo('superadmin'), createAdmin);
router.put('/admins/:id', protectAdmin, restrictTo('superadmin'), updateAdmin);
router.delete('/admins/:id', protectAdmin, restrictTo('superadmin'), deleteAdmin);

module.exports = router;


// ================= LANGUAGE ROUTES =================
router.get('/languages', protectAdmin, getLanguages);
router.get('/languages/:id', protectAdmin, getLanguageById);
router.post('/languages', protectAdmin, restrictTo('superadmin', 'admin'), createLanguage);
router.put('/languages/:id', protectAdmin, restrictTo('superadmin', 'admin'), updateLanguage);
router.delete('/languages/:id', protectAdmin, restrictTo('superadmin'), deleteLanguage);
router.patch('/languages/:id/set-default', protectAdmin, restrictTo('superadmin', 'admin'), setDefaultLanguage);

// Headings routes
// Headings management
router.get('/headings', protectAdmin, restrictTo('admin', 'superadmin'), getHeadings);
router.post('/headings', protectAdmin, restrictTo('admin', 'superadmin'), createHeading);
router.get('/headings/:id', protectAdmin, restrictTo('admin', 'superadmin'), getHeadingById);
router.put('/headings/:id', protectAdmin, restrictTo('admin', 'superadmin'), updateHeading);
router.delete('/headings/:id', protectAdmin, restrictTo('superadmin'), deleteHeading);



// ================= APPOINTMENT MANAGEMENT ROUTES =================
router.get('/appointments', protectAdmin, restrictTo('admin', 'superadmin'), getAppointments);
router.post('/appointments', protectAdmin, restrictTo('admin', 'superadmin'), createAppointment);
router.get('/appointments/:id', protectAdmin, restrictTo('admin', 'superadmin'), getAppointmentById);
router.put('/appointments/:id', protectAdmin, restrictTo('admin', 'superadmin'), updateAppointment);
router.delete('/appointments/:id', protectAdmin, restrictTo('superadmin'), deleteAppointment);

// ================= PATIENT DASHBOARD ROUTE =================
router.get('/patients/:patientId/dashboard', protectAdmin, restrictTo('admin', 'superadmin'), getPatientDashboard);

// Patient registration route
router.post('/patients/register', protectAdmin, restrictTo('admin', 'superadmin'), registerPatient);

// Generate password route
router.get('/patients/generate-password', protectAdmin, restrictTo('admin', 'superadmin'), generatePassword);



router.get('/patients', protectAdmin, restrictTo('admin', 'superadmin'), getPatients);
router.post('/patients', protectAdmin, restrictTo('admin', 'superadmin'), createPatient);
router.get('/patients/:id', protectAdmin, restrictTo('admin', 'superadmin'), getPatientById);
router.put('/patients/:id', protectAdmin, restrictTo('admin', 'superadmin'), updatePatient);
router.delete('/patients/:id', protectAdmin, restrictTo('superadmin'), deletePatient);


router.get('/blogs', protectAdmin, getBlogs);
router.get('/blogs/stats', protectAdmin, getBlogStats);
router.get('/blogs/:id', protectAdmin, getBlogById);
router.post('/blogs', protectAdmin, restrictTo('admin', 'superadmin'), createBlog);
router.put('/blogs/:id', protectAdmin, restrictTo('admin', 'superadmin'), updateBlog);
router.delete('/blogs/:id', protectAdmin, restrictTo('superadmin'), deleteBlog);
router.patch('/blogs/:blogId/comments/:commentId/approve', protectAdmin, restrictTo('admin', 'superadmin'), approveBlogComment);
router.delete('/blogs/:blogId/comments/:commentId', protectAdmin, restrictTo('admin', 'superadmin'), deleteBlogComment);


module.exports = router;
