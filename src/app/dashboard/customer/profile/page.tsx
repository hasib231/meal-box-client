"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Edit2,
  CheckCircle,
  User,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { axiosProtected } from "@/lib/axios";
import { USER_ROUTES } from "@/routes/api-routes";
import axios, { AxiosError } from "axios";
import { Badge } from "@/components/ui/badge";

export default function CustomerProfilePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryInstructions: "",
  });

  const [editData, setEditData] = useState(profileData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"personal" | "delivery">(
    "personal"
  );

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      console.log("Fetching profile for user ID:", userId);

      // Always get basic user data first
      const userResponse = await axiosProtected.get(USER_ROUTES.PROFILE);
      console.log("User data response:", userResponse.data);
      const userData = userResponse.data.data;

      // Set basic profile data from user record
      const updatedProfile = {
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        deliveryInstructions: "",
      };

      // Try to get customer profile data if it exists
      try {
        const customerProfileResponse = await axiosProtected.get(
          `/api/v1/profile/user/${userId}`
        );
        console.log("Customer profile response:", customerProfileResponse.data);

        // If customer profile exists, use its data
        if (
          customerProfileResponse.data.success !== false &&
          customerProfileResponse.data.data
        ) {
          const customerData = customerProfileResponse.data.data;
          updatedProfile.deliveryInstructions =
            customerData.deliveryAddress || "";
        }
      } catch (
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        _
      ) {
        console.log("No customer profile found - this is okay for new users");
      }

      setProfileData(updatedProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error("Error response:", axiosError.response.data);
        }
      }
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  useEffect(() => {
    setEditData(profileData);
  }, [profileData]);

  const handleSave = async () => {
    if (!userId) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    // Create user data object with only valid fields
    const userData: Record<string, string> = {};

    // Only include name if it's at least 3 characters
    if (editData.name && editData.name.length >= 3) {
      userData.name = editData.name;
    }

    // Include phone if it exists
    if (editData.phone) {
      userData.phone = editData.phone;
    }

    // Only include address if it's at least 5 characters
    if (editData.address && editData.address.length >= 5) {
      userData.address = editData.address;
    }

    console.log("Sending user update:", userData);

    // Don't update if no valid fields to update
    if (Object.keys(userData).length === 0) {
      toast.error(
        "No valid fields to update. Name should be at least 3 characters, and address at least 5 characters."
      );
      return;
    }

    setIsSaving(true);
    try {
      // First update basic user data
      const userResponse = await axiosProtected.put(
        `${USER_ROUTES.PROFILE}`,
        userData
      );
      console.log("User update response:", userResponse.data);

      // Try to update customer profile with delivery instructions
      if (editData.deliveryInstructions) {
        try {
          const profileResponse = await axiosProtected.put(
            `/api/v1/profile/customer/${userId}`,
            {
              deliveryAddress: editData.deliveryInstructions,
            }
          );
          console.log("Profile update response:", profileResponse.data);
        } catch (profileError) {
          console.error(
            "Error updating profile - may not exist yet:",
            profileError
          );

          // If we get a 404, the profile doesn't exist yet - need to create it
          if (
            axios.isAxiosError(profileError) &&
            profileError.response?.status === 404
          ) {
            console.log(
              "Customer profile doesn't exist yet - would need to create it"
            );
          }
        }
      }

      // Get updated data - just update the local state with what we know we've saved
      setProfileData({
        ...profileData,
        ...userData,
        deliveryInstructions: editData.deliveryInstructions,
      });

      toast.success("Profile updated successfully");
      setDialogOpen(false); // Close the dialog after save
    } catch (error) {
      console.error("Error updating profile:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error("Error response:", axiosError.response.data);
          // Show more specific error message if available
          const errorData = axiosError.response.data as Record<string, unknown>;
          if (errorData?.message) {
            toast.error(`Update failed: ${String(errorData.message)}`);
            return;
          }
        }
      }
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">
            Loading profile information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/80 to-primary h-32 relative"></div>
            <CardHeader className="pt-4 text-center">
              <CardTitle className="text-2xl font-bold">
                {profileData.name}
              </CardTitle>
              <CardDescription className="flex justify-center items-center gap-1 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profileData.email}</span>
              </CardDescription>
              <Badge className="mt-2">{session?.user.role || "Customer"}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{profileData.phone || "No phone number"}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span>{profileData.address || "No address provided"}</span>
                </div>
              </div>

              <Separator />

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full flex items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Edit Your Profile</DialogTitle>
                  </DialogHeader>

                  <div className="flex border-b mb-4">
                    <button
                      className={`py-2 px-4 ${
                        activeSection === "personal"
                          ? "border-b-2 border-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setActiveSection("personal")}
                    >
                      Personal Info
                    </button>
                    <button
                      className={`py-2 px-4 ${
                        activeSection === "delivery"
                          ? "border-b-2 border-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setActiveSection("delivery")}
                    >
                      Delivery Details
                    </button>
                  </div>

                  {activeSection === "personal" && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-muted-foreground text-sm"
                        >
                          Full Name*
                        </Label>
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          placeholder="Enter your full name"
                          className="mt-1"
                        />
                        {editData.name.length < 3 &&
                          editData.name.length > 0 && (
                            <p className="text-destructive text-xs mt-1">
                              Name must be at least 3 characters
                            </p>
                          )}
                      </div>

                      <div>
                        <Label
                          htmlFor="email"
                          className="text-muted-foreground text-sm"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={editData.email}
                          className="mt-1 bg-muted/50 cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Email cannot be changed through this form
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-muted-foreground text-sm"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={editData.phone}
                          onChange={(e) =>
                            setEditData({ ...editData, phone: e.target.value })
                          }
                          placeholder="Enter your phone number"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {activeSection === "delivery" && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <Label
                          htmlFor="address"
                          className="text-muted-foreground text-sm"
                        >
                          Delivery Address*
                        </Label>
                        <Input
                          id="address"
                          value={editData.address}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              address: e.target.value,
                            })
                          }
                          placeholder="Enter your delivery address"
                          className="mt-1"
                        />
                        {editData.address.length < 5 &&
                          editData.address.length > 0 && (
                            <p className="text-destructive text-xs mt-1">
                              Address must be at least 5 characters
                            </p>
                          )}
                      </div>

                      <div>
                        <Label
                          htmlFor="instructions"
                          className="text-muted-foreground text-sm"
                        >
                          Delivery Instructions
                        </Label>
                        <Textarea
                          id="instructions"
                          value={editData.deliveryInstructions}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              deliveryInstructions: e.target.value,
                            })
                          }
                          placeholder="Add any special delivery instructions"
                          className="min-h-[100px] mt-1"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="gap-1"
                    >
                      {isSaving ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile Information</CardTitle>
              <CardDescription>
                Complete your profile to get the most out of our services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
                <Separator className="my-3" />
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Full Name</dt>
                    <dd className="mt-1 text-sm font-medium">
                      {profileData.name || "Not provided"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Email Address
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                      {profileData.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Phone Number
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                      {profileData.phone || "Not provided"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Account Type
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                      {session?.user.role || "Customer"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Details
                </h3>
                <Separator className="my-3" />
                <dl className="grid grid-cols-1 gap-y-4 mt-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Delivery Address
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                      {profileData.address || "No address provided"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Special Instructions
                    </dt>
                    <dd className="mt-1 text-sm font-medium bg-muted/30 p-3 rounded-md">
                      {profileData.deliveryInstructions ||
                        "No special instructions provided"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(true)}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Update Your Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
