import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import RideFeatureRoadmap from "@/components/rides/RideFeatureRoadmap";
import PickupRadiusSelector from "@/components/rides/PickupRadiusSelector";
import TimeRangeSelector from "@/components/rides/TimeRangeSelector";
import MultipleDropoffSelector from "@/components/rides/MultipleDropoffSelector";
import VehicleManager from "@/components/profile/VehicleManager";
import VerificationUploader from "@/components/profile/VerificationUploader";
import FuelSavingsCalculator from "@/components/rides/FuelSavingsCalculator";

const FeatureRoadmapPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 text-gray-600 hover:text-gray-900"
            onClick={handleGoBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Map className="mr-3 h-7 w-7 text-primary" />
              UNIGO Feature Roadmap
            </h1>
          </div>

          <p className="mt-2 text-gray-600 max-w-3xl">
            Explore our upcoming features and improvements to make your
            carpooling experience even better.
          </p>

          <Separator className="my-6" />
        </div>

        {/* Feature Roadmap */}
        <div className="mb-12">
          <RideFeatureRoadmap />
        </div>

        {/* Feature Previews */}
        <h2 className="text-2xl font-bold mb-6">Feature Previews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <PickupRadiusSelector />
          <TimeRangeSelector />
        </div>

        <div className="mb-12">
          <MultipleDropoffSelector />
        </div>

        <div className="mb-12">
          <VehicleManager />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <VerificationUploader />
          <FuelSavingsCalculator />
        </div>

        {/* Feedback Section */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">
            We Value Your Feedback
          </h3>
          <p className="text-blue-700 mb-4">
            These features are currently in development based on user feedback.
            We'd love to hear your thoughts on which features you'd like to see
            implemented first or any other suggestions you might have.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Submit Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeatureRoadmapPage;
