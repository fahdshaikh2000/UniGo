import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: "login" | "register";
  onLoginSuccess?: () => void;
  onRegisterSuccess?: () => void;
}

const AuthModal = ({
  isOpen = true,
  onOpenChange = () => {},
  defaultTab = "login",
  onLoginSuccess = () => {},
  onRegisterSuccess = () => {},
}: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);

  const handleLoginSubmit = (values: any) => {
    console.log("Login submitted:", values);
    // In a real app, this would authenticate with a backend
    // For now, we'll just simulate a successful login
    setTimeout(() => {
      onLoginSuccess();
    }, 1000);
  };

  const handleRegisterComplete = () => {
    console.log("Registration completed");
    // In a real app, this would register with a backend
    // For now, we'll just simulate a successful registration
    setTimeout(() => {
      onRegisterSuccess();
    }, 1000);
  };

  const switchToRegister = () => {
    setActiveTab("register");
  };

  const switchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl bg-white p-0 overflow-hidden">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "register")}
        >
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="p-0">
            <LoginForm
              onSubmit={handleLoginSubmit}
              onRegisterClick={switchToRegister}
            />
          </TabsContent>
          <TabsContent value="register" className="p-0">
            <RegisterForm
              onComplete={handleRegisterComplete}
              onCancel={switchToLogin}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
