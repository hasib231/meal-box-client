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
  DollarSign,
  Calendar,
  Award,
  Utensils,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { axiosProtected } from "@/lib/axios";
import { USER_ROUTES } from "@/routes/api-routes";
import axios, { AxiosError } from "axios";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function ProviderProfilePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cuisineSpecialties: [] as string[],
    pricing: 0,
    experience: "",
    availability: true,
  });

  const [editData, setEditData] = useState(profileData);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"personal" | "business">(
    "personal"
  );

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      console.log("Fetching profile for provider ID:", userId);

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
        cuisineSpecialties: [],
        pricing: 0,
        experience: "",
        availability: true,
      };

      // Try to get provider profile data if it exists
      try {
        const providerProfileResponse = await axiosProtected.get(
          `/api/v1/providers/user/${userId}`
        );
        console.log("Provider profile response:", providerProfileResponse.data);

        // If provider profile exists, use its data
        if (
          providerProfileResponse.data.success !== false &&
          providerProfileResponse.data.data
        ) {
          const providerData = providerProfileResponse.data.data;
          updatedProfile.cuisineSpecialties =
            providerData.cuisineSpecialties || [];
          updatedProfile.pricing = providerData.pricing || 0;
          updatedProfile.experience = providerData.experience || "";
          updatedProfile.availability = providerData.availability !== false;
        }
      } catch (
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        _
      ) {
        console.log("No provider profile found - this is okay for new users");
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

  const handleAddSpecialty = () => {
    if (!newSpecialty.trim()) return;

    if (!editData.cuisineSpecialties.includes(newSpecialty.trim())) {
      setEditData({
        ...editData,
        cuisineSpecialties: [
          ...editData.cuisineSpecialties,
          newSpecialty.trim(),
        ],
      });
    }

    setNewSpecialty("");
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setEditData({
      ...editData,
      cuisineSpecialties: editData.cuisineSpecialties.filter(
        (s) => s !== specialty
      ),
    });
  };

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

    // Create provider data object
    const providerData = {
      cuisineSpecialties: editData.cuisineSpecialties,
      pricing: editData.pricing,
      experience: editData.experience,
      availability: editData.availability,
    };

    console.log("Sending provider update:", providerData);

    // Don't update if no valid fields to update
    if (
      Object.keys(userData).length === 0 &&
      (editData.cuisineSpecialties.length === 0 || !editData.experience)
    ) {
      toast.error("Please provide valid information to update your profile.");
      return;
    }

    setIsSaving(true);
    try {
      // First update basic user data if any fields to update
      if (Object.keys(userData).length > 0) {
        const userResponse = await axiosProtected.put(
          `${USER_ROUTES.PROFILE}`,
          userData
        );
        console.log("User update response:", userResponse.data);
      }

      // Try to update provider profile
      try {
        const profileResponse = await axiosProtected.put(
          `/api/v1/providers/profile`,
          providerData
        );
        console.log("Provider profile update response:", profileResponse.data);
      } catch (profileError) {
        console.error(
          "Error updating profile - may not exist yet:",
          profileError
        );

        // If we get a 404, the profile doesn't exist yet - would need a different endpoint to create it
        if (
          axios.isAxiosError(profileError) &&
          profileError.response?.status === 404
        ) {
          console.log(
            "Provider profile doesn't exist yet - would need to create it"
          );
          toast.error("Provider profile not found. Please contact admin.");
          setIsSaving(false);
          return;
        }
      }

      // Get updated data - just update the local state with what we know we've saved
      setProfileData({
        ...profileData,
        ...userData,
        cuisineSpecialties: editData.cuisineSpecialties,
        pricing: editData.pricing,
        experience: editData.experience,
        availability: editData.availability,
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
              <Badge className="mt-2">{session?.user.role || "Provider"}</Badge>
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
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Badge
                    variant={
                      profileData.availability ? "secondary" : "destructive"
                    }
                    className={`mt-1 ${
                      profileData.availability
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : ""
                    }`}
                  >
                    {profileData.availability ? "Available" : "Unavailable"}
                  </Badge>
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
                    <DialogTitle>Edit Your Provider Profile</DialogTitle>
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
                        activeSection === "business"
                          ? "border-b-2 border-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setActiveSection("business")}
                    >
                      Business Details
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

                      <div>
                        <Label
                          htmlFor="address"
                          className="text-muted-foreground text-sm"
                        >
                          Business Address*
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
                          placeholder="Enter your business address"
                          className="mt-1"
                        />
                        {editData.address.length < 5 &&
                          editData.address.length > 0 && (
                            <p className="text-destructive text-xs mt-1">
                              Address must be at least 5 characters
                            </p>
                          )}
                      </div>
                    </div>
                  )}

                  {activeSection === "business" && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <Label
                          htmlFor="specialties"
                          className="text-muted-foreground text-sm"
                        >
                          Cuisine Specialties
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {editData.cuisineSpecialties.map((specialty) => (
                            <Badge
                              key={specialty}
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              {specialty}
                              <button
                                onClick={() => handleRemoveSpecialty(specialty)}
                                className="ml-1 h-4 w-4 rounded-full bg-muted/20 inline-flex items-center justify-center hover:bg-muted"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newSpecialty}
                            onChange={(e) => setNewSpecialty(e.target.value)}
                            placeholder="Add cuisine specialty"
                            className="flex-1"
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), handleAddSpecialty())
                            }
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleAddSpecialty}
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="pricing"
                          className="text-muted-foreground text-sm"
                        >
                          Pricing ($/hr)
                        </Label>
                        <Input
                          id="pricing"
                          type="number"
                          value={editData.pricing}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              pricing: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="Enter your hourly rate"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="experience"
                          className="text-muted-foreground text-sm"
                        >
                          Experience
                        </Label>
                        <Textarea
                          id="experience"
                          value={editData.experience}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              experience: e.target.value,
                            })
                          }
                          placeholder="Describe your culinary experience"
                          className="min-h-[100px] mt-1"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="availability"
                          checked={editData.availability}
                          onCheckedChange={(checked) =>
                            setEditData({
                              ...editData,
                              availability: checked,
                            })
                          }
                        />
                        <Label
                          htmlFor="availability"
                          className="text-muted-foreground text-sm"
                        >
                          Currently Available for Booking
                        </Label>
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
              <CardTitle>Your Provider Profile</CardTitle>
              <CardDescription>
                Complete your chef profile to attract more customers
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
                      {session?.user.role || "Provider"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  Business Details
                </h3>
                <Separator className="my-3" />
                <dl className="grid grid-cols-1 gap-y-4 mt-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Business Address
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                      {profileData.address || "No address provided"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Cuisine Specialties
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {profileData.cuisineSpecialties.length > 0 ? (
                        profileData.cuisineSpecialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No specialties listed
                        </span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Pricing Rate
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                      {profileData.pricing
                        ? `$${profileData.pricing}/hr`
                        : "Not specified"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Availability
                    </dt>
                    <dd className="mt-1">
                      <Badge
                        variant={
                          profileData.availability ? "secondary" : "destructive"
                        }
                        className={`${
                          profileData.availability
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : ""
                        }`}
                      >
                        {profileData.availability
                          ? "Available for Booking"
                          : "Currently Unavailable"}
                      </Badge>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Experience
                    </dt>
                    <dd className="mt-1 text-sm font-medium bg-muted/30 p-3 rounded-md">
                      {profileData.experience ||
                        "No experience information provided"}
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
                  Update Your Provider Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
