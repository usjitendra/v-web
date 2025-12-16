import React, { useState } from "react";

export default function AppointmentForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    doctor: "",
    date: "",
  });
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    console.log("appointment", form);
    setSuccess(true);
  }

  return (
    <div>
      {success ? (
        <div className="bg-green-100 text-green-800 p-4 rounded">
          Appointment requested — we will contact you.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="input-float">
            <input
              name="name"
              placeholder=" "
              onChange={handleChange}
              required
              className="w-full p-3 border rounded"
            />
            <label>Full name</label>
          </div>
          <div className="input-float">
            <input
              name="email"
              placeholder=" "
              onChange={handleChange}
              required
              className="w-full p-3 border rounded"
            />
            <label>Email</label>
          </div>
          <div className="input-float">
            <input
              name="phone"
              placeholder=" "
              onChange={handleChange}
              required
              className="w-full p-3 border rounded"
            />
            <label>Phone</label>
          </div>
          <div className="input-float">
            <input
              name="doctor"
              placeholder=" "
              onChange={handleChange}
              className="w-full p-3 border rounded"
            />
            <label>Preferred doctor</label>
          </div>
          <div>
            <input
              name="date"
              type="date"
              onChange={handleChange}
              className="w-full p-3 border rounded"
            />
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded">
            Request Appointment
          </button>
        </form>
      )}
    </div>
  );
}
