import { HeroSlider } from "./HeroSlider";
import { PopularCategories } from "./PopularCategories";
import { BestSellers } from "./BestSellers";
import { AllSeafoodSection } from "./AllSeafoodSection";
import { WhyBuyFromUs } from "./WhyBuyFromUs";

export function HomePage() {
  return (
    <>
      <HeroSlider />
      <PopularCategories />
      <BestSellers />
      <AllSeafoodSection />
      <WhyBuyFromUs />
    </>
  );
}
