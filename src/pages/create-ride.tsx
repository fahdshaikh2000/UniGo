import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Car, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CreateRideForm from "@/components/rides/CreateRideForm";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CreateRidePageProps {}

const CreateRidePage: React.FC<CreateRidePageProps> = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const { user, isAuthenticated } = useAuth();
  const [userVehicles, setUserVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [vehicleDetails, setVehicleDetails] = useState<{
    make: string;
    model: string;
    year: string;
    color: string;
    licensePlate: string;
  } | null>(null);

  // Fetch user's vehicles
  useEffect(() => {
    // In a real app, this would fetch from the database
    // For now, we'll use mock data
    const mockVehicles = [
      {
        id: "1",
        make: "Honda",
        model: "City",
        year: "2020",
        color: "White",
        licensePlate: "ABC-123",
        isDefault: true,
      },
      {
        id: "2",
        make: "Toyota",
        model: "Corolla",
        year: "2018",
        color: "Silver",
        licensePlate: "XYZ-789",
        isDefault: false,
      },
    ];

    setUserVehicles(mockVehicles);

    // Set default vehicle if available
    const defaultVehicle = mockVehicles.find((v) => v.isDefault);
    if (defaultVehicle) {
      setSelectedVehicle(defaultVehicle.id);
      setVehicleDetails({
        make: defaultVehicle.make,
        model: defaultVehicle.model,
        year: defaultVehicle.year,
        color: defaultVehicle.color,
        licensePlate: defaultVehicle.licensePlate,
      });
    }
  }, []);

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    const vehicle = userVehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      setVehicleDetails({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        licensePlate: vehicle.licensePlate,
      });
    } else {
      setVehicleDetails(null);
    }
  };

  const handleSubmit = async (data: any) => {
    if (!isAuthenticated || !user) {
      setError("You must be logged in to create a ride");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Format the data for the database
      const rideData = {
        driver_id: user.id,
        origin: data.origin,
        destination: data.destination,
        date: data.date.toISOString().split("T")[0], // Format as YYYY-MM-DD
        time: data.time,
        available_seats: data.availableSeats,
        price: data.price,
        car_model: data.carModel,
        gender_preference: data.genderPreference,
        additional_info: data.additionalInfo || null,
        status: "scheduled",
        created_at: new Date().toISOString(),
      };

      // Insert the ride into Supabase
      const { data: newRide, error: insertError } = await supabase
        .from("rides")
        .insert(rideData)
        .select();

      if (insertError) {
        throw insertError;
      }

      console.log("Ride created:", newRide);
      setIsSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error creating ride:", err);
      setError("Failed to create ride. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

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
          {userVehicles.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Car className="mr-2 h-5 w-5 text-primary" />
                Select Your Vehicle
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-select">
                    Choose a vehicle for this ride
                  </Label>
                  <Select
                    value={selectedVehicle}
                    onValueChange={handleVehicleChange}
                  >
                    <SelectTrigger id="vehicle-select" className="w-full">
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {userVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.make} {vehicle.model} ({vehicle.year}) -{" "}
                          {vehicle.licensePlate}
                          {vehicle.isDefault ? " (Default)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {vehicleDetails && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Make & Model
                        </p>
                        <p className="text-sm">
                          {vehicleDetails.make} {vehicleDetails.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Year
                        </p>
                        <p className="text-sm">{vehicleDetails.year}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Color
                        </p>
                        <p className="text-sm">{vehicleDetails.color}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          License Plate
                        </p>
                        <p className="text-sm">{vehicleDetails.licensePlate}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      These details will be visible to passengers
                    </p>
                  </div>
                )}

                <div className="text-sm text-blue-600">
                  <a href="/profile" className="hover:underline">
                    Manage your vehicles in profile settings
                  </a>
                </div>
              </div>
            </div>
          )}

          <CreateRideForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            initialCarModel={
              vehicleDetails
                ? `${vehicleDetails.make} ${vehicleDetails.model} (${vehicleDetails.year})`
                : ""
            }
          />
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

        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Sharing Your Ride
          </h3>
          <p className="text-gray-700 mb-4">
            You can share this link with your friends to let them book your
            ride:
          </p>
          <div className="bg-white p-3 rounded border flex items-center justify-between">
            <code className="text-sm text-gray-800">
              {window.location.origin}/find-ride
            </code>
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/find-ride`,
                );
                alert("Link copied to clipboard!");
              }}
            >
              Copy Link
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Your friends will need to create an account to book the ride.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateRidePage;
