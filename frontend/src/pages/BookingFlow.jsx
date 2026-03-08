import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetHospitalsQuery } from "../rtk/slices/hospitalApiSlice";
import { useGetDoctorsQuery } from "../rtk/slices/doctorApi";
import { useCreateBookingMutation } from "../rtk/slices/bookingApiSlice";

export default function BookingFlow() {
  const { hospitalId, doctorId } = useParams();
  const navigate = useNavigate();

  // RTK Query hooks for fetching data
  const { data: hospitalsData, isLoading: hospitalsLoading, error: hospitalsError } = useGetHospitalsQuery({ limit: 10000 });
  const { data: doctorsData, isLoading: doctorsLoading, error: doctorsError } = useGetDoctorsQuery({
    limit: 10000,
    hospital: hospitalId || undefined
  });
  const [createBooking, { isLoading: bookingLoading, error: bookingError }] = useCreateBookingMutation();


  console.log("hosr",hospitalsData);
  console.log("doct",doctorsData);
  
  
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [patientData, setPatientData] = useState(null);

  // Get data from RTK Query
  const hospitals = hospitalsData?.data?.data || [];
  const doctors = doctorsData?.data?.data || [];
  const [bookingType, setBookingType] = useState(""); // "appointment" or "query"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    doctor: "",
    doctorId: doctorId || "",
    hospital: "",
    hospitalId: hospitalId || "",
    date: "",
    time: "",
    message: "",
    type: "appointment" // Default to appointment
  });

  // Check if patient is logged in
  useEffect(() => {
    const token = localStorage.getItem('patientToken');
    const patient = localStorage.getItem('patientData');
    
    if (token && patient) {
      setIsLoggedIn(true);
      setPatientData(JSON.parse(patient));
      
      // Pre-fill form with patient data
      const patientInfo = JSON.parse(patient);
      setFormData(prev => ({
        ...prev,
        name: `${patientInfo.firstName} ${patientInfo.lastName}`,
        email: patientInfo.email,
        phone: patientInfo.phone
      }));
    }
  }, []);

  // RTK Query automatically fetches hospitals and doctors

  useEffect(() => {
    if (hospitalId && hospitals.length > 0) {
      const selectedHospital = hospitals.find(h => h._id === hospitalId);
      setFormData(prev => ({
        ...prev,
        hospitalId,
        hospital: selectedHospital ? selectedHospital.name : prev.hospital,
      }));
    }
  }, [hospitalId, hospitals]);

  useEffect(() => {
    if (doctorId && doctors.length > 0) {
      const selectedDoctor = doctors.find(d => d._id === doctorId);
      setFormData(prev => ({
        ...prev,
        doctorId,
        doctor: selectedDoctor ? selectedDoctor.name : prev.doctor,
      }));
    }
  }, [doctorId, doctors]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle hospital selection
  const handleHospitalChange = (e) => {
    const hospitalId = e.target.value;
    const selectedHospital = hospitals.find(h => h._id === hospitalId);
    setFormData({
      ...formData,
      hospitalId: hospitalId,
      hospital: selectedHospital ? selectedHospital.name : "",
      doctorId: "", // Reset doctor selection when hospital changes
      doctor: ""
    });
  };

  // Handle doctor selection
  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const selectedDoctor = doctors.find(d => d._id === doctorId);
    setFormData({
      ...formData,
      doctorId: doctorId,
      doctor: selectedDoctor ? selectedDoctor.name : ""
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);


  const handleBookingTypeSelect = (type) => {
    setBookingType(type);
    setFormData(prev => ({ ...prev, type }));
    nextStep();
  };

  const handleConfirmBooking = async () => {
    try {
      // Prepare data for backend
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        doctor: formData.doctorId,
        hospital: formData.hospitalId,
        date: formData.type === 'appointment' ? formData.date : null,
        time: formData.type === 'appointment' ? formData.time : null,
        message: formData.message,
        type: formData.type,
        status: formData.type === 'appointment' ? 'scheduled' : 'query',
        patientId: isLoggedIn ? patientData.id : null
      };

      // Use RTK Query mutation instead of fetch
      await createBooking(bookingData).unwrap();

      // Show appropriate success message
      if (formData.type === 'appointment') {
        alert("Booking Confirmed ✅\nYour appointment has been scheduled successfully!");
      } else {
        alert("Query Submitted ✅\nWe'll get back to you soon with more information!");
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        doctor: "",
        doctorId: "",
        hospital: "",
        hospitalId: "",
        date: "",
        time: "",
        message: "",
        type: "appointment"
      });
      setStep(1);
      setBookingType("");

    } catch (error) {
      console.error("Booking error:", error);
      alert("There was an issue processing your request. Please try again.");
    }
  };

  // Restore booking data if returning from login/signup
  useEffect(() => {
    const savedBookingData = sessionStorage.getItem('bookingData');
    const savedStep = sessionStorage.getItem('bookingStep');
    
    if (savedBookingData && savedStep) {
      setFormData(JSON.parse(savedBookingData));
      setStep(parseInt(savedStep));
      sessionStorage.removeItem('bookingData');
      sessionStorage.removeItem('bookingStep');
    }
  }, []);

  return (
    <div className="py-20">
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 py-10 ">
      {/* Progress Steps */}
      <div className="flex justify-between mb-6">
        {["Booking Type", "Details", "Confirm"].map((label, i) => (
          <div
            key={i}
            className={`flex-1 text-center text-sm font-medium ${step === i + 1 ? "text-teal-600" : "text-gray-400"
              }`}
          >
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${step === i + 1 ? "bg-teal-600 text-white" : "bg-gray-200"
                }`}
            >
              {i + 1}
            </div>
            {label}
          </div>
        ))}
      </div>

      {/* Step 1: Booking Type Selection */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-6 text-center">What would you like to do?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div 
              className="border-2 border-teal-500 rounded-lg p-4 text-center cursor-pointer hover:bg-teal-50 transition-colors"
              onClick={() => handleBookingTypeSelect("appointment")}
            >
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-semibold mb-2">Book Appointment</h3>
              <p className="text-sm text-gray-600">Schedule a medical consultation</p>
              <div className="mt-2 text-xs text-green-600">No login required</div>
            </div>
            
            <div 
              className="border-2 border-blue-500 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => handleBookingTypeSelect("query")}
            >
              <div className="text-3xl mb-2">❓</div>
              <h3 className="font-semibold mb-2">Send Query</h3>
              <p className="text-sm text-gray-600">Ask questions about treatments or services</p>
              <div className="mt-2 text-xs text-green-600">No login required</div>
            </div>
          </div>

        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            {bookingType === "appointment" ? "Appointment Details" : "Query Details"}
          </h2>

          {/* Personal Information */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Personal Information</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              className="w-full border p-2 rounded mb-3"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              className="w-full border p-2 rounded mb-3"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              className="w-full border p-2 rounded mb-3"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Hospital and Doctor Selection */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Hospital *
            </label>
            {hospitalsLoading ? (
              <div className="flex items-center gap-2 p-2 border rounded">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Loading hospitals...</span>
              </div>
            ) : hospitalsError ? (
              <div className="p-2 border rounded text-red-600 bg-red-50">
                Error loading hospitals: {hospitalsError?.data?.message || 'Unknown error'}
              </div>
            ) : (
              <select
                name="hospitalId"
                className="w-full border p-2 rounded"
                value={formData.hospitalId}
                onChange={handleHospitalChange}
                required
              >
                <option value="">Choose a hospital</option>
              {hospitals.map((hospital) => (
                <option key={hospital._id} value={hospital._id}>
                  {hospital.name} - {hospital.address?.city}{hospital.address?.country ? `, ${hospital.address.country}` : ''}
                </option>
              ))}
              </select>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Doctor *
            </label>

            {doctorsLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Loading doctors...</span>
              </div>
            ) : doctorsError ? (
              <div className="p-2 border rounded text-red-600 bg-red-50">
                Error loading doctors: {doctorsError?.data?.message || 'Unknown error'}
              </div>
            ) : (
              <select
                name="doctorId"
                className="w-full border p-2 rounded"
                value={formData.doctorId}
                onChange={handleDoctorChange}
                required
                disabled={!formData.hospitalId}
              >
                <option value="">
                  {formData.hospitalId ? "Choose a doctor" : "Select a hospital first"}
                </option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} - {doctor.categoryId?.category_name || 'General'}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date and Time (only for appointments) */}
          {bookingType === "appointment" && (
            <>
              <input
                type="date"
                name="date"
                className="w-full border p-2 rounded mb-3"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
              <input
                type="time"
                name="time"
                className="w-full border p-2 rounded mb-3"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </>
          )}

          <textarea
            name="message"
            placeholder={bookingType === "appointment" ? "Additional message (optional)" : "Please describe your query *"}
            className="w-full border p-2 rounded mb-3 h-20 resize-none"
            value={formData.message}
            onChange={handleChange}
            required={bookingType === "query"}
          />


          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              ← Back
            </button>
            <button
              onClick={nextStep}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!formData.name || !formData.email || !formData.phone || 
                       !formData.doctorId || !formData.hospitalId || 
                       (bookingType === "appointment" && (!formData.date || !formData.time)) ||
                       (bookingType === "query" && !formData.message)}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Confirm {bookingType === "appointment" ? "Appointment" : "Query"}
          </h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="mb-3">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded uppercase mb-2">
                {bookingType === "appointment" ? "APPOINTMENT" : "QUERY"}
              </span>
            </div>
            
            <ul className="space-y-2 text-gray-700">
              <li><strong>Name:</strong> {formData.name}</li>
              <li><strong>Email:</strong> {formData.email}</li>
              <li><strong>Phone:</strong> {formData.phone}</li>
              <li><strong>Hospital:</strong> {formData.hospital}</li>
              <li><strong>Doctor:</strong> {formData.doctor}</li>
              {bookingType === "appointment" && (
                <>
                  <li><strong>Date:</strong> {formData.date}</li>
                  <li><strong>Time:</strong> {formData.time}</li>
                </>
              )}
              {formData.message && (
                <li><strong>Message:</strong> {formData.message}</li>
              )}
            </ul>
          </div>


          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              ← Back
            </button>
            
            {/* Always show confirm button - login not required */}
            <button
              onClick={handleConfirmBooking}
              disabled={bookingLoading}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {bookingLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                `Confirm ${bookingType === "appointment" ? "Appointment" : "Query"} ✔`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}