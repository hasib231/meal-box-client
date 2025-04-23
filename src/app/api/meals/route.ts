// src/app/api/meals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    
    if (!session || !session.user || session.user.role !== "provider") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Only providers can add meals." },
        { status: 403 }
      );
    }

    // Get the meal data from the request
    const mealData = await request.json();
    
    // Here you would typically send this data to your backend API
    // For example:
    // const backendResponse = await fetch("https://your-backend-url/api/meals", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${session.accessToken}`
    //   },
    //   body: JSON.stringify(mealData)
    // });
    // const data = await backendResponse.json();
    
    // For now, we'll just mock a successful response
    console.log("Meal data received:", mealData);
    
    return NextResponse.json({
      success: true,
      message: "Meal added successfully",
      data: {
        id: "meal_" + Date.now(),
        ...mealData,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Error adding meal:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to add meal"
    }, { status: 500 });
  }
}