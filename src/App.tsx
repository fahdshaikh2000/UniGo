import React, { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./pages/dashboard";
import FindRide from "./pages/find-ride";
import CreateRide from "./pages/create-ride";
import Profile from "./pages/profile";
import RideDetails from "./pages/ride-details/[id]";
import ProtectedRoute from "./components/ProtectedRoute";
import routes from "tempo-routes";

const ChatPage = lazy(() => import("./pages/ride-details/ChatPage"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
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
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </Suspense>
  );
}

export default App;
