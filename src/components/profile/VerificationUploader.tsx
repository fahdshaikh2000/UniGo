import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

interface VerificationUploaderProps {
  status?: VerificationStatus;
  onUpload?: (file: File, type: string) => void;
}

const VerificationUploader = ({
  status = "unverified",
  onUpload = () => {},
}: VerificationUploaderProps) => {
  const [activeTab, setActiveTab] = useState("university-id");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [linkedInProfile, setLinkedInProfile] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onUpload(uploadedFile, activeTab);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleLinkedInSubmit = () => {
    if (!linkedInProfile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate verification process
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // In a real app, you would send this to your backend
          console.log("LinkedIn profile submitted:", linkedInProfile);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const renderStatusBadge = () => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Shield className="h-3 w-3 mr-1" /> Unverified
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Identity Verification
          </CardTitle>
          {renderStatusBadge()}
        </div>
        <CardDescription>
          Verify your identity to build trust with other users
        </CardDescription>
      </CardHeader>

      <CardContent>
        {status === "verified" ? (
          <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">
                Verification Complete
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Your identity has been verified. You now have full access to all
                features of the platform.
              </p>
            </div>
          </div>
        ) : status === "pending" ? (
          <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3">
            <Loader2 className="h-5 w-5 text-yellow-600 mt-0.5 animate-spin" />
            <div>
              <h3 className="font-medium text-yellow-800">
                Verification in Progress
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                We're reviewing your submitted documents. This usually takes 1-2
                business days.
              </p>
            </div>
          </div>
        ) : status === "rejected" ? (
          <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">
                Verification Rejected
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Your verification was rejected. Please try again with clearer
                documents or try a different verification method.
              </p>
            </div>
          </div>
        ) : null}

        {status !== "verified" && status !== "pending" && (
          <Tabs
            defaultValue="university-id"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="university-id">University ID</TabsTrigger>
              <TabsTrigger value="cnic">CNIC</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            </TabsList>

            <TabsContent value="university-id" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Upload University ID Card</Label>
                <div
                  className={`border-2 border-dashed rounded-md p-6 text-center ${uploadedFile ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-primary hover:bg-gray-50"} transition-colors`}
                >
                  <input
                    type="file"
                    id="university-id-upload"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="university-id-upload"
                    className="cursor-pointer block"
                  >
                    {uploadedFile ? (
                      <div className="text-green-600 flex flex-col items-center">
                        <CheckCircle className="h-8 w-8 mb-2" />
                        <span className="font-medium">
                          {uploadedFile.name} selected
                        </span>
                        <span className="text-xs mt-1">
                          Click to change file
                        </span>
                      </div>
                    ) : (
                      <div className="text-gray-500 flex flex-col items-center">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="font-medium">
                          Click to upload your university ID
                        </span>
                        <span className="text-xs mt-1">
                          JPG, PNG or PDF (max 5MB)
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                <p>
                  <strong>Important:</strong> Please ensure your university ID
                  clearly shows your name, photo, and university name. Both
                  front and back sides may be required.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="cnic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Upload CNIC (Front & Back)</Label>
                <div
                  className={`border-2 border-dashed rounded-md p-6 text-center ${uploadedFile ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-primary hover:bg-gray-50"} transition-colors`}
                >
                  <input
                    type="file"
                    id="cnic-upload"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  <label htmlFor="cnic-upload" className="cursor-pointer block">
                    {uploadedFile ? (
                      <div className="text-green-600 flex flex-col items-center">
                        <CheckCircle className="h-8 w-8 mb-2" />
                        <span className="font-medium">
                          {uploadedFile.name} selected
                        </span>
                        <span className="text-xs mt-1">
                          Click to change file
                        </span>
                      </div>
                    ) : (
                      <div className="text-gray-500 flex flex-col items-center">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="font-medium">
                          Click to upload your CNIC (both sides)
                        </span>
                        <span className="text-xs mt-1">
                          JPG, PNG or PDF (max 5MB)
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                <p>
                  <strong>Important:</strong> Please ensure your CNIC is valid
                  and not expired. Upload both front and back sides in a single
                  image or PDF.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="linkedin" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin-profile">LinkedIn Profile URL</Label>
                <Input
                  id="linkedin-profile"
                  placeholder="https://www.linkedin.com/in/your-profile"
                  value={linkedInProfile}
                  onChange={(e) => setLinkedInProfile(e.target.value)}
                  disabled={isUploading}
                />
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Verifying...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                <p>
                  <strong>Note:</strong> Your LinkedIn profile should be public
                  and include your education details that match your university
                  information.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      {status !== "verified" && status !== "pending" && (
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button
            onClick={
              activeTab === "linkedin" ? handleLinkedInSubmit : handleUpload
            }
            disabled={
              isUploading ||
              (activeTab !== "linkedin" && !uploadedFile) ||
              (activeTab === "linkedin" && !linkedInProfile)
            }
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {activeTab === "linkedin" ? "Verifying..." : "Uploading..."}
              </>
            ) : (
              "Submit for Verification"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default VerificationUploader;
