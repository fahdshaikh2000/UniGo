import React from "react";

const UserTestimonialCollage = () => {
  return (
    <div className="w-full py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Real Stories from Our Users
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-lg shadow-md aspect-[4/3]">
            <img
              src="/images/carpooling-1.jpg"
              alt="University students carpooling"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-md aspect-[4/3]">
            <img
              src="/images/carpooling-2.jpg"
              alt="University students carpooling"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-md aspect-[4/3]">
            <img
              src="/images/carpooling-3.jpg"
              alt="University students carpooling"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-md aspect-[4/3]">
            <img
              src="/images/carpooling-4.jpg"
              alt="University students carpooling"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-600 italic">
            "Join thousands of university students across Pakistan who are
            making their commutes more affordable, eco-friendly, and social!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserTestimonialCollage;
