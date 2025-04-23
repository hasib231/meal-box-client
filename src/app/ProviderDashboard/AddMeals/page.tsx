// src/app/ProviderDashboard/AddMeals/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddMealsPage = () => {
  const { user, session } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [mealName, setMealName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [portions, setPortions] = useState([
    { size: "small", price: 5.99 },
    { size: "medium", price: 8.99 },
    { size: "large", price: 11.99 }
  ]);
  const [dietTags, setDietTags] = useState<string[]>([]);
  const [availability, setAvailability] = useState(true);

  // Add ingredient to the list
  const addIngredient = () => {
    if (ingredient.trim()) {
      setIngredients([...ingredients, ingredient.trim()]);
      setIngredient("");
    }
  };

  // Remove ingredient from the list
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Handle diet tag selection
  const handleDietTagChange = (tag: string) => {
    if (dietTags.includes(tag)) {
      setDietTags(dietTags.filter(t => t !== tag));
    } else {
      setDietTags([...dietTags, tag]);
    }
  };

  // Update portion size
  const updatePortionSize = (index: number, field: 'size' | 'price', value: string) => {
    const newPortions = [...portions];
    if (field === 'size') {
      newPortions[index].size = value;
    } else {
      newPortions[index].price = parseFloat(value) || 0;
    }
    setPortions(newPortions);
  };

  // Add new portion size
  const addPortionSize = () => {
    setPortions([...portions, { size: "", price: 0 }]);
  };

  // Remove portion size
  const removePortionSize = (index: number) => {
    setPortions(portions.filter((_, i) => i !== index));
  };

  // Handle form submission
  // Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    // Validate form
    let validationError = null;
  
    if (!mealName.trim()) {
      validationError = "Meal name is required";
    } else if (!description.trim()) {
      validationError = "Description is required";
    } else if (ingredients.length === 0) {
      validationError = "At least one ingredient is required";
    } else if (portions.length === 0) {
      validationError = "At least one portion size is required";
    } else {
      // Check if all portions have valid size and price
      const invalidPortion = portions.find(
        p => !p.size.trim() || p.price <= 0
      );
      
      if (invalidPortion) {
        validationError = "All portion sizes must have a name and a price greater than zero";
      }
    }
  
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }
  
    try {
      // Get token from localStorage
      const token = localStorage.getItem("accessToken") || session?.accessToken;
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setIsLoading(false);
        return;
      }
  
      // Create meal data object
      const mealData = {
        userId: user?.id,
        mealName,
        description,
        ingredients,
        portions,
        dietTags,
        availability
      };
  
      console.log("Sending meal data:", mealData);
  
      // Send request directly to the backend API
      const response = await axios.post(
        "http://localhost:8000/api/v1/meals",
        mealData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
  
      console.log("API response:", response.data);
  
      if (response.status === 201 || response.status === 200) {
        alert("Meal added successfully!");
        
        // Reset form
        setMealName("");
        setDescription("");
        setIngredients([]);
        setPortions([
          { size: "small", price: 5.99 },
          { size: "medium", price: 8.99 },
          { size: "large", price: 11.99 }
        ]);
        setDietTags([]);
        
        // Redirect to meals list or dashboard
        router.push("/ProviderDashboard");
      }
    } catch (err: any) {
      console.error("Error adding meal:", err);
      
      // More detailed error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        
        const errorMessage = err.response.data?.message || 
                            err.response.data?.error || 
                            "Failed to add meal. Please try again.";
        setError(errorMessage);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError("No response from server. Please check your connection and try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message);
        setError("An error occurred while sending the request.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Available diet tags
  const availableDietTags = [
    "vegetarian", "vegan", "gluten-free", "dairy-free", 
    "low-carb", "high-protein", "keto", "paleo"
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Meal</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        {/* Meal Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Name *
          </label>
          <input
            type="text"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter meal name"
            required
          />
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            rows={3}
            placeholder="Describe the meal"
            required
          />
        </div>
        
        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingredients *
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Add an ingredient"
            />
            <button
              type="button"
              onClick={addIngredient}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Add
            </button>
          </div>
          
          {ingredients.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {ingredients.map((item, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 mt-1">No ingredients added yet</p>
          )}
        </div>
        
        {/* Portion Sizes */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Portion Sizes *
            </label>
            <button
              type="button"
              onClick={addPortionSize}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Another Size
            </button>
          </div>
          
          {portions.map((portion, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={portion.size}
                  onChange={(e) => updatePortionSize(index, 'size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Size (e.g., Small)"
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={portion.price}
                  onChange={(e) => updatePortionSize(index, 'price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Price"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              {portions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePortionSize(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Diet Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diet Tags
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {availableDietTags.map((tag) => (
              <div key={tag} className="flex items-center">
                <input
                  type="checkbox"
                  id={`tag-${tag}`}
                  checked={dietTags.includes(tag)}
                  onChange={() => handleDietTagChange(tag)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor={`tag-${tag}`} className="ml-2 text-sm text-gray-700">
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Availability */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="availability"
            checked={availability}
            onChange={(e) => setAvailability(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="availability" className="ml-2 text-sm text-gray-700">
            Available for ordering
          </label>
        </div>
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isLoading ? "Adding Meal..." : "Add Meal"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMealsPage;