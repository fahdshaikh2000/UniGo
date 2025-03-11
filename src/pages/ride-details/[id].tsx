import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RideInfo from "@/components/rides/RideInfo";
import RideChat from "@/components/rides/RideChat";
import RideTracking from "@/components/rides/RideTracking";

interface RideDetailsProps {
  rideId?: string;
}

const RideDetails = ({ rideId: propRideId }: RideDetailsProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const rideId = propRideId || params.id || "ride-123";
  const [activeTab, setActiveTab] = useState("details");
  const [rideStatus, setRideStatus] = useState<
    "scheduled" | "in-progress" | "completed" | "cancelled"
  >("scheduled");

  // Mock data for the ride
  const rideData = {
    id: rideId,
    status: rideStatus,
    driverName: "Fahd Niaz Shaikh",
    driverAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fahd",
    driverRating: 4.8,
    driverPhone: "(555) 123-4567",
    passengers: [
      {
        id: "p1",
        name: "Fatima Akhtar",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
        rating: 4.7,
      },
      {
        id: "p2",
        name: "Ali Ahmed",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ali",
        rating: 4.9,
      },
    ],
    origin: "LUMS Campus, Main Building",
    destination: "Packages Mall, Walton Road",
    date: "May 15, 2023",
    time: "3:30 PM",
    estimatedDuration: "25 mins",
    estimatedDistance: "8.5 miles",
    availableSeats: 3,
    price: 500,
    carModel: "Honda City",
    carColor: "White",
    licensePlate: "LEJ-1234",
    safetyFeatures: [
      "University ID Verified",
      "Dashcam Enabled",
      "Trip Sharing",
    ],
  };

  // Handlers for ride actions
  const handleStartRide = () => {
    setRideStatus("in-progress");
    setActiveTab("tracking");
  };

  const handleEndRide = () => {
    setRideStatus("completed");
    setActiveTab("details");
  };

  const handleCancelRide = () => {
    setRideStatus("cancelled");
  };

  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message);
    // In a real app, this would send the message to the backend
  };

  const handleSendSOS = () => {
    console.log("SOS signal sent");
    // In a real app, this would trigger an emergency alert
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ride Details</h1>
        <p className="text-gray-600">ID: {rideId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <RideInfo
                {...rideData}
                onStartRide={handleStartRide}
                onEndRide={handleEndRide}
                onCancelRide={handleCancelRide}
                onSendSOS={handleSendSOS}
              />
            </TabsContent>

            <TabsContent value="tracking" className="mt-4">
              <RideTracking
                rideId={rideId}
                driverName={rideData.driverName}
                passengerName="You"
                origin={rideData.origin}
                destination={rideData.destination}
                estimatedArrival="3:45 PM"
                currentLocation="Ferozepur Road, Lahore"
                progress={65}
                onSendSOS={handleSendSOS}
              />
            </TabsContent>

            <TabsContent value="chat" className="mt-4">
              <RideChat rideId={rideId} onSendMessage={handleSendMessage} />
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/ride-details/${rideId}/chat`)}
                >
                  Open Full Chat
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setActiveTab("details")}
              className="flex-1"
            >
              View Details
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("tracking")}
              className="flex-1"
            >
              Track Ride
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("chat")}
              className="flex-1"
            >
              Open Chat
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Ride Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">
                  {rideStatus.replace("-", " ")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{rideData.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{rideData.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">
                  PKR {rideData.price.toFixed(0)}
                </span>
              </div>
            </div>

            {rideStatus === "scheduled" && (
              <Button className="w-full mt-6" onClick={handleStartRide}>
                Start Ride
              </Button>
            )}

            {rideStatus === "in-progress" && (
              <Button className="w-full mt-6" onClick={handleEndRide}>
                End Ride
              </Button>
            )}

            {(rideStatus === "scheduled" || rideStatus === "in-progress") && (
              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={handleCancelRide}
              >
                Cancel Ride
              </Button>
            )}
          </div>

          {/* Safety information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Safety Information</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                This ride is protected by UNIGO's safety features. In case of
                emergency, use the SOS button.
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleSendSOS}
              >
                SOS Emergency
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Emergency contacts: Campus Security (555) 123-7890
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
