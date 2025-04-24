"use client";

import { useState } from 'react';
import { Plus, Search, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MealCard } from '@/components/menus/mealCard';
import { MealForm } from '@/components/menus/MealFrom';
import { Meal, meals as initialMeals } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MenusPage() {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('name-asc');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | undefined>(undefined);

  // Extract unique categories
  const categories = ['all', ...new Set(meals.map((meal) => meal.category))];

  // Filter and sort meals
  const filteredMeals = meals.filter((meal) => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        meal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || meal.category === selectedCategory;
    const matchesAvailability = showAvailableOnly ? meal.isAvailable : true;
    
    return matchesSearch && matchesCategory && matchesAvailability;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'date-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'date-desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleAddMeal = () => {
    setSelectedMeal(undefined);
    setIsDialogOpen(true);
  };

  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsDialogOpen(true);
  };

  const handleDeleteMeal = (deletedMeal: Meal) => {
    setMeals(meals.filter((meal) => meal.id !== deletedMeal.id));
  };

  const handleMealFormSuccess = () => {
    // In a real app, we would refresh the meals from the API
    // For now, we'll just close the dialog
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
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
                    {category === 'all' ? 'All Categories' : category}
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
                  checked={sortBy === 'name-asc'}
                  onCheckedChange={(checked) => checked && setSortBy('name-asc')}
                >
                  Name (A-Z)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === 'name-desc'}
                  onCheckedChange={(checked) => checked && setSortBy('name-desc')}
                >
                  Name (Z-A)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === 'price-asc'}
                  onCheckedChange={(checked) => checked && setSortBy('price-asc')}
                >
                  Price (Low to High)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === 'price-desc'}
                  onCheckedChange={(checked) => checked && setSortBy('price-desc')}
                >
                  Price (High to Low)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === 'date-desc'}
                  onCheckedChange={(checked) => checked && setSortBy('date-desc')}
                >
                  Newest First
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === 'date-asc'}
                  onCheckedChange={(checked) => checked && setSortBy('date-asc')}
                >
                  Oldest First
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {filteredMeals.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8 text-center">
            <h3 className="text-xl font-medium">No meals found</h3>
            <p className="mt-2 text-muted-foreground">
              {searchQuery || selectedCategory !== 'all' || showAvailableOnly
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
            onSuccess={handleMealFormSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}