import { useRef } from "react";
import HomeContactSection from "../components/home/ContactSection";
import HomeDSASection from "../components/home/DSASection";
import HomeHeroSection from "../components/home/HeroSection";
import HomeMouseFX from "../components/home/MouseFX";
import HomeProgramsSection from "../components/home/ProgramsSection";
import HomeStatsBar from "../components/home/StatsBar";
import Navbar from "../components/Navbar";
import "../styles/zap-home.css";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="zap-theme relative min-h-screen">
      <Navbar />
      <HomeMouseFX containerRef={containerRef} />
      <div className="relative z-10">
        <HomeHeroSection />
        <HomeStatsBar />
        <HomeProgramsSection />
        <HomeDSASection />
        <HomeContactSection />
      </div>
    </div>
  );
}
