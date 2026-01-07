import React from 'react';
import { Heart, Brain, Bone, Activity, User, Scale, Hospital, Droplet, Baby } from 'lucide-react';

const SpecialtyCard = ({ icon: Icon, title, description, iconColor }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 relative">
    <div className="flex items-start gap-4">
      <div className={`${iconColor} p-3 rounded-lg flex-shrink-0 bg-main`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
      <button className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors">
        <span className="text-lg font-semibold">+</span>
      </button>
    </div>
  </div>
);

const MultiSpecialtyFocus = () => {
  const specialties = [
    {
      icon: Heart,
      title: "Oncology",
      description: "Advanced cancer treatments with proven results.",
      iconColor: "bg-blue-600"
    },
    {
      icon: Brain,
      title: "Neurosurgery",
      description: "The specialty of neurosurgical care includes both adult and pediatric patients.",
      iconColor: "bg-blue-700"
    },
    {
      icon: Bone,
      title: "Spine Surgery",
      description: "Precision spine surgeries for better mobility.",
      iconColor: "bg-blue-600"
    },
    {
      icon: Activity,
      title: "Cardiology",
      description: "World-class heart care for adults and children.",
      iconColor: "bg-blue-700"
    },
    {
      icon: Bone,
      title: "Orthopedics",
      description: "Expert joint replacements and bone deformities solutions.",
      iconColor: "bg-blue-600"
    },
    {
      icon: Baby,
      title: "IVF",
      description: "Leading fertility treatments with high success.",
      iconColor: "bg-blue-700"
    },
    {
      icon: User,
      title: "Gynecology",
      description: "Specialized women's health services.",
      iconColor: "bg-blue-600"
    },
    {
      icon: User,
      title: "Cosmetic",
      description: "Aesthetic procedures for a new you.",
      iconColor: "bg-blue-700"
    },
    {
      icon: Scale,
      title: "Weight Loss",
      description: "Effective bariatric surgery options.",
      iconColor: "bg-blue-600"
    },
    {
      icon: Hospital,
      title: "Liver Transplant",
      description: "Liver transplant procedures of varying complexity.",
      iconColor: "bg-blue-700"
    },
    {
      icon: Droplet,
      title: "Kidney Transplant",
      description: "Expert renal care and transplants.",
      iconColor: "bg-blue-600"
    },
    {
      icon: Bone,
      title: "Bone Marrow",
      description: "Bone marrow transplant options for matched and non matched donors",
      iconColor: "bg-blue-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-main mb-4">
            Multi-Specialty Focus
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            We cover all medical needs, from hair transplants to heart transplants.
          </p>
        </div>

        {/* Specialty Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {specialties.map((specialty, index) => (
            <SpecialtyCard
              key={index}
              icon={specialty.icon}
              title={specialty.title}
              description={specialty.description}
              iconColor={specialty.iconColor}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 w-full sm:w-auto">
            Need Assistance?
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiSpecialtyFocus;