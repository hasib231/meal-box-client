"use client";

import { Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MealPlansPage() {
  const plans = [
    {
      name: "Weekly Essential",
      price: 89.99,
      period: "week",
      description: "Perfect for individuals seeking healthy, balanced meals",
      features: [
        "5 meals per week",
        "Customizable menu",
        "Weekly menu rotation",
        "Nutritional information",
        "Free delivery"
      ],
      popular: false
    },
    {
      name: "Family Feast",
      price: 159.99,
      period: "week",
      description: "Ideal for families wanting convenient, nutritious dining",
      features: [
        "10 meals per week",
        "Family-size portions",
        "Kid-friendly options",
        "Dietary preferences",
        "Priority delivery",
        "Weekend options"
      ],
      popular: true
    },
    {
      name: "Fitness Pro",
      price: 129.99,
      period: "week",
      description: "Tailored for fitness enthusiasts and athletes",
      features: [
        "7 meals per week",
        "High-protein options",
        "Macro tracking",
        "Custom portions",
        "Nutrition consultation",
        "Meal timing guide"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Flexible Meal Plans for
            <span className="text-red-600 dark:text-red-500"> Every Lifestyle</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Choose from our carefully crafted meal plans designed to meet your unique needs.
            Fresh, delicious, and delivered right to your door.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg">View Sample Menu</Button>
            <Button variant="outline" size="lg">
              Learn More <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Choose Your Perfect Plan
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Select from our range of flexible meal plans designed to fit your lifestyle and dietary preferences.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative flex flex-col ${plan.popular ? 'border-red-600 dark:border-red-500' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white dark:bg-red-500">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-300">/{plan.period}</span>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="mr-3 h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 dark:bg-gray-950 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Our Meal Plans?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Experience the convenience of chef-prepared meals with the flexibility to match your lifestyle.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  title: "Fresh & Nutritious",
                  description: "All meals are prepared fresh daily using high-quality, seasonal ingredients."
                },
                {
                  title: "Flexible & Convenient",
                  description: "Skip weeks, swap meals, or change plans anytime to fit your schedule."
                },
                {
                  title: "Expert-Crafted Menus",
                  description: "Our chefs and nutritionists work together to create balanced, delicious meals."
                }
              ].map((feature) => (
                <div key={feature.title} className="flex flex-col">
                  <dt className="text-xl font-semibold leading-7">{feature.title}</dt>
                  <dd className="mt-4 flex flex-auto flex-col leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}