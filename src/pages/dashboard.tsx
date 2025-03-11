import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RideCards from "@/components/dashboard/RideCards";
import QuickActions from "@/components/dashboard/QuickActions";
import EcoBadges from "@/components/dashboard/EcoBadges";
import UserPhotoGallery from "@/components/dashboard/UserPhotoGallery";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCreateRide = () => {
    navigate("/create-ride");
  };

  const handleFindRide = () => {
    navigate("/find-ride");
  };

  const handleRequestRide = (id: string) => {
    navigate(`/ride-details/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4 space-y-6">
        <DashboardHeader
          userName="Fahd Niaz Shaikh"
          onCreateRide={handleCreateRide}
          onFindRide={handleFindRide}
        />

        <QuickActions
          onCreateRide={handleCreateRide}
          onFindRide={handleFindRide}
          userName="Fahd"
        />

        <RideCards onRequestRide={handleRequestRide} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EcoBadges />
          <UserPhotoGallery />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
