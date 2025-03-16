import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Car,
  Clock,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import MapSelector from "./MapSelector";

const formSchema = z.object({
  origin: z.string().min(3, { message: "Origin is required" }),
  destination: z.string().min(3, { message: "Destination is required" }),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  availableSeats: z.number().min(1).max(8),
  genderPreference: z.enum(["any", "male", "female"]),
  price: z.number().min(1),
  carModel: z.string().min(3, { message: "Car model is required" }),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateRideFormProps {
  onSubmit?: (data: FormValues) => void;
  isSubmitting?: boolean;
  initialCarModel?: string;
}

const CreateRideForm = ({
  onSubmit = () => {},
  isSubmitting = false,
  initialCarModel = "",
}: CreateRideFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      time: "",
      availableSeats: 3,
      genderPreference: "any",
      price: 5,
      carModel: initialCarModel || "",
      additionalInfo: "",
    },
  });

  // Set initial car model when prop changes
  useEffect(() => {
    if (initialCarModel) {
      setValue("carModel", initialCarModel);
    }
  }, [initialCarModel, setValue]);

  const availableSeats = watch("availableSeats");
  const price = watch("price");

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setValue("date", selectedDate);
    }
  };

  const handleMapSelection = (origin: string, destination: string) => {
    setValue("origin", origin);
    setValue("destination", destination);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-md">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Create a Ride
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Share your journey with fellow students and split the costs
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex flex-col items-center ${currentStep >= step ? "text-primary" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= step ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  {step}
                </div>
                <span className="text-sm">
                  {step === 1 ? "Route" : step === 2 ? "Details" : "Review"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Select Route
                </h3>

                <MapSelector onLocationSelect={handleMapSelection} />

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div>
                    <Label htmlFor="origin">Pickup Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="origin"
                        placeholder="Enter pickup location"
                        className="pl-10"
                        {...register("origin")}
                      />
                    </div>
                    {errors.origin && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.origin.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="destination"
                        placeholder="Enter destination"
                        className="pl-10"
                        {...register("destination")}
                      />
                    </div>
                    {errors.destination && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.destination.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Schedule
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">
                        Date is required
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="time">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="time"
                        type="time"
                        className="pl-10"
                        {...register("time")}
                      />
                    </div>
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.time.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button type="button" onClick={nextStep}>
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Car className="mr-2 h-5 w-5 text-primary" />
                  Vehicle Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="carModel">Car Model</Label>
                    <div className="relative">
                      <Car className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="carModel"
                        placeholder="e.g. Toyota Prius 2018"
                        className="pl-10"
                        {...register("carModel")}
                      />
                    </div>
                    {errors.carModel && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.carModel.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Passenger Preferences
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="availableSeats">Available Seats</Label>
                    <div className="pt-6 pb-2">
                      <Slider
                        defaultValue={[availableSeats]}
                        max={8}
                        min={1}
                        step={1}
                        onValueChange={(value) =>
                          setValue("availableSeats", value[0])
                        }
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>1</span>
                      <span className="font-medium text-primary">
                        {availableSeats} seats
                      </span>
                      <span>8</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="genderPreference">Gender Preference</Label>
                    <RadioGroup
                      defaultValue="any"
                      onValueChange={(value) =>
                        setValue(
                          "genderPreference",
                          value as "any" | "male" | "female",
                        )
                      }
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="any" id="any" />
                        <Label htmlFor="any">Any</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-primary" />
                  Pricing
                </h3>

                <div>
                  <Label htmlFor="price">Price per Passenger (PKR)</Label>
                  <div className="pt-6 pb-2">
                    <Slider
                      defaultValue={[price]}
                      max={20}
                      min={1}
                      step={0.5}
                      onValueChange={(value) => setValue("price", value[0])}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>PKR 100</span>
                    <span className="font-medium text-primary">
                      PKR {price.toFixed(0)}
                    </span>
                    <span>PKR 2000</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">
                  Additional Information
                </h3>
                <Textarea
                  placeholder="Any additional details about the ride..."
                  className="min-h-[100px]"
                  {...register("additionalInfo")}
                />
              </div>

              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous Step
                </Button>
                <Button type="button" onClick={nextStep}>
                  Review Ride
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Review Your Ride</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Route</h4>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">From</p>
                          <p className="text-sm text-gray-600">
                            {watch("origin") || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">To</p>
                          <p className="text-sm text-gray-600">
                            {watch("destination") || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Schedule</h4>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-gray-500" />
                        <p className="text-sm">
                          {date ? format(date, "PPP") : "Not specified"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <p className="text-sm">
                          {watch("time") || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Vehicle</h4>
                      <div className="flex items-center space-x-2">
                        <Car className="h-5 w-5 text-gray-500" />
                        <p className="text-sm">
                          {watch("carModel") || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">
                        Passenger Details
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-gray-500" />
                        <p className="text-sm">
                          {watch("availableSeats")} available seats
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm">
                          Gender preference: {watch("genderPreference")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="font-medium text-gray-700">Pricing</h4>
                    <div className="flex items-center space-x-2 mt-2">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                      <p className="text-sm">
                        PKR {watch("price").toFixed(0)} per passenger
                      </p>
                    </div>
                  </div>

                  {watch("additionalInfo") && (
                    <div className="pt-2">
                      <h4 className="font-medium text-gray-700">
                        Additional Information
                      </h4>
                      <p className="text-sm mt-2">{watch("additionalInfo")}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous Step
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Publish Ride"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateRideForm;
