"use client"
import Image from "next/image";
import Hero from "../components/hero";
import Works from "../components/how-it-works";
// import HowWorks from "../components/how-it-works";
import RdmapPreview from "../components/rdmap-preview";
import Testimonials from "../components/testimonials";
import Footer from "../components/footer";


export default function Home() {
  return (
    <div className="whole">
      <Hero />
      <Works/>
      <RdmapPreview/>
      <Testimonials/>
      <Footer/>
      
    </div>
  );
}
