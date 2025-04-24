"use client";

// import { useToast } from "@/hooks/useTost";
import { Meal, Order, OrderStatus } from "./data";

// const { toast } = useToast();
import { toast } from "sonner";

// These would normally interact with an API or database
// For now, they're just simulating those actions

export async function createMeal(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast("Message sent!", {
        description: "Thanks for reaching out. I'll get back to you soon."
      });
    
    return { success: true };
  } catch (error) {
    toast("Message sent!", {
        description: "Thanks for reaching out. I'll get back to you soon."
      });
    
    return { success: false, error };
  }
}

export async function updateMeal(id: string, meal: Partial<Meal>) {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    
    return { success: true };
  } catch (error) {
    toast("Message sent!", {
        description: "Thanks for reaching out. I'll get back to you soon."
      });
    
    return { success: false, error };
  }
}

export async function deleteMeal(id: string, name: string) {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast("Message sent!", {
        description: "Thanks for reaching out. I'll get back to you soon."
      });
    
    return { success: true };
  } catch (error) {
    toast("Message sent!", {
        description: "Thanks for reaching out. I'll get back to you soon."
      });
    
    return { success: false, error };
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const statusMessages = {
      accepted: "Order has been accepted",
      declined: "Order has been declined",
      modified: "Order has been modified",
      completed: "Order has been marked as completed",
      cancelled: "Order has been cancelled",
    };
    
    toast("Message sent!", {
        description: "Thanks for reaching out. I'll get back to you soon."
      });
    
    return { success: true };
  } catch (error) {
    toast("Message sent!", {
        description: "Thanks for reaching out. I'll get back to you soon."
      });
    
    return { success: false, error };
  }
}