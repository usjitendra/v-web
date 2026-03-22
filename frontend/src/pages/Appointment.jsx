import React from "react";
import { Helmet } from 'react-helmet';
import AppointmentForm from "../components/AppointmentForm";

export default function Appointment() {
  return (
    <>
      <Helmet>
        <title>Book an Appointment | Schedule with Doctors | MedicwayCare</title>
        <meta name="description" content="Schedule an appointment with expert doctors and healthcare professionals. Book your consultation easily on MedicwayCare." />
        <meta name="keywords" content="appointment booking, doctor consultation, schedule appointment, medical consultation" />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Book an Appointment</h1>
      <AppointmentForm />
    </div>
    </>
  );
}
