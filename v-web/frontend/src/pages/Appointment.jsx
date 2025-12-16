import React from "react";
import AppointmentForm from "../components/AppointmentForm";

export default function Appointment() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Book an Appointment</h1>
      <AppointmentForm />
    </div>
  );
}
