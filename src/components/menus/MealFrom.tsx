"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Meal } from "@/lib/data";
import { createMeal, updateMeal } from "@/lib/actions";

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten Free" },
  { id: "dairy-free", label: "Dairy Free" },
  { id: "nut-free", label: "Nut Free" },
  { id: "low-carb", label: "Low Carb" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "high-protein", label: "High Protein" },
];

const categories = [
  "Bowls",
  "Salads",
  "Seafood",
  "Meat",
  "Vegetarian",
  "Vegan",
  "Breakfast",
  "Snacks",
  "Desserts",
];

const mealFormSchema = z.object({
  name: z.string().min(3, {
    message: "Meal name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().min(0.01, {
    message: "Price must be greater than 0.",
  }),
  image: z.string().url({
    message: "Please enter a valid URL for the image.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  dietaryOptions: z.array(z.string()).optional(),
  isAvailable: z.boolean().default(true),
});

type MealFormValues = z.infer<typeof mealFormSchema>;

interface MealFormProps {
  meal?: Meal;
  onSuccess: (data: MealFormValues) => void;
  onCancel: () => void;
}

export function MealForm({ meal, onSuccess, onCancel }: MealFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!meal;

  const defaultValues: Partial<MealFormValues> = {
    name: meal?.name || "",
    description: meal?.description || "",
    price: meal?.price || 0,
    image: meal?.image || "",
    category: meal?.category || "",
    dietaryOptions: meal?.dietaryOptions || [],
    isAvailable: meal?.isAvailable ?? true,
  };

  const form = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues,
  });

  async function onSubmit(data: MealFormValues) {
    setIsLoading(true);
    try {
      console.log("Form data in MealForm:", data);

      if (isEditing && meal) {
        await updateMeal(meal.id, data);
      } else {
        await createMeal(data);
      }

      onSuccess(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chicken Caesar Salad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Fresh romaine lettuce with grilled chicken, parmesan, and our homemade caesar dressing."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a URL for the meal image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="dietaryOptions"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Dietary Options</FormLabel>
                    <FormDescription>
                      Select all dietary options that apply to this meal.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {dietaryOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="dietaryOptions"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.label)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    return checked
                                      ? field.onChange([
                                          ...currentValue,
                                          option.label,
                                        ])
                                      : field.onChange(
                                          currentValue.filter(
                                            (value) => value !== option.label
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Available</FormLabel>
                    <FormDescription>
                      Make this meal available for ordering.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isEditing ? "Saving..." : "Creating..."}
              </span>
            ) : (
              <span>{isEditing ? "Save Changes" : "Create Meal"}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
