"use client";

import { ArrowRight, Utensils, Truck, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Calendar,
      title: "Choose Your Plan",
      description: "Select from our flexible meal plans that fit your lifestyle and dietary preferences."
    },
    {
      icon: Utensils,
      title: "Customize Your Meals",
      description: "Pick your favorite meals from our weekly rotating menu of chef-crafted dishes."
    },
    {
      icon: Truck,
      title: "We Deliver Fresh",
      description: "Receive your freshly prepared meals at your doorstep at your chosen delivery time."
    },
    {
      icon: Heart,
      title: "Enjoy & Repeat",
      description: "Heat, eat, and enjoy your delicious meals. Modify next week's delivery as needed."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-red-600/20 pt-14">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Simple Steps to
              <span className="block text-red-600 dark:text-red-500">Delicious Meals</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Getting started with MealBox is easy. Follow these simple steps to begin your journey to convenient, 
              healthy eating.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg">Get Started Now</Button>
              <Button variant="outline" size="lg">
                View Menu <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-xl font-semibold leading-7">
                  <span className="text-red-600 dark:text-red-500">Step {index + 1}:</span>
                  <br />
                  {step.title}
                </div>
                <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Know
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Learn more about our service and how we make healthy eating effortless.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  title: "Flexible Subscriptions",
                  description: "Skip weeks, pause, or cancel anytime. No long-term commitments required."
                },
                {
                  title: "Fresh Ingredients",
                  description: "We source the freshest ingredients from local suppliers for maximum quality."
                },
                {
                  title: "Dietary Options",
                  description: "Customize your meals based on your dietary preferences and restrictions."
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