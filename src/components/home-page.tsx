"use client";

import Hero from "./hero";
import Works from "./how-it-works";
import RdmapPreview from "./rdmap-preview";
import Testimonials from "./testimonials";
import Footer from "./footer";

export default function HomePage() {
  return (
    <div className="whole">
      <Hero />
      <Works />
      <RdmapPreview />
      <Testimonials />
      <Footer />
    </div>
  );
}
