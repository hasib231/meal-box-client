"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MealCard, MealCardType, Portion } from "@/components/menus/mealCard";
import { MealForm } from "@/components/menus/MealFrom";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosProtected } from "@/lib/axios";
import { MealCardType as MealType } from "@/components/menus/mealCard";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Define meal interface based on the server model
interface ApiMeal {
  _id: string;
  userId: string;
  mealName: string;
  description: string;
  ingredients: string[];
  portions: Portion[];
  dietTags: string[];
  availability: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Adapt the meal data to fit the existing UI components
function adaptMealForUI(meal: ApiMeal): MealType {
  return {
    id: meal._id,
    name: meal.mealName,
    description: meal.description,
    price: meal.portions.length > 0 ? meal.portions[0].price : 0,
    image:
      meal.imageUrl ||
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2940&auto=format&fit=crop",
    category: meal.dietTags.length > 0 ? meal.dietTags[0] : "Other",
    dietaryOptions: meal.dietTags,
    isAvailable: meal.availability,
    createdAt: meal.createdAt || new Date().toISOString(),
    updatedAt: meal.updatedAt || new Date().toISOString(),
    ingredients: meal.ingredients || [],
    portions: meal.portions || [],
  };
}

// Define a schema for the meal form values
export const mealFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  image: z.string(),
  category: z.string(),
  dietaryOptions: z.array(z.string()).optional(),
  isAvailable: z.boolean(),
});

// Define the type for meal form values
type MealFormValues = z.infer<typeof mealFormSchema>;

// Function to adapt UI meal format to API format
function adaptUIMealForAPI(
  formData: MealFormValues,
  isEditing: boolean = false
): Partial<ApiMeal> {
  if (!formData) {
    throw new Error("Meal data is undefined");
  }

  console.log("Raw form data received:", formData);

  // Create a set of dietary options that includes the category
  // Using Set to remove duplicates
  const dietaryTags = [
    ...(formData.category ? [formData.category] : []),
    ...(formData.dietaryOptions || []),
  ];

  // Remove duplicates using Set
  const uniqueDietaryTags = [...new Set(dietaryTags)];

  // For now we'll derive medium and large prices based on the single price
  const basePrice = Math.max(formData.price || 0, 0.5); // Minimum $0.50
  const mediumPrice = basePrice * 1.2;
  const largePrice = basePrice * 1.4;

  // Create a cleaned-up payload that will pass validation
  const payload: Partial<ApiMeal> = {
    mealName: formData.name || "Unnamed Meal",
    description:
      formData.description || "A delicious meal with no description provided.",
    ingredients: formData.dietaryOptions?.length
      ? formData.dietaryOptions
      : ["Default ingredient"],
    portions: [
      {
        size: "small",
        price: basePrice,
      },
      {
        size: "medium",
        price: mediumPrice,
      },
      {
        size: "large",
        price: largePrice,
      },
    ],
    // Only add "Other" as a fallback for new meals, not when editing
    dietTags:
      uniqueDietaryTags.length > 0
        ? uniqueDietaryTags
        : isEditing
        ? []
        : ["Other"],
    availability:
      formData.isAvailable !== undefined ? formData.isAvailable : true,
  };

  // Only include image URL if it's actually a URL
  if (
    formData.image &&
    (formData.image.startsWith("http") || formData.image.startsWith("https"))
  ) {
    payload.imageUrl = formData.image;
  }

  return payload;
}

