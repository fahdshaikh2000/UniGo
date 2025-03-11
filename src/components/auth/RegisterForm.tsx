import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Upload,
  User,
  Mail,
  School,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schemas for different steps
const emailSchema = z.object({
  email: z.string().email("Please enter a valid university email"),
});

const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  university: z.string().min(1, "Please select your university"),
  studentId: z.string().min(1, "Student ID is required"),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface RegisterFormProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

const RegisterForm = ({
  onComplete = () => {},
  onCancel = () => {},
}: RegisterFormProps) => {
  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [idUploaded, setIdUploaded] = useState<boolean>(false);

  // Form for step 1 - Email verification
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form for step 2 - Personal information
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      university: "",
      studentId: "",
    },
  });

  // Form for step 3 - Password and terms
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const handleEmailSubmit = (data: z.infer<typeof emailSchema>) => {
    // Simulate email verification
    console.log("Verifying email:", data.email);
    setEmailVerified(true);
    setStep(2);
  };

  const handlePersonalInfoSubmit = (
    data: z.infer<typeof personalInfoSchema>,
  ) => {
    console.log("Personal info submitted:", data);
    setStep(3);
  };

  const { register: registerUser } = useAuth();

  const handlePasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      // Combine data from all steps
      const email = emailForm.getValues().email;
      const { firstName, lastName } = personalInfoForm.getValues();
      const fullName = `${firstName} ${lastName}`;

      await registerUser(fullName, email, data.password);
      console.log("Registration complete:", { fullName, email });
      onComplete();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Simulate ID verification
      console.log("ID uploaded:", e.target.files[0].name);
      setIdUploaded(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Create Your Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Step indicators */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= i ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {i}
              </div>
              <span className="text-xs mt-1">
                {i === 1 ? "Email" : i === 2 ? "Details" : "Password"}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Email Verification */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="your.name@university.edu"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-sm text-muted-foreground">
                  We'll send a verification code to this email to confirm you're
                  a university student. Emails with .edu or .edu.pk domains are
                  preferred and help us verify your student status faster.
                </div>
                <Button type="submit" className="w-full">
                  Verify Email
                </Button>
              </form>
            </Form>
          </motion.div>
        )}

        {/* Step 2: Personal Information */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Form {...personalInfoForm}>
              <form
                onSubmit={personalInfoForm.handleSubmit(
                  handlePersonalInfoSubmit,
                )}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={personalInfoForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="First Name"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={personalInfoForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={personalInfoForm.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <div className="flex items-center">
                              <School className="mr-2 h-4 w-4 text-muted-foreground" />
                              <SelectValue placeholder="Select your university" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lums">LUMS University</SelectItem>
                          <SelectItem value="nust">NUST Islamabad</SelectItem>
                          <SelectItem value="iba">IBA Karachi</SelectItem>
                          <SelectItem value="fast">FAST University</SelectItem>
                          <SelectItem value="giki">GIKI</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalInfoForm.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your student ID number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Upload Student ID</FormLabel>
                  <div
                    className={`border-2 border-dashed rounded-md p-4 text-center ${idUploaded ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"}`}
                  >
                    <input
                      type="file"
                      id="id-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="id-upload" className="cursor-pointer block">
                      {idUploaded ? (
                        <div className="text-green-600 flex flex-col items-center">
                          <Upload className="h-6 w-6 mb-2" />
                          <span>ID Successfully Uploaded</span>
                        </div>
                      ) : (
                        <div className="text-gray-500 flex flex-col items-center">
                          <Upload className="h-6 w-6 mb-2" />
                          <span>Click to upload your student ID</span>
                          <span className="text-xs mt-1">
                            (JPG, PNG or PDF, max 5MB)
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <Button type="submit" className="flex items-center">
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        )}

        {/* Step 3: Password and Terms */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-2.5 text-gray-500"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-2.5 text-gray-500"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          I agree to the{" "}
                          <a href="#" className="text-primary underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-primary underline">
                            Privacy Policy
                          </a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <Button type="submit" className="flex items-center">
                    Create Account
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" className="p-0" onClick={onCancel}>
            Sign in
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
