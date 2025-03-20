import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./pages/dashboard";
import FindRide from "./pages/find-ride";
import CreateRide from "./pages/create-ride";
import Profile from "./pages/profile";
import RideDetails from "./pages/ride-details/[id]";
import FeatureRoadmap from "./pages/feature-roadmap";
import WaitlistPage from "./pages/waitlist";
import AdminWaitlistPage from "./pages/admin/waitlist";
import ProtectedRoute from "./components/ProtectedRoute";
import routes from "tempo-routes";

const ChatPage = lazy(() => import("./pages/ride-details/ChatPage"));

function App() {
  // Use the useRoutes hook for Tempo routes
  const tempoRoutesElement =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3">Loading...</span>
        </div>
      }
    >
      {/* Render tempo routes if in Tempo environment */}
      {tempoRoutesElement}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="/admin/waitlist" element={<AdminWaitlistPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-ride"
          element={
            <ProtectedRoute>
              <FindRide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-ride"
          element={
            <ProtectedRoute>
              <CreateRide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feature-roadmap"
          element={
            <ProtectedRoute>
              <FeatureRoadmap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ride-details/:id"
          element={
            <ProtectedRoute>
              <RideDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ride-details/:id/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Tempo routes handling */}
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={<div />} />
        )}

        {/* Add a catch-all route to handle 404s */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <p className="text-gray-600 mb-6">
                The page you are looking for doesn't exist or has been moved.
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                Go Home
              </button>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
