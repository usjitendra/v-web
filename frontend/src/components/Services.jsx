import ServiceCard from "./ServiceCard";
import {
  Heart,
  Brain,
  Bone,
  Activity,
  Baby,
  User,
  Scale,
  Hospital,
  Droplet,
} from "lucide-react";

/* ===========================
   STATIC DYNAMIC DATA SOURCE
=========================== */
const specialties = [
  {
    icon: Heart,
    title: "Oncology",
    description: "Advanced cancer treatments with proven results.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Brain,
    title: "Neurosurgery",
    description:
      "The specialty of neurosurgical care includes both adult and pediatric patients.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Bone,
    title: "Spine Surgery",
    description: "Precision spine surgeries for better mobility.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Activity,
    title: "Cardiology",
    description: "World-class heart care for adults and children.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Bone,
    title: "Orthopedics",
    description:
      "Expert joint replacements and bone deformities solutions.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Baby,
    title: "IVF",
    description: "Leading fertility treatments with high success.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: User,
    title: "Gynecology",
    description: "Specialized women's health services.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: User,
    title: "Cosmetic",
    description: "Aesthetic procedures for a new you.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Scale,
    title: "Weight Loss",
    description: "Effective bariatric surgery options.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Hospital,
    title: "Liver Transplant",
    description: "Liver transplant procedures of varying complexity.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Droplet,
    title: "Kidney Transplant",
    description: "Expert renal care and transplants.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Bone,
    title: "Bone Marrow",
    description:
      "Bone marrow transplant options for matched and non-matched donors.",
    iconColor: "bg-[#008080]",
  },
];

/* ===========================
   SERVICES COMPONENT
=========================== */
export default function Services() {
  return (
    <section className="bg-sectiondiv">
      <div className="container mx-auto py-12">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-darktext mb-4">
            Our Medical Specialties
          </h2>
          <p className="text-lg text-lighttext max-w-3xl mx-auto">
            Comprehensive care across advanced medical specialties with
            world-class expertise.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 mx-auto">
          {specialties.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