export default function MenusPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [meals, setMeals] = useState<MealCardType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealCardType | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["all"]);

  // Fetch meals from the API
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user?.id) return;

    const fetchMeals = async () => {
      try {
        setLoading(true);

        // Ensure we have a token
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No access token found");
          toast.error("Authentication error. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("Fetching meals for user:", user.id);
        const response = await axiosProtected.get(
          `api/v1/meals/user/${user.id}`
        );
        console.log("API Response:", response.data);

        if (response.data.success) {
          const fetchedMeals = response.data.data.map((meal: ApiMeal) =>
            adaptMealForUI(meal)
          );
          setMeals(fetchedMeals);

          // Extract unique categories from fetched meals
          const allCategories = [
            "all",
            ...new Set(
              fetchedMeals.flatMap((meal: MealCardType) => meal.dietaryOptions)
            ),
          ].filter(Boolean) as string[];
          setCategories(allCategories);
        } else {
          console.error("Error in API response:", response.data);
          toast.error(response.data.message || "Failed to load your meals");
        }
      } catch (error: Error | unknown) {
        console.error("Error fetching meals:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load your meals. Please check your connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [user, isAuthenticated, authLoading]);

  // Filter and sort meals
  const filteredMeals = meals
    .filter((meal) => {
      const matchesSearch =
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        meal.dietaryOptions.includes(selectedCategory);
      const matchesAvailability = showAvailableOnly ? meal.isAvailable : true;

      return matchesSearch && matchesCategory && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "date-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "date-desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  const handleAddMeal = () => {
    // Redirect to the Add Meals page instead of opening dialog
    router.push("/dashboard/provider/addMeals");
  };

  const handleEditMeal = (meal: MealCardType) => {
    setSelectedMeal(meal);
    setIsDialogOpen(true);
  };

  const handleDeleteMeal = async (deletedMeal: MealCardType) => {
    try {
      await axiosProtected.delete(`api/v1/meals/${deletedMeal.id}`);

      // Update local state to remove the deleted meal
      setMeals(meals.filter((meal) => meal.id !== deletedMeal.id));
      toast.success("Meal deleted successfully");
    } catch (error) {
      console.error("Error deleting meal:", error);
      toast.error("Failed to delete meal");
    }
  };

  const handleUpdateMealAvailability = async (
    meal: MealCardType,
    availability: boolean
  ) => {
    try {
      await axiosProtected.put(`api/v1/meals/${meal.id}`, { availability });

      // Update local state
      setMeals(
        meals.map((m) =>
          m.id === meal.id ? { ...m, isAvailable: availability } : m
        )
      );
      toast.success(
        `Meal marked as ${availability ? "available" : "unavailable"}`
      );
      return true;
    } catch (error) {
      console.error("Error updating meal availability:", error);
      toast.error("Failed to update meal availability");
      return false;
    }
  };

  const handleMealFormSuccess = async (
    formData: MealFormValues,
    isEditing: boolean
  ): Promise<boolean> => {
    try {
      console.log("Form submission data:", formData);

      const apiData = adaptUIMealForAPI(formData, isEditing);
      console.log("Converted API data:", JSON.stringify(apiData, null, 2));

      if (isEditing && selectedMeal) {
        // Update existing meal
        console.log(`Sending PUT request to: api/v1/meals/${selectedMeal.id}`);
        console.log("Request payload:", JSON.stringify(apiData, null, 2));

        const response = await axiosProtected.put(
          `api/v1/meals/${selectedMeal.id}`,
          apiData
        );

        console.log("Update response:", JSON.stringify(response.data, null, 2));

        if (response.data.success) {
          const updatedMeal = adaptMealForUI(response.data.data);
          setMeals(
            meals.map((m) => (m.id === updatedMeal.id ? updatedMeal : m))
          );
          toast.success("Meal updated successfully");
        }
      } else {
        // Create new meal
        console.log("Sending POST request to: api/v1/meals");
        console.log("Request payload:", JSON.stringify(apiData, null, 2));

        const response = await axiosProtected.post(`api/v1/meals`, apiData);

        console.log("Create response:", JSON.stringify(response.data, null, 2));

        if (response.data.success) {
          const newMeal = adaptMealForUI(response.data.data);
          setMeals([...meals, newMeal]);
          toast.success("Meal created successfully");
        }
      }

      setIsDialogOpen(false);
      return true;
    } catch (error) {
      console.error("Error saving meal:", error);

      // Log more detailed error information
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }

      // If it's an axios error, try to extract response data
      if (error instanceof Error && "response" in error) {
        // Define a more specific type for the axios error response
        const axiosError = error as {
          response?: {
            data: Record<string, unknown>;
            status: number;
          };
        };
        console.error("Response data:", axiosError.response?.data);
        console.error("Response status:", axiosError.response?.status);
      }

      toast.error("Failed to save meal");
      return false;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Manage Menus</h2>
            <p className="text-muted-foreground">
              Create and manage your meal offerings.
            </p>
          </div>
          <Button onClick={handleAddMeal} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add New Meal
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meals..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:w-1/2 lg:w-2/5">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Availability</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showAvailableOnly}
                  onCheckedChange={setShowAvailableOnly}
                >
                  Show available only
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={sortBy === "name-asc"}
                  onCheckedChange={(checked) =>
                    checked && setSortBy("name-asc")
                  }
                >
                  Name (A-Z)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "name-desc"}
                  onCheckedChange={(checked) =>
                    checked && setSortBy("name-desc")
                  }
                >
                  Name (Z-A)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "price-asc"}
                  onCheckedChange={(checked) =>
                    checked && setSortBy("price-asc")
                  }
                >
                  Price (Low to High)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "price-desc"}
                  onCheckedChange={(checked) =>
                    checked && setSortBy("price-desc")
                  }
                >
                  Price (High to Low)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "date-desc"}
                  onCheckedChange={(checked) =>
                    checked && setSortBy("date-desc")
                  }
                >
                  Newest First
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "date-asc"}
                  onCheckedChange={(checked) =>
                    checked && setSortBy("date-asc")
                  }
                >
                  Oldest First
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 mb-4 rounded-full bg-gray-300"></div>
              <p className="text-xl">Loading your meals...</p>
            </div>
          </div>
        ) : filteredMeals.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8 text-center">
            <h3 className="text-xl font-medium">No meals found</h3>
            <p className="mt-2 text-muted-foreground">
              {searchQuery || selectedCategory !== "all" || showAvailableOnly
                ? "Try adjusting your filters or search query."
                : "Add your first meal to get started."}
            </p>
            <Button onClick={handleAddMeal} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add New Meal
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onEdit={handleEditMeal}
                onDelete={handleDeleteMeal}
                onAvailabilityChange={(isAvailable) =>
                  handleUpdateMealAvailability(meal, isAvailable)
                }
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedMeal ? "Edit Meal" : "Add New Meal"}
            </DialogTitle>
          </DialogHeader>
          <MealForm
            meal={selectedMeal}
            onSuccess={(formData) => {
              console.log("Form submitted with data:", formData);
              return handleMealFormSuccess(formData, !!selectedMeal);
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
