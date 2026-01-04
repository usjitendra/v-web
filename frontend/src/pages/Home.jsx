import Hero from "../components/Hero";
import Blog from "../components/home/Blog";
import FAQ from "../components/home/FAQ";
import OurServices from "../components/home/OurServices";
import PatientOpinions from "../components/home/PatientOpinions";
import ProcessFlow from "../components/home/ProcessFlow";
import HospitalCarousel from "../components/HospitalCarousel";
import ProcedureCost from "../components/ProcedureCost";
import Services from "../components/Services";
import Stats from "../components/Stats";
import WhatsAppButton from "../components/WhatsAppButton";
import { useLanguage } from "../hooks/useLanguage";
import UpdatesAndBlogs from "./Home/Blog";
import Feature from "./Home/Feature";
import HeroSection from "./Home/HeroSection";
import HomeAbout from "./Home/HomeAbout";
import HowWeWork from "./Home/HowWeWork";
import MultiSpecialtyFocus from "./Home/MutiSpecality";
import ServicesSection from "./Home/OurService";
import WhyWe from "./Home/WhyWe";

export default function Home() {
  const [language] = useLanguage();


  return (
    <div>
      {/* <Hero /> */}
      <HeroSection/>
      <HomeAbout/>

      {/* Services */}
{/* 
      <Stats /> */}

      {/* <Services /> */}

      <MultiSpecialtyFocus/>

      <Feature/>

      {/* <HospitalCarousel /> */}

      <ServicesSection/>

      <HowWeWork/>
      <WhyWe/>

      {/* <ProcedureCost /> */}
      {/* <WhatsAppButton /> */}

      {/* <ProcessFlow /> */}
      {/* <WhatsAppButton /> */}
      {/* <OurServices /> */}
      {/* <WhatsAppButton /> */}
      <PatientOpinions />

      {/* <Blog /> */}
      <UpdatesAndBlogs/>

      <FAQ />
    </div>
  );
}
