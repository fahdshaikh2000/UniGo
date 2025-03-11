import React from "react";
import { useParams } from "react-router-dom";
import RideChat from "@/components/rides/RideChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/ride-details/${id}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4 flex items-center"
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Ride Details
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ride Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Use this chat to communicate with all participants of this ride.
            Coordinate pickup details, share updates, or ask questions.
          </p>
        </CardContent>
      </Card>

      <div className="h-[600px]">
        <RideChat rideId={id} />
      </div>
    </div>
  );
};

export default ChatPage;
