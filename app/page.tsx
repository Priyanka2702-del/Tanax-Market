import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyChoose from "@/components/WhyChoose";
import Markets from "@/components/Markets";
import Accounts from "@/components/Accounts";
import Platforms from "@/components/Platforms";
import Tools from "@/components/Tools";
import PaymentMethods from "@/components/PaymentMethods";
import Testimonials from "@/components/Testimonials";
import Steps from "@/components/Steps";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyChoose />
        <Markets />
        <Accounts />
        <Platforms />
        <Tools />
                <PaymentMethods />
        <Testimonials />
        <Steps />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
