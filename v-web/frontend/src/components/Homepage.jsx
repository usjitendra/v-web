import {
  Briefcase,
  ClipboardCheck,
  Plane,
  Stethoscope,
  Heart,
} from "lucide-react";

export default function HowWeWork() {
  const steps = [
    {
      icon: <ClipboardCheck className="w-10 h-10 text-teal-600" />,
      title: "Submit Your Query",
      description:
        "Tell us your medical concerns and requirements through our secure form.",
    },
    {
      icon: <Stethoscope className="w-10 h-10 text-green-600" />,
      title: "Get Expert Opinion",
      description:
        "Our medical experts review your case and suggest the best treatment options.",
    },
    {
      icon: <Briefcase className="w-10 h-10 text-indigo-600" />,
      title: "Plan Your Treatment",
      description:
        "We connect you with top hospitals and doctors, with complete cost transparency.",
    },
    {
      icon: <Plane className="w-10 h-10 text-teal-600" />,
      title: "Travel Assistance",
      description:
        "We assist with visas, flights, and stay to make your medical journey stress-free.",
    },
    {
      icon: <Heart className="w-10 h-10 text-pink-600" />,
      title: "Post-Treatment Care",
      description:
        "Continued support and follow-ups to ensure your recovery is smooth and complete.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-6 md:px-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          How Do We Work
        </h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Our process is designed to make your healthcare journey smooth,
          transparent, and stress-free. Here’s how we assist you step by step.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-5">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 text-center"
          >
            <div className="flex justify-center mb-4">{step.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
