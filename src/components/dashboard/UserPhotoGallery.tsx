import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserPhotoGallery = () => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Community Moments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative overflow-hidden rounded-md aspect-[4/3]">
            <img
              src="/images/carpooling-1.jpg"
              alt="University students carpooling"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative overflow-hidden rounded-md aspect-[4/3]">
            <img
              src="/images/carpooling-2.jpg"
              alt="University students carpooling"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative overflow-hidden rounded-md aspect-[4/3]">
            <img
              src="/images/carpooling-3.jpg"
              alt="University students carpooling"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative overflow-hidden rounded-md aspect-[4/3]">
            <img
              src="/images/carpooling-4.jpg"
              alt="University students carpooling"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 text-center mt-3">
          Join our growing community of carpoolers across Pakistan!
        </p>
      </CardContent>
    </Card>
  );
};

export default UserPhotoGallery;
