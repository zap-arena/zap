import { useRef } from "react";
import Navbar from "../components/Navbar";
import HomeHeroSection from "../components/home/HeroSection";
import HomeStatsBar from "../components/home/StatsBar";
import HomeProgramsSection from "../components/home/ProgramsSection";
import HomeDSASection from "../components/home/DSASection";
import HomeContactSection from "../components/home/ContactSection";
import HomeMouseFX from "../components/home/MouseFX";
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

