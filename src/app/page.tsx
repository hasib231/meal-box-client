import RootLayout from "@/components/layout/RootLayout";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import MealPlansSection from "@/components/home/MealPlansSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <RootLayout>
      <HeroSection />
      <HowItWorksSection />
      <MealPlansSection />
      <TestimonialsSection />
      <CTASection />
    </RootLayout>
  );
}
