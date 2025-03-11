import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Car, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CreateRideForm from "@/components/rides/CreateRideForm";

interface CreateRidePageProps {}

const CreateRidePage: React.FC<CreateRidePageProps> = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Ride created:", data);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }, 1500);
  };

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
              <Car className="mr-3 h-7 w-7 text-primary" />
              Create a Ride
            </h1>
          </div>

          <p className="mt-2 text-gray-600 max-w-3xl">
            Apne sathi students ko ride offer karein aur apne safar ke kharche
            share karein. Apni ride listing banane ke liye neeche details fill
            karein.
          </p>

          <Separator className="my-6" />
        </div>

        {/* Success message */}
        {isSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center">
            <div className="bg-green-100 p-2 rounded-full mr-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-800">
                Ride Kamyabi Se Create Ho Gayi!
              </h3>
              <p className="text-green-700">
                Aap ki ride publish ho gayi hai aur ab potential passengers ko
                nazar aa rahi hai. Dashboard par redirect kiya ja raha hai...
              </p>
            </div>
          </div>
        ) : null}

        {/* Main content */}
        <div className="mb-16">
          <CreateRideForm onSubmit={handleSubmit} />
        </div>

        {/* Tips section */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-blue-800 mb-3">
            Ride Hosts Ke Liye Tips
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li>• Pickup aur drop-off points ke baare mein wazeh rahein</li>
            <li>• Ek munasib qeemat set karein jo aapke kharche cover kare</li>
            <li>• Pickups ke liye waqt par pohanchein</li>
            <li>• Apni gaari ko saaf aur acchi halat mein rakhein</li>
            <li>• App ke zariye passengers se rabta rakhein</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateRidePage;
