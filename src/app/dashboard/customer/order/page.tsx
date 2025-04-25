"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useAuth";
import { axiosProtected } from "@/lib/axios";

// Define types
interface Portion {
  size: string;
  price: number;
  _id?: string;
}

interface SelectedMeal {
  mealId: string;
  mealName: string;
  providerId: string;
  portions: Portion[];
  imageUrl?: string;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

const OrderPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Form state
  const [selectedMeal, setSelectedMeal] = useState<SelectedMeal | null>(null);
  const [selectedPortion, setSelectedPortion] = useState<Portion | null>(null);
  const [addOns, setAddOns] = useState<AddOn[]>([
    { id: "water", name: "Water", price: 1, selected: false },
    { id: "frenchFries", name: "French Fries", price: 5, selected: false },
    { id: "tomatoSauce", name: "Tomato Sauce", price: 2, selected: false },
  ]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [scheduledDate, setScheduledDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [basePrice, setBasePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(1);

  // Get selected meal from localStorage on page load
  useEffect(() => {
    // Wait for auth to finish loading before proceeding
    if (authLoading) return;

    // Protect the page from unauthenticated users
    if (!isAuthenticated && !authLoading) {
      router.push("/login");
      return;
    }

    // Try to get meal info from localStorage
    const loadMealData = () => {
      try {
        const storedMeal = localStorage.getItem("selectedMeal");
        if (!storedMeal) {
          toast.error("No meal selected. Please select a meal first.");
          router.push("/dashboard/customer/selectMeals");
          return;
        }

        const parsedMeal = JSON.parse(storedMeal) as SelectedMeal;
        setSelectedMeal(parsedMeal);

        // Set default portion if available
        if (parsedMeal.portions && parsedMeal.portions.length > 0) {
          const defaultPortion = parsedMeal.portions[0];
          setSelectedPortion(defaultPortion);
          setBasePrice(defaultPortion.price);
          calculateTotal(defaultPortion.price, addOns, 1);
        }

        setPageLoading(false);
      } catch (error) {
        console.error("Error parsing stored meal:", error);
        toast.error("Error loading meal information. Please try again.");
        router.push("/dashboard/customer/selectMeals");
      }
    };

    loadMealData();
  }, [isAuthenticated, router, addOns, authLoading]);

  // Calculate number of days between start and end date
  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 1;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Add 1 to include both start and end days
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays =
      Math.floor(differenceInTime / (1000 * 3600 * 24)) + 1;

    return differenceInDays > 0 ? differenceInDays : 1;
  };

  // Update days calculation when dates change
  useEffect(() => {
    const days = calculateDays(scheduledDate.startDate, scheduledDate.endDate);
    setNumberOfDays(days);

    if (selectedPortion) {
      calculateTotal(selectedPortion.price, addOns, days);
    }
  }, [scheduledDate, selectedPortion, addOns]);

  // Calculate total price when addOns, selectedPortion, or days changes
  const calculateTotal = (
    basePrice: number,
    currentAddOns: AddOn[],
    days: number
  ) => {
    const addOnsTotal = currentAddOns
      .filter((addon) => addon.selected)
      .reduce((sum, addon) => sum + addon.price, 0);

    // Multiply base price by number of days
    const dailyBasePrice = basePrice * days;

    // Add-ons are charged per day as well
    const dailyAddOnsTotal = addOnsTotal * days;

    setTotalPrice(dailyBasePrice + dailyAddOnsTotal);
  };

  // Handle portion selection change
  const handlePortionChange = (portion: Portion) => {
    setSelectedPortion(portion);
    setBasePrice(portion.price);
    calculateTotal(portion.price, addOns, numberOfDays);
  };

  // Handle add-on toggle
  const handleAddOnToggle = (id: string) => {
    const updatedAddOns = addOns.map((addon) =>
      addon.id === id ? { ...addon, selected: !addon.selected } : addon
    );
    setAddOns(updatedAddOns);
    calculateTotal(basePrice, updatedAddOns, numberOfDays);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMeal || !selectedPortion || !user) {
      toast.error("Missing information. Please check your selections.");
      return;
    }

    if (!deliveryAddress) {
      toast.error("Please provide a delivery address.");
      return;
    }

    if (!phone) {
      toast.error("Please provide a contact phone number.");
      return;
    }

    if (!scheduledDate.startDate || !scheduledDate.endDate) {
      toast.error("Please select delivery date range.");
      return;
    }

    setIsLoading(true);

    try {
      // Create order data
      const orderData = {
        customerId: user.id,
        mealId: selectedMeal.mealId,
        providerId: selectedMeal.providerId,
        deliveryAddress,
        phone: Number(phone),
        mealItemIds: [selectedPortion.size], // Using portion size as mealItemId
        status: "pending",
        scheduledDate,
        extraItems: addOns
          .filter((addon) => addon.selected)
          .map((addon) => addon.name),
        pricing: totalPrice,
        dietaryPreferences: [], // Could be added in future
        numberOfDays: numberOfDays,
      };

      // Send request to create order
      const response = await axiosProtected.post(
        "api/v1/customers/order",
        orderData
      );

      if (response.status === 201) {
        toast.success("Order placed successfully!");
        // Clear the selected meal from localStorage
        localStorage.removeItem("selectedMeal");

        // Redirect to track orders page
        setTimeout(() => {
          router.push("/dashboard/customer/trackOrders");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle loading states
  if (authLoading || pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 mb-4 rounded-full bg-gray-300"></div>
          <p className="text-xl">Loading meal information...</p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we prepare your order
          </p>
        </div>
      </div>
    );
  }

  // Handle the case where no meal is selected
  if (!selectedMeal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <p className="text-xl text-red-600">No meal selected</p>
        <button
          onClick={() => router.push("/dashboard/customer/selectMeals")}
          className="mt-4 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700"
        >
          Go Back to Select Meals
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold text-center mb-8">
        Complete Your Order
      </h1>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Meal Image */}
          <div className="md:w-1/3 relative h-60 md:h-80">
            <Image
              src={
                selectedMeal.imageUrl ||
                "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2940&auto=format&fit=crop"
              }
              alt={selectedMeal.mealName}
              className="object-cover h-full w-full"
              width={400}
              height={400}
              priority
            />
          </div>

          {/* Order Details */}
          <div className="md:w-2/3 p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedMeal.mealName}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Portion Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Portion Size
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedMeal.portions.map((portion) => (
                    <div key={portion._id || portion.size}>
                      <input
                        type="radio"
                        id={`portion-${portion.size}`}
                        name="portionSize"
                        className="sr-only"
                        checked={selectedPortion?.size === portion.size}
                        onChange={() => handlePortionChange(portion)}
                      />
                      <label
                        htmlFor={`portion-${portion.size}`}
                        className={`block w-full p-3 text-center border rounded-lg cursor-pointer
                          ${
                            selectedPortion?.size === portion.size
                              ? "border-red-500 bg-red-50 text-red-700"
                              : "border-gray-300 hover:border-red-300"
                          }`}
                      >
                        <span className="block font-medium capitalize">
                          {portion.size}
                        </span>
                        <span className="block mt-1">
                          ${portion.price.toFixed(2)}/day
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Would you like any add-ons? (per day)
                </label>
                <div className="space-y-2">
                  {addOns.map((addon) => (
                    <div key={addon.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`addon-${addon.id}`}
                        checked={addon.selected}
                        onChange={() => handleAddOnToggle(addon.id)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`addon-${addon.id}`}
                        className="ml-3 text-sm text-gray-700"
                      >
                        {addon.name} (${addon.price.toFixed(2)}/day)
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Information */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    rows={3}
                    placeholder="Enter your delivery address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your phone number"
                    required
                  />

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Period (select days you want meals)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={scheduledDate.startDate}
                        onChange={(e) =>
                          setScheduledDate({
                            ...scheduledDate,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                      <input
                        type="date"
                        value={scheduledDate.endDate}
                        onChange={(e) =>
                          setScheduledDate({
                            ...scheduledDate,
                            endDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        min={scheduledDate.startDate}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Order Summary
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Delivery Duration:</span>
                    <span>
                      {numberOfDays} {numberOfDays === 1 ? "day" : "days"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Base Price ({selectedPortion?.size}):</span>
                    <span>
                      ${basePrice.toFixed(2)} × {numberOfDays} = $
                      {(basePrice * numberOfDays).toFixed(2)}
                    </span>
                  </div>

                  {addOns.map(
                    (addon) =>
                      addon.selected && (
                        <div key={addon.id} className="flex justify-between">
                          <span>{addon.name}:</span>
                          <span>
                            ${addon.price.toFixed(2)} × {numberOfDays} = $
                            {(addon.price * numberOfDays).toFixed(2)}
                          </span>
                        </div>
                      )
                  )}

                  <div className="flex justify-between font-bold pt-2 border-t border-gray-200 mt-2">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 bg-red-800 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
