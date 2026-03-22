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
import SEOHead from "../components/SEOHead";
import { useLanguage } from "../hooks/useLanguage";
import BlogSection from "./Home/BlogSection";
import Feature from "./Home/Feature";
import HeroSection from "./Home/HeroSection";
import HomeAbout from "./Home/HomeAbout";
import HowWeWork from "./Home/HowWeWork";
import MultiSpecialtyFocus from "./Home/MutiSpecality";
import MultiSpecialtyFocusApi from "./Home/MultiSpecialtyFocusApi";
import ServicesSection from "./Home/OurService";
import WhyWe from "./Home/WhyWe";
import CTA from "@/components/CTA";
import HeroBanner from "@/components/Banner";
import ScrollFlag from "@/components/ScrollFlag";

export default function Home() {
  const [language] = useLanguage();


  return (
    <div>
      <SEOHead pageType="home" />
      {/* <Hero /> */}
      <HeroBanner/>
      <ScrollFlag/>
         <Stats />
      {/* <HeroSection/> */}
      {/* <HomeAbout/> */}

      {/* Services */}
{/*
      <Stats /> */}

      <Services />

      {/* <MultiSpecialtyFocus/> */}

      {/* <MultiSpecialtyFocusApi/> */}

      {/* <Feature/>

      <HospitalCarousel /> */}

      {/* <ServicesSection/> */}

      {/* <HowWeWork/>
      <WhyWe/> */}

      {/* <ProcedureCost /> */}
      <WhatsAppButton />

      <CTA/>

      <ProcessFlow />
      <WhatsAppButton />
      <OurServices />
      <WhatsAppButton/>
      <PatientOpinions />

      {/* <Blog /> */}
      <BlogSection/>

      <FAQ />
    </div>
  );
}
