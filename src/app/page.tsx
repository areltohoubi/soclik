import { BenefitsAndCTA } from "@/components/landing/BenefitsAndCTA";
import { Differentiation } from "@/components/landing/Differentiation";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { PainPoints } from "@/components/landing/PainPoints";
import { Testimonials } from "@/components/landing/Testimonials";
import { UseCases } from "@/components/landing/UseCases";
import { VisualProof } from "@/components/landing/VisualProof";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <PainPoints />
      <HowItWorks />
      <VisualProof />
      <Differentiation />
      <UseCases />
      <BenefitsAndCTA />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
