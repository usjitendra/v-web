import React, { useEffect, useState } from 'react';
import {
  Brain, Heart, Users, Activity, Moon, Zap, Coffee,
  RefreshCw, Pill, Phone, Mail, Clock, Briefcase,
  ChevronRight, Shield,
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import img1 from "../assets/specialty/consuling.jpg";
import img2 from '../assets/specialty/psychotriy.jpg';
import img3 from '../assets/specialty/Therapies.jpg';
import ServiceBreadCrumbs from '@/components/ServiceBreadcums';

/* ─── DATA ─── */
const treatments = [
  {
    title: "Depression",
    icon: <Zap className="w-5 h-5 text-white" />,
    symptoms: ["Persistent sadness", "Loss of interest", "Fatigue", "Changes in appetite", "Feelings of worthlessness"],
    longDescription: "Depression is a mood disorder that impacts how one thinks, feels, and behaves. Our multidisciplinary approach helps individuals regain emotional balance through medication and psychotherapy."
  },
  {
    title: "Anxiety Disorders",
    icon: <Activity className="w-5 h-5 text-white" />,
    symptoms: ["Excessive worry", "Restlessness", "Difficulty concentrating", "Sleep disturbances", "Panic attacks"],
    longDescription: "Anxiety disorders involve persistent fear or worry. We offer personalized therapy, medication, and lifestyle strategies to support recovery and reduce anxiety."
  },
  {
    title: "Substance Use Disorders",
    icon: <Coffee className="w-5 h-5 text-white" />,
    symptoms: ["Compulsive drug seeking", "Withdrawal symptoms", "Tolerance development", "Physical dependence", "Social withdrawal"],
    longDescription: "We treat substance abuse issues using a tailored plan that includes counseling, group therapy, and relapse prevention strategies for long-term recovery."
  },
  {
    title: "Obsessive Compulsive Disorder",
    icon: <RefreshCw className="w-5 h-5 text-white" />,
    symptoms: ["Intrusive thoughts", "Repetitive behaviors", "Excessive cleaning", "Checking rituals", "Arranging items symmetrically"],
    longDescription: "We use evidence-based therapy like ERP (Exposure and Response Prevention) and SSRIs to treat OCD symptoms effectively and compassionately."
  },
  {
    title: "Sleep Disorders",
    icon: <Moon className="w-5 h-5 text-white" />,
    symptoms: ["Difficulty falling asleep", "Waking during the night", "Excessive daytime sleepiness", "Irregular sleep patterns", "Sleep-related breathing issues"],
    longDescription: "Improving sleep through CBT-I, sleep hygiene education, and medical support when necessary to restore healthy rest patterns."
  },
  {
    title: "Psychotic Disorders",
    icon: <Brain className="w-5 h-5 text-white" />,
    symptoms: ["Hallucinations", "Delusions", "Disorganized thinking", "Social withdrawal", "Lack of motivation"],
    longDescription: "We provide integrated services including pharmacological and psychosocial support for psychotic conditions with compassionate long-term care."
  },
  {
    title: "Drug Deaddiction",
    icon: <Zap className="w-5 h-5 text-white" />,
    symptoms: ["Cravings", "Physical dependence", "Behavioral changes", "Neglect of responsibilities", "Withdrawal symptoms"],
    longDescription: "We offer detox programs, counseling, relapse prevention plans, and support groups for lasting recovery from drug addiction."
  },
  {
    title: "Mixed Anxiety & Sexual Disorder",
    icon: <Activity className="w-5 h-5 text-white" />,
    symptoms: ["Anxiety during intimacy", "Erectile dysfunction", "Performance anxiety", "Low libido", "Intrusive thoughts"],
    longDescription: "This condition is addressed through combined therapy for anxiety and sexual health education, along with medical treatment if needed."
  },
  {
    title: "Suicidal Thoughts",
    icon: <Brain className="w-5 h-5 text-white" />,
    symptoms: ["Hopelessness", "Talking about death", "Withdrawal", "Mood swings", "Feeling trapped"],
    longDescription: "Our doctors provide immediate risk assessment, therapy, and safety planning to support those at risk of suicide with empathy and urgency."
  },
  {
    title: "Schizophrenia",
    icon: <RefreshCw className="w-5 h-5 text-white" />,
    symptoms: ["Hallucinations", "Paranoia", "Disorganized behavior", "Flat affect", "Cognitive issues"],
    longDescription: "A chronic mental illness treated with a structured plan involving medication, therapy, and family support for improved quality of life."
  },
  {
    title: "Postpartum Depression",
    icon: <Moon className="w-5 h-5 text-white" />,
    symptoms: ["Crying spells", "Mood swings", "Difficulty bonding", "Insomnia", "Hopelessness"],
    longDescription: "Postpartum depression is addressed through therapy, medication, and family support to ensure both mother and child are well cared for."
  },
  {
    title: "Lack of Sleep",
    icon: <Moon className="w-5 h-5 text-white" />,
    symptoms: ["Daytime fatigue", "Irritability", "Poor concentration", "Headaches", "Mood swings"],
    longDescription: "We provide sleep assessments, behavioral techniques, and lifestyle strategies to restore healthy sleep patterns effectively."
  },
];

const therapies = [
  {
    title: "Family Counseling",
    icon: <Users className="w-5 h-5 text-white" />,
    benefits: ["Improved communication", "Conflict resolution", "Strengthened relationships", "Understanding family roles", "Supportive environment"],
    longDescription: "Family counseling helps family members improve communication and resolve conflicts. It is useful for addressing behavioral problems, family transitions, or mental health concerns."
  },
  {
    title: "Career Counseling",
    icon: <Briefcase className="w-5 h-5 text-white" />,
    benefits: ["Clarity on career options", "Skill and interest assessment", "Career goal setting", "Reduced confusion", "Increased motivation"],
    longDescription: "Career counseling involves exploring interests, strengths, and values to help individuals choose a career path aligned with personal and professional goals."
  },
  {
    title: "Marital Counseling",
    icon: <Heart className="w-5 h-5 text-white" />,
    benefits: ["Better communication", "Conflict resolution", "Enhanced intimacy", "Mutual understanding", "Relationship satisfaction"],
    longDescription: "Marital counseling helps couples identify issues, improve communication, and resolve conflict for stronger, more fulfilling relationships."
  },
  {
    title: "Drug De-addiction Counseling",
    icon: <Pill className="w-5 h-5 text-white" />,
    benefits: ["Understanding addiction", "Coping strategies", "Relapse prevention", "Family involvement", "Improved well-being"],
    longDescription: "Drug de-addiction counseling offers a structured path to recovery focusing on identifying triggers, managing cravings, and building a sustainable healthy lifestyle."
  },
  {
    title: "Sex Counseling",
    icon: <Heart className="w-5 h-5 text-white" />,
    benefits: ["Improved intimacy", "Better communication", "Understanding sexual concerns", "Reduced anxiety", "Healthier relationships"],
    longDescription: "Sex counseling helps individuals and couples address concerns related to intimacy and sexual performance in a safe and supportive environment."
  },
];

const therapyTypes = [
  {
    title: "Cognitive Behavioral Therapy (CBT)",
    benefits: ["Effective for depression, anxiety, PTSD, and phobias", "Focuses on current problems rather than past issues", "Teaches practical coping skills and strategies", "Usually shorter-term than other therapies"],
    description: "A structured, goal-oriented therapy that helps you identify and change negative thought patterns and behaviors. CBT is based on the concept that your thoughts, feelings, and actions are interconnected."
  },
  {
    title: "Psychotherapy",
    benefits: ["Treats a wide range of mental health conditions", "Improves communication and interpersonal skills", "Helps process trauma and difficult emotions", "Provides insight into patterns and triggers"],
    description: "Also known as talk therapy, psychotherapy encompasses techniques for treating mental health problems by talking with a qualified professional who helps you understand your feelings and behaviors."
  },
  {
    title: "Aversion Therapy",
    benefits: ["Can help reduce addictive behaviors", "Effective for specific compulsive behaviors", "Often used as part of a comprehensive treatment plan", "Can produce results in a relatively short time frame"],
    description: "A form of behavioral treatment that aims to reduce unwanted behaviors. This therapy is primarily used to treat certain addictions, substance abuse disorders, and harmful habits."
  },
  {
    title: "Dialectical Behavior Therapy (DBT)",
    benefits: ["Effective for borderline personality disorder", "Helps with emotional dysregulation", "Teaches practical mindfulness and coping skills", "Improves interpersonal relationships"],
    description: "A modified form of CBT that teaches skills to manage painful emotions. DBT focuses on mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness."
  },
  {
    title: "Family Therapy",
    benefits: ["Improves family communication patterns", "Addresses family roles and behavior patterns", "Helps families navigate major life transitions", "Builds stronger family support systems"],
    description: "A form of psychotherapy that helps family members improve communication and resolve conflicts. It views problems in the context of the family unit and emphasizes relationships."
  },
  {
    title: "Group Therapy",
    benefits: ["Creates a supportive community atmosphere", "Provides multiple perspectives on problems", "Improves social skills through interaction", "Reduces feelings of isolation and loneliness"],
    description: "Involves one or more therapists working with several individuals simultaneously. Members receive support from peers facing similar challenges while learning from shared experiences."
  },
];

const TABS = [
  { id: "treatments", label: "Psychiatry Treatment" },
  { id: "counselling", label: "Counselling Services" },
  { id: "therapies", label: "Therapies" },
];

/* ─── Reusable card ─── */
const ServiceCard = ({ title, icon, description, listTitle, listItems }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
    {/* Card header */}
    <div className="bg-gradient-to-r from-teal-700 to-cyan-600 px-5 py-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <h3 className="text-base font-bold text-white leading-tight">{title}</h3>
    </div>
    {/* Card body */}
    <div className="p-5 flex-1 flex flex-col">
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
      <div className="mt-auto">
        <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">{listTitle}</p>
        <ul className="space-y-1.5">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

/* ─── Featured split banner ─── */
const FeaturedBanner = ({ title, body, img, imgAlt, reverse = false }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8 flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}>
    <div className="md:w-1/2 bg-gradient-to-br from-teal-700 to-cyan-600 p-6 sm:p-8 text-white flex flex-col justify-center">
      <h3 className="text-xl font-bold mb-4 leading-tight">{title}</h3>
      {body.map((para, i) => (
        <p key={i} className="text-teal-50 text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
      ))}
    </div>
    <div className="md:w-1/2 min-h-[220px]">
      <img src={img} alt={imgAlt} className="w-full h-full object-cover" />
    </div>
  </div>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function PsychiatricServicesDetails() {
  const [activeTab, setActiveTab] = useState('treatments');
  const location = useLocation();
  const { name } = useParams();
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/service/${tab}`);
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    setActiveTab(name);
    if (location.pathname === `/service/${name}`) window.scrollTo(0, 0);
  }, [name, location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Psychiatric Services | Comprehensive Mental Health Care</title>
        <meta name="description" content="Personalized mental health care with evidence-based psychiatric treatments, counseling, and therapies tailored to your unique needs." />
      </Helmet>

      <ServiceBreadCrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Services', path: '/services' },
          { label: 'Psychiatric' },
        ]}
        headText="Psychiatric Services"
      />

      {/* ══════════════════════════════
          HERO BANNER
      ══════════════════════════════ */}
      <div className="relative overflow-hidden">
        <img src={img1} alt="Mental health support" className="w-full object-cover h-64 sm:h-80 md:h-96" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/75 to-cyan-700/60" />
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <Brain className="w-4 h-4 text-teal-200" />
            <span className="text-sm font-medium text-teal-50 tracking-wide">Mental Health Care</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 leading-tight tracking-tight max-w-2xl">
            Comprehensive Psychiatric Services
          </h1>
          <p className="text-teal-100 max-w-xl text-sm sm:text-base leading-relaxed mb-6">
            Personalized care for mental health and wellbeing with evidence-based treatments by experienced professionals.
          </p>
          <button
            onClick={() => navigate("/appoitment")}
            className="px-7 py-3 bg-white text-teal-700 font-bold rounded-xl hover:bg-teal-50 transition shadow-md text-sm active:scale-[0.98]"
          >
            Schedule a Consultation
          </button>
        </div>
      </div>

      {/* ══════════════════════════════
          QUICK STATS BAR
      ══════════════════════════════ */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: <Shield className="w-4 h-4 text-teal-600" />, label: "Accredited", value: "NABH Certified" },
              { icon: <Brain className="w-4 h-4 text-teal-600" />, label: "Conditions", value: "12+ Treated" },
              { icon: <Users className="w-4 h-4 text-teal-600" />, label: "Patients", value: "500+ Helped" },
              { icon: <Clock className="w-4 h-4 text-teal-600" />, label: "Availability", value: "Mon – Sun" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-4 sm:py-5">
                <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{label}</p>
                  <p className="text-sm font-bold text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          MAIN CONTENT
      ══════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── TAB BAR ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="flex overflow-x-auto scrollbar-none">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === id
                    ? "border-teal-600 text-teal-700 bg-teal-50/60"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════
            TAB: TREATMENTS
        ══════════════════════════════ */}
        {activeTab === 'treatments' && (
          <div>
            {/* Section header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                <Brain className="w-3.5 h-3.5" /> Psychiatry
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Psychiatry Treatment</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Our experienced psychiatrists and therapists provide evidence-based treatment for a wide range of psychiatric conditions, tailored to your unique needs.
              </p>
            </div>

            {/* Featured banner */}
            <FeaturedBanner
              title="Understanding Mental Health Conditions"
              body={[
                "Mental health conditions affect your thinking, feeling, mood, and behavior in ways that influence your ability to relate to others and function in daily life.",
                "With proper diagnosis and treatment, many individuals learn to cope or recover. Our comprehensive treatment approaches are tailored to each individual's needs.",
                "If you're experiencing symptoms that concern you, reaching out for professional help is an important first step toward recovery.",
              ]}
              img={img2}
              imgAlt="Mental health treatment"
            />

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {treatments.map((t, i) => (
                <ServiceCard
                  key={i}
                  title={t.title}
                  icon={t.icon}
                  description={t.longDescription}
                  listTitle="Common Symptoms"
                  listItems={t.symptoms}
                />
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════
            TAB: COUNSELLING
        ══════════════════════════════ */}
        {activeTab === 'counselling' && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                <Heart className="w-3.5 h-3.5" /> Counselling
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Our Counselling Services</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                We provide personalized counseling services to support individuals through emotional, psychological, and life challenges with qualified, compassionate counselors.
              </p>
            </div>

            <FeaturedBanner
              title="The Value of Counseling Support"
              body={[
                "Counseling offers a safe and confidential space where you can express your concerns freely with a trained professional who listens with empathy and without judgment.",
                "Our counselors utilize evidence-based approaches tailored to your individual circumstances — whether anxiety, depression, or relationship difficulties.",
                "No matter where you are on your journey, our counseling services guide you toward emotional well-being and greater self-awareness.",
              ]}
              img={img1}
              imgAlt="Counseling services"
              reverse
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {therapies.map((t, i) => (
                <ServiceCard
                  key={i}
                  title={t.title}
                  icon={t.icon}
                  description={t.longDescription}
                  listTitle="Key Benefits"
                  listItems={t.benefits}
                />
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════
            TAB: THERAPIES
        ══════════════════════════════ */}
        {activeTab === 'therapies' && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                <RefreshCw className="w-3.5 h-3.5" /> Therapies
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Therapies</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                We provide a range of evidence-based therapies designed to support various mental health needs. Our skilled therapists collaborate with you to choose the most suitable path.
              </p>
            </div>

            <FeaturedBanner
              title="Personalized Therapeutic Journeys"
              body={[
                "Our therapy services encompass a wide range of evidence-based approaches designed to support your mental and emotional well-being.",
                "Each therapy is tailored to your individual needs, ensuring you receive the most appropriate and impactful care from licensed therapists.",
                "Therapy is more than treatment — it's a journey toward self-awareness, healing, and lasting growth. We're here every step of the way.",
              ]}
              img={img3}
              imgAlt="Therapies"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {therapyTypes.map((t, i) => (
                <ServiceCard
                  key={i}
                  title={t.title}
                  icon={<Brain className="w-5 h-5 text-white" />}
                  description={t.description}
                  listTitle="Key Benefits"
                  listItems={t.benefits}
                />
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════
            CONTACT / CTA SECTION
        ══════════════════════════════ */}
        <div className="mt-14">
          {/* Teal CTA banner */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
            <div className="relative z-10">
              <p className="text-white font-extrabold text-xl sm:text-2xl leading-tight">Ready to Begin Your Recovery?</p>
              <p className="text-teal-100 text-sm mt-1.5 max-w-sm">
                Book a consultation with our experienced psychiatrists and start your journey toward better mental health today.
              </p>
            </div>
            <button
              onClick={() => navigate("/appoitment")}
              className="flex-shrink-0 flex items-center gap-2 px-7 py-3 bg-white text-teal-700 font-bold rounded-xl hover:bg-teal-50 transition shadow-sm text-sm active:scale-[0.98] relative z-10"
            >
              Book Appointment
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Contact cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Phone */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4 hover:border-teal-300 hover:shadow-md transition">
              <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>

                <a href="tel:9354799090" className="block text-sm font-semibold text-gray-800 hover:text-teal-600">
                  +91 93547 99090
                </a>
                <a href="tel:9354799090" className="block text-sm font-semibold text-gray-800 hover:text-teal-600 mt-0.5">
                  +91 93547 99090
                </a>
              </div>
            </div>

            {/* Email */}
<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4 hover:border-teal-300 hover:shadow-md transition">
  <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
    <Mail className="w-5 h-5 text-teal-600" />
  </div>
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>

    <a href="mailto:info@medicwaycare.in" className="block text-sm font-semibold text-gray-800 hover:text-teal-600">
      info@medicwaycare.in
    </a>
    <a href="mailto:support@medicwaycare.in" className="block text-sm font-semibold text-gray-800 hover:text-teal-600 mt-0.5">
      support@medicwaycare.in
    </a>
  </div>
</div>
            {/* Hours */}
<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4 hover:border-teal-300 hover:shadow-md transition">
  <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
    <Clock className="w-5 h-5 text-teal-600" />
  </div>
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Address</p>

    <p className="text-sm font-medium text-gray-700 leading-relaxed">
      MR-1, 5th Floor, Wing-A, Statesman House <br />
      148 Barakhamba Road, New Delhi 110001
    </p>

    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-3 mb-1">
      Business Hours
    </p>

    <p className="text-sm text-gray-700">Mon–Fri: 9:00 AM – 6:00 PM</p>
    <p className="text-sm text-gray-700">Sat: 9:00 AM – 2:00 PM</p>
    <p className="text-sm text-gray-700">Sun: Emergency Only</p>
  </div>
</div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}