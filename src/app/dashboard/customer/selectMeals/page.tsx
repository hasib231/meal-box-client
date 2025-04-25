"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// Define the Meal type based on the backend model
interface Portion {
  size: string;
  price: number;
  _id?: string;
}

interface Meal {
  _id: string;
  userId: string;
  mealName: string;
  description: string;
  ingredients: string[];
  portions: Portion[];
  dietTags: string[];
  availability: boolean;
  imageUrl?: string;
}

const SelectMeal = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dietFilter, setDietFilter] = useState("");
  const [portionFilter, setPortionFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Auth hook for token handling - we don't need the user object directly
  useAuth();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:8000/api/v1/meals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Only show available meals
        const availableMeals = response.data.data.filter(
          (meal: Meal) => meal.availability
        );
        setMeals(availableMeals);
        setFilteredMeals(availableMeals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching meals:", error);
        toast.error("Failed to load meals. Please try again.");
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  useEffect(() => {
    // Apply filters whenever they change
    let result = [...meals];

    // Apply diet filter
    if (dietFilter) {
      result = result.filter((meal) => meal.dietTags.includes(dietFilter));
    }

    // Apply portion filter
    if (portionFilter) {
      result = result.filter((meal) =>
        meal.portions.some((portion) => portion.size === portionFilter)
      );
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (meal) =>
          meal.mealName.toLowerCase().includes(term) ||
          meal.description.toLowerCase().includes(term) ||
          meal.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(term)
          )
      );
    }

    setFilteredMeals(result);
  }, [dietFilter, portionFilter, searchTerm, meals]);

  const handleOrder = (meal: Meal) => {
    // Navigate to order page with meal information
    const selectedMealInfo = {
      mealId: meal._id,
      mealName: meal.mealName,
      providerId: meal.userId,
      portions: meal.portions,
      imageUrl: meal.imageUrl,
    };

    // Store the selected meal info in localStorage for the order page
    localStorage.setItem("selectedMeal", JSON.stringify(selectedMealInfo));

    // Redirect to order page
    router.push("/dashboard/customer/order");
  };

  // Get unique diet tags from all meals
  const uniqueDietTags = [...new Set(meals.flatMap((meal) => meal.dietTags))];

  // Get unique portion sizes from all meals
  const uniquePortionSizes = [
    ...new Set(meals.flatMap((meal) => meal.portions.map((p) => p.size))),
  ];

  return (
    <div className="w-full">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Filter section */}
      <div className="w-full py-4 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row justify-around items-center gap-4 px-4">
          <div className="w-full md:w-3/12">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Diet Restriction</legend>
              <select
                value={dietFilter}
                onChange={(e) => setDietFilter(e.target.value)}
                className="select border border-gray-300 rounded w-full p-2"
              >
                <option value="">All Diets</option>
                {uniqueDietTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          <div className="w-full md:w-3/12">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Portion Size</legend>
              <select
                value={portionFilter}
                onChange={(e) => setPortionFilter(e.target.value)}
                className="select border border-gray-300 rounded w-full p-2"
              >
                <option value="">All Sizes</option>
                {uniquePortionSizes.map((size) => (
                  <option key={size} value={size}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          <div className="w-full md:w-3/12">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Search</legend>
              <input
                type="text"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded input w-full p-2"
              />
            </fieldset>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-center text-3xl my-5 py-5 bg-red-800 text-white">
          Select Your Meal According To Your Preferred Choice of Food
        </h1>
      </div>

      {/* Meal Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading meals...</p>
        </div>
      ) : filteredMeals.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">No meals found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-11/12 mx-auto py-8">
          {filteredMeals.map((meal) => (
            <div
              key={meal._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <div className="h-full flex flex-col justify-between">
                {/* Meal Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={
                      meal.imageUrl ||
                      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2940&auto=format&fit=crop"
                    }
                    alt={meal.mealName}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>

                {/* Meal Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-3xl font-bold text-center mb-3">
                    {meal.mealName}
                  </h2>

                  {/* Diet Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {meal.dietTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-700 mb-4 flex-grow line-clamp-4">
                    {meal.description}
                  </p>

                  {/* Portions */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Available Sizes:
                    </h3>
                    <div className="flex gap-2">
                      {meal.portions.map((portion) => (
                        <span
                          key={portion._id || portion.size}
                          className="px-2 py-1 bg-gray-100 rounded text-sm"
                        >
                          {portion.size}: ${portion.price.toFixed(2)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Order Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleOrder(meal)}
                      className="px-6 py-2 bg-red-800 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectMeal;
