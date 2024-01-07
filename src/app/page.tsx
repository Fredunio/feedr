import Image from "next/image";
import Hero from "./components/layout/Hero";
import HomeMenuSection from "./components/layout/HomeMenuSection";
import HomeAboutSection from "./components/layout/HomeAboutSection";
import HomeContactSection from "./components/layout/HomeContactSection";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col page-container gap-20 py-24">
      <Hero />
      <HomeMenuSection />
      <HomeAboutSection />
      <HomeContactSection />
    </div>
  );
}
