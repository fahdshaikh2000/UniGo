import React, { useState } from "react";
import { Navbar, Footer } from "@/components/layout";
import Hero from "@/components/home/Hero";
import FeatureHighlights from "@/components/home/FeatureHighlights";
import AuthModal from "@/components/auth/AuthModal";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "login",
  );

  const handleLoginClick = () => {
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthModalTab("register");
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
      <main className="flex-grow">
        <Hero
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
        />
        <FeatureHighlights />
      </main>
      <Footer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </div>
  );
}
