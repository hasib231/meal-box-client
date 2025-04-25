"use client";

import { useState } from "react";
import { Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // ✅ Sonner toast

export default function PreferencesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    portionSize: "regular",
    calorieTarget: "2000",
    preferredCuisines: ["Italian", "Japanese", "Mediterranean"],
    newCuisine: "",
    dietaryRestrictions: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
      halal: false,
      kosher: false,
    },
    allergies: ["Shellfish"],
    newAllergy: "",
    mealPreferences: {
      spicyFood: false,
      organicOnly: false,
      lowSodium: false,
      lowCarb: false,
      highProtein: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Preferences updated successfully");
    } catch (error) {
        console.error("Error saving preferences:", error);
      toast.error("There was an error saving your preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const addCuisine = () => {
    if (formData.newCuisine.trim()) {
      setFormData({
        ...formData,
        preferredCuisines: [
          ...formData.preferredCuisines,
          formData.newCuisine.trim(),
        ],
        newCuisine: "",
      });
    }
  };

  const removeCuisine = (cuisine: string) => {
    setFormData({
      ...formData,
      preferredCuisines: formData.preferredCuisines.filter((c) => c !== cuisine),
    });
  };

  const addAllergy = () => {
    if (formData.newAllergy.trim()) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, formData.newAllergy.trim()],
        newAllergy: "",
      });
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((a) => a !== allergy),
    });
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Meal Preferences</CardTitle>
          <CardDescription>
            Customize your meal experience by setting your dietary preferences and restrictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Portion and Calorie Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Portion & Calorie Preferences</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="portionSize">Portion Size</Label>
                  <Select
                    value={formData.portionSize}
                    onValueChange={(value) =>
                      setFormData({ ...formData, portionSize: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select portion size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="calorieTarget">Daily Calorie Target</Label>
                  <Input
                    id="calorieTarget"
                    type="number"
                    value={formData.calorieTarget}
                    onChange={(e) =>
                      setFormData({ ...formData, calorieTarget: e.target.value })
                    }
                    placeholder="2000"
                  />
                </div>
              </div>
            </div>

            {/* Preferred Cuisines */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preferred Cuisines</h3>
              <div className="mb-2 flex flex-wrap gap-2">
                {formData.preferredCuisines.map((cuisine) => (
                  <Badge key={cuisine} variant="secondary" className="flex items-center gap-1">
                    {cuisine}
                    <button
                      type="button"
                      onClick={() => removeCuisine(cuisine)}
                      className="ml-1 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={formData.newCuisine}
                  onChange={(e) =>
                    setFormData({ ...formData, newCuisine: e.target.value })
                  }
                  placeholder="Add a cuisine type"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCuisine}
                  disabled={!formData.newCuisine.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dietary Restrictions</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(formData.dietaryRestrictions).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          dietaryRestrictions: {
                            ...formData.dietaryRestrictions,
                            [key]: checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor={key} className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Allergies</h3>
              <div className="mb-2 flex flex-wrap gap-2">
                {formData.allergies.map((allergy) => (
                  <Badge key={allergy} variant="secondary" className="flex items-center gap-1">
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeAllergy(allergy)}
                      className="ml-1 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={formData.newAllergy}
                  onChange={(e) =>
                    setFormData({ ...formData, newAllergy: e.target.value })
                  }
                  placeholder="Add an allergy"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAllergy}
                  disabled={!formData.newAllergy.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Meal Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Preferences</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(formData.mealPreferences).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          mealPreferences: {
                            ...formData.mealPreferences,
                            [key]: checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor={key} className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
