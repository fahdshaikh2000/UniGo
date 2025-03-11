import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Users, Car, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onRegisterClick?: () => void;
  onLoginClick?: () => void;
}

const Hero = ({
  onRegisterClick = () => {},
  onLoginClick = () => {},
}: HeroProps) => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            <span className="text-primary">UNIGO</span> Pakistan <br />
            Carpooling Platform
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            Apne sathi students ke sath connect karein, rides share karein,
            costs split karein, aur apna carbon footprint kam karein. Safe,
            secure, aur sirf university students ke liye.
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button
              size="lg"
              onClick={onRegisterClick}
              className="text-md font-semibold"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onLoginClick}
              className="text-md font-semibold"
            >
              Sign In
            </Button>
          </div>

          <div className="pt-4 flex flex-wrap gap-6 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">University Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">Student Community</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-amber-600" />
              <span className="text-sm text-gray-600">Split Costs</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
            <img
              src="/images/carpooling-1.jpg"
              alt="Pakistani university students carpooling"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary/10 rounded-full -z-10"></div>
          <div className="absolute -top-6 -left-6 w-48 h-48 bg-secondary/10 rounded-full -z-10"></div>

          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Eco-friendly travel</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Safe & Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
