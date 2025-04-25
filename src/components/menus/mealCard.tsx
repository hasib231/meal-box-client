"use client";

import { useState } from 'react';
import { MoreVertical, Edit, Trash} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Meal } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteMeal, updateMeal } from '@/lib/actions';

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (meal: Meal) => void;
}

export function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
  const [isAvailable, setIsAvailable] = useState(meal.isAvailable);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAvailabilityToggle = async () => {
    setIsLoading(true);
    try {
      const newAvailability = !isAvailable;
      await updateMeal(meal.id, { isAvailable: newAvailability });
      setIsAvailable(newAvailability);
    } catch (error) {
      console.error('Failed to update meal availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteMeal(meal.id, meal.name);
      onDelete(meal);
    } catch (error) {
      console.error('Failed to delete meal:', error);
    } finally {
      setIsDeleteConfirmOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={meal.image}
            alt={meal.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute right-2 top-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(meal)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-8">
            <Badge
              variant="outline"
              className="bg-background/80 text-foreground backdrop-blur-sm"
            >
              {meal.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="line-clamp-1 text-lg font-semibold">{meal.name}</h3>
            <p className="font-medium tabular-nums">{formatCurrency(meal.price)}</p>
          </div>
          <p className="line-clamp-2 mb-3 text-sm text-muted-foreground">
            {meal.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {meal.dietaryOptions.map((option) => (
              <Badge key={option} variant="secondary" className="text-xs">
                {option}
              </Badge>
            ))}
          </div>
        </CardContent>

        <Separator />
        
        <CardFooter className="p-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch 
                id={`availability-${meal.id}`} 
                checked={isAvailable}
                onCheckedChange={handleAvailabilityToggle}
                disabled={isLoading}
              />
              <span className="text-sm">{isAvailable ? 'Available' : 'Unavailable'}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(meal)}
            >
              Edit Details
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {meal.name} from your menu. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}