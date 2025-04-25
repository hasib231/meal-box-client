"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Camera } from "lucide-react";

export default function CustomerProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "Emma Thompson",
    email: "emma@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Cityville, ST 12345",
    deliveryInstructions: "Please leave at front door",
  });

  const [editData, setEditData] = useState(profileData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfileData(editData); // ✅ Update main profile
      toast.success("Profile updated successfully");
    } catch ( error) {
      console.error("Error profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card className="relative">
        {/* Profile Picture */}
        <div className="flex justify-center -mt-16">
          <div className="relative group w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden">
            <img
              src="/profile-placeholder.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer">
              <Camera className="text-white h-6 w-6" />
            </div>
          </div>
        </div>

        <CardHeader className="pt-6 text-center">
          <CardTitle className="text-2xl">{profileData.name}</CardTitle>
          <p className="text-muted-foreground text-sm">{profileData.email}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-500">Phone</Label>
            <p>{profileData.phone}</p>
          </div>
          <div>
            <Label className="text-gray-500">Address</Label>
            <p>{profileData.address}</p>
          </div>
          <div>
            <Label className="text-gray-500">Delivery Instructions</Label>
            <p>{profileData.deliveryInstructions}</p>
          </div>

          {/* Edit Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full mt-6">Edit Profile</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    placeholder="Enter your delivery address"
                  />
                </div>

                <div>
                  <Label htmlFor="instructions">Delivery Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={editData.deliveryInstructions}
                    onChange={(e) =>
                      setEditData({ ...editData, deliveryInstructions: e.target.value })
                    }
                    placeholder="Add any special delivery instructions"
                    className="min-h-[100px]"
                  />
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="w-full">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
