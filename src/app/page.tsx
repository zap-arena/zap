export const metadata: Metadata = {
  title: "ZAP - Interactive DSA Learning Platform | Compete & Master Algorithms",
  description:
    "Learn Data Structures & Algorithms with interactive challenges, live contests, and AI-guided paths. Practice coding problems and compete with the community.",
  openGraph: {
    title: "ZAP - Interactive DSA Learning Platform",
    description:
      "Master DSA with interactive visualization, coding challenges, and contests.",
    type: "website",
    url: "https://codezap.in",
  },
}
export const revalidate = 86400

"use client"

import { useRef } from "react";
import HomeContactSection from "@/components/home/ContactSection";
import HomeDSASection from "@/components/home/DSASection";
import HomeHeroSection from "@/components/home/HeroSection";
import HomeMouseFX from "@/components/home/MouseFX";
import HomeProgramsSection from "@/components/home/ProgramsSection";
import HomeStatsBar from "@/components/home/StatsBar";
import Navbar from "@/components/Navbar";
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
